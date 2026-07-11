import { Type, type Static } from "@sinclair/typebox";
import type { Application, Params } from "@feathersjs/feathers";
import { BadRequest, NotAuthenticated, NotFound } from "@feathersjs/errors";
import { compare, hash } from "bcryptjs";
import { generateSecret, generateURI, verifySync } from "otplib/functional";
import { SignJWT, jwtVerify } from "jose";
import QRCode from "qrcode";
import * as crypto from "crypto";
import { ObjectId } from "mongodb";
import { getCollection } from "../../mongodb.js";
import { sendEmail } from "../zeptomail.js";
import { sendSms } from "../termii.js";
import { FIELD_AGENT_PERMISSIONS } from "../../permissions.js";

const secretKey = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-do-not-use-in-production",
);

// ─── Schemas ───

export const AuthLoginSchema = Type.Object({
  email: Type.Optional(Type.String()),
  phone: Type.Optional(Type.String()),
  password: Type.String(),
});

export const AuthVerify2faSchema = Type.Object({
  challengeToken: Type.String(),
  code: Type.String(),
  type: Type.Optional(
    Type.Union([
      Type.Literal("totp"),
      Type.Literal("email"),
      Type.Literal("phone"),
    ]),
  ),
});

export const AuthSetup2faSchema = Type.Object({
  type: Type.Optional(
    Type.Union([
      Type.Literal("totp"),
      Type.Literal("email"),
      Type.Literal("phone"),
    ]),
  ),
  challengeToken: Type.Optional(Type.String()),
});

export const AuthEnable2faSchema = Type.Object({
  code: Type.String(),
  challengeToken: Type.Optional(Type.String()),
});

export const AuthDisable2faSchema = Type.Object({
  password: Type.String(),
});

export const AuthAddDeviceSchema = Type.Object({
  label: Type.Optional(Type.String()),
});

export const AuthConfirmDeviceSchema = Type.Object({
  code: Type.String(),
  secret: Type.String(),
  label: Type.Optional(Type.String()),
});

export const AuthRemoveDeviceSchema = Type.Object({
  deviceId: Type.String(),
});

export const AuthSendEmailOtpSchema = Type.Object({
  email: Type.String(),
});

export const AuthVerifyEmailSchema = Type.Object({
  email: Type.String(),
  code: Type.String(),
});

export const AuthForgotPasswordSchema = Type.Object({
  email: Type.String(),
});

export const AuthResetPasswordSchema = Type.Object({
  token: Type.String(),
  newPassword: Type.String({ minLength: 8 }),
});

export const AuthSendPhoneOtpSchema = Type.Object({
  phone: Type.String(),
});

export const AuthVerifyPhoneSchema = Type.Object({
  phone: Type.String(),
  code: Type.String(),
});

export const AuthResendOtpSchema = Type.Object({
  challengeToken: Type.String(),
});

export const AuthRegisterSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  email: Type.String(),
  phone: Type.Optional(Type.String()),
  password: Type.String({ minLength: 8 }),
});

// ─── Service ───

export class AuthService {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async create(data: any, params?: Params) {
    const method = data?.method;
    if (!method) throw new BadRequest("Method not specified");

    switch (method) {
      case "login":
        return this.login(data);
      case "register":
        return this.register(data);
      case "verify2fa":
        return this.verify2fa(data);
      case "setup2fa":
        return this.setup2fa(data, params);
      case "enable2fa":
        return this.enable2fa(data, params);
      case "disable2fa":
        return this.disable2fa(data, params);
      case "getDevices":
        return this.getDevices(params);
      case "addDevice":
        return this.addDevice(data, params);
      case "confirmDevice":
        return this.confirmDevice(data, params);
      case "removeDevice":
        return this.removeDevice(data, params);
      case "sendEmailOtp":
        return this.sendEmailOtp(data);
      case "verifyEmail":
        return this.verifyEmail(data);
      case "sendPhoneOtp":
        return this.sendPhoneOtp(data);
      case "verifyPhone":
        return this.verifyPhone(data);
      case "resendEmailOtp":
        return this.resendEmailOtp(data);
      case "resendPhoneOtp":
        return this.resendPhoneOtp(data);
      case "forgotPassword":
        return this.forgotPassword(data);
      case "resetPassword":
        return this.resetPassword(data);
      default:
        throw new BadRequest(`Unknown auth method: ${method}`);
    }
  }

  // ─── Login (First Factor) ───

  async login(data: Static<typeof AuthLoginSchema>) {
    const collection = await getCollection(this.app, "users");

    let user: any = null;
    if (data.email) {
      user = await collection.findOne({
        email: data.email.toLowerCase().trim(),
      });
    } else if (data.phone) {
      const phoneDigits = data.phone.replace(/\D/g, "");
      user = await collection.findOne({
        phoneNumber: { $regex: phoneDigits + "$" },
      });
    }
    if (!user || !user.password) {
      return { success: false, error: "Invalid email/phone or password" };
    }

    if (
      user.accountStatus === "suspended" ||
      user.accountStatus === "disabled" ||
      user.accountStatus === "locked"
    ) {
      return { success: false, error: "Account is not accessible" };
    }

    const isValid = await compare(data.password, user.password);
    if (!isValid) {
      return { success: false, error: "Invalid email/phone or password" };
    }

    if (user.email && !user.isEmailVerified) {
      const otp = crypto.randomInt(100000, 999999).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await collection.updateOne(
        { _id: user._id },
        { $set: { emailOtpCode: otp, emailOtpExpiry: expiry } },
      );

      await sendEmail({
        to: user.email,
        toName: user.name,
        subject: "Verify your email — APM Campaign",
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1a1a2e;">Email Verification</h2>
            <p>Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center;
                        padding: 16px; background: #f0f0f5; border-radius: 8px; margin: 16px 0;">
              ${otp}
            </div>
            <p style="color: #666;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>`,
        textBody: `Your verification code is: ${otp}. It expires in 10 minutes.`,
      });

      const challengeToken = await createChallengeToken(user._id.toString());
      return {
        success: true,
        needsEmailVerification: true,
        email: user.email,
        challengeToken,
        userId: user._id.toString(),
      };
    }

    const phoneVerificationPending = !!data.email && !!(user.phoneNumber && !user.isPhoneVerified);

    if (data.phone && user.phoneNumber && !user.isPhoneVerified) {
      const otp = crypto.randomInt(100000, 999999).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await collection.updateOne(
        { _id: user._id },
        { $set: { phoneOtpCode: otp, phoneOtpExpiry: expiry } },
      );

      try {
        await sendSms(
          user.phoneNumber,
          `Your APM Campaign verification code is: ${otp}. It expires in 10 minutes.`,
        );
      } catch (err) {
        console.error("[auth] Failed to send phone verification SMS:", err);
      }

      const challengeToken = await createChallengeToken(user._id.toString());
      return {
        success: true,
        needsPhoneVerification: true,
        phone: user.phoneNumber,
        challengeToken,
        userId: user._id.toString(),
      };
    }

    const totpEnabled = user.totpEnabled ?? false;
    if (totpEnabled) {
      const challengeToken = await createChallengeToken(user._id.toString());
      const method = user.twoFactorMethod || "totp";

      if (method === "email") {
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        await collection.updateOne(
          { _id: user._id },
          { $set: { emailOtpCode: otp, emailOtpExpiry: expiry } },
        );

        await sendEmail({
          to: user.email,
          toName: user.name,
          subject: "Your two-factor authentication code — APM Campaign",
          htmlBody: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #1a1a2e;">Two-Factor Authentication</h2>
              <p>Your authentication code is:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center;
                          padding: 16px; background: #f0f0f5; border-radius: 8px; margin: 16px 0;">
                ${otp}
              </div>
              <p style="color: #666;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
            </div>`,
          textBody: `Your two-factor authentication code is: ${otp}. It expires in 10 minutes.`,
        });
      }

      if (method === "phone") {
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        await collection.updateOne(
          { _id: user._id },
          { $set: { phoneOtpCode: otp, phoneOtpExpiry: expiry } },
        );

        try {
          await sendSms(
            user.phoneNumber,
            `Your APM Campaign 2FA code is: ${otp}. It expires in 10 minutes.`,
          );
        } catch (err) {
          console.error("[auth] Failed to send 2FA SMS:", err);
        }
      }

      return {
        success: true,
        twoFactorRequired: true,
        twoFactorMethod: method,
        challengeToken,
        userId: user._id.toString(),
      };
    }

    if (!user.totpSecret) {
      const challengeToken = await createChallengeToken(user._id.toString());
      return {
        success: true,
        twoFactorRequired: false,
        needsTwoFactorSetup: true,
        challengeToken,
        userId: user._id.toString(),
      };
    }

    const accessToken = await this.createAccessToken(user);
    return {
      success: true,
      accessToken,
      userId: user._id.toString(),
      ...(phoneVerificationPending ? { phoneVerificationPending: true, phone: user.phoneNumber } : {}),
    };
  }

  // ─── Register ───

  async register(data: Static<typeof AuthRegisterSchema>) {
    const collection = await getCollection(this.app, "users");
    const existing = await collection.findOne({
      email: data.email.toLowerCase().trim(),
    });
    if (existing) {
      return { success: false, error: "A user with this email already exists" };
    }

    const passwordHash = await hash(data.password, 12);
    const emailOtp = crypto.randomInt(100000, 999999).toString();
    const phoneOtp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const userId = new ObjectId();

    await collection.insertOne({
      _id: userId,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      phoneNumber: data.phone || null,
      password: passwordHash,
      permissions: FIELD_AGENT_PERMISSIONS,
      primaryRoleCode: "FIELD_AGENT",
      accountStatus: "active",
      isPhoneVerified: false,
      isEmailVerified: false,
      totpEnabled: false,
      twoFactorMethod: "none",
      emailOtpCode: emailOtp,
      emailOtpExpiry: expiry,
      phoneOtpCode: phoneOtp,
      phoneOtpExpiry: expiry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create a role-assignment so the sync hook can manage permissions
    try {
      const rolesCol = await getCollection(this.app, "roles");
      const fieldAgentRole = await rolesCol.findOne({ code: "FIELD_AGENT" });
      if (fieldAgentRole) {
        const assignmentsCol = await getCollection(this.app, "roleAssignments");
        await assignmentsCol.insertOne({
          userId: userId.toString(),
          roleId: fieldAgentRole._id.toString(),
          roleCode: "FIELD_AGENT",
          effectiveFrom: new Date().toISOString(),
          isPrimary: true,
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch { /* role assignment is best-effort during registration */ }

    await sendEmail({
      to: data.email.toLowerCase().trim(),
      toName: data.name,
      subject: "Welcome to APM Campaign — verify your email",
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Welcome to APM Campaign</h2>
          <p>Hello ${data.name},</p>
          <p>Your account has been created. Use the code below to verify your email:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center;
                      padding: 16px; background: #f0f0f5; border-radius: 8px; margin: 16px 0;">
            ${emailOtp}
          </div>
          <p style="color: #666;">This code expires in 10 minutes.</p>
        </div>`,
      textBody: `Welcome to APM Campaign, ${data.name}! Your email verification code is: ${emailOtp}. It expires in 10 minutes.`,
    });

    if (data.phone) {
      try {
        await sendSms(
          data.phone,
          `Welcome to APM Campaign, ${data.name}! Your phone verification code is: ${phoneOtp}. It expires in 10 minutes.`,
        );
      } catch (err) {
        console.error("[auth] Failed to send registration SMS:", err);
      }
    }

    return { success: true };
  }

  // ─── Verify 2FA ───

  async verify2fa(data: Static<typeof AuthVerify2faSchema>) {
    const userId = await verifyChallengeToken(data.challengeToken);
    if (!userId) {
      return { success: false, error: "Session expired. Please login again." };
    }

    const collection = await getCollection(this.app, "users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) return { success: false, error: "User not found" };

    const method = data.type || user.twoFactorMethod || "totp";
    let isValid = false;
    let matchedDeviceId: string | null = null;

    if (method === "email") {
      if (!user.emailOtpCode || !user.emailOtpExpiry) {
        return {
          success: false,
          error: "No OTP was sent. Please request a new code.",
        };
      }
      if (new Date() > new Date(user.emailOtpExpiry)) {
        return {
          success: false,
          error: "OTP has expired. Please request a new code.",
        };
      }
      isValid = user.emailOtpCode === data.code;
    } else if (method === "phone") {
      if (!user.phoneOtpCode || !user.phoneOtpExpiry) {
        return {
          success: false,
          error: "No OTP was sent. Please request a new code.",
        };
      }
      if (new Date() > new Date(user.phoneOtpExpiry)) {
        return {
          success: false,
          error: "OTP has expired. Please request a new code.",
        };
      }
      isValid = user.phoneOtpCode === data.code;
    } else {
      if (user.totpSecret && verifyTotpToken(data.code, user.totpSecret)) {
        isValid = true;
      }
      if (!isValid) {
        const devicesCollection = await getCollection(this.app, "userDevices");
        const devices = await devicesCollection
          .find({ userId, type: "totp" })
          .toArray();
        for (const device of devices) {
          if (verifyTotpToken(data.code, device.secret)) {
            isValid = true;
            matchedDeviceId = device._id.toString();
            break;
          }
        }
      }
    }

    if (!isValid) return { success: false, error: "Invalid verification code" };

    if (matchedDeviceId) {
      const devicesCollection = await getCollection(this.app, "userDevices");
      await devicesCollection.updateOne(
        { _id: new ObjectId(matchedDeviceId) },
        { $set: { lastUsedAt: new Date().toISOString() } },
      );
    }

    const accessToken = await this.createAccessToken(user);
    return { success: true, accessToken, userId: user._id.toString() };
  }

  // ─── 2FA Setup ───

  private async resolveUserId(
    data: any,
    params?: Params,
  ): Promise<string | null> {
    const fromJwt = this.getUserId(params);
    if (fromJwt) return fromJwt;
    if (data.challengeToken) {
      return verifyChallengeToken(data.challengeToken);
    }
    return null;
  }

  async setup2fa(data: Static<typeof AuthSetup2faSchema>, params?: Params) {
    const userId = await this.resolveUserId(data, params);
    if (!userId) return { success: false, error: "Not authenticated" };

    const collection = await getCollection(this.app, "users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) return { success: false, error: "User not found" };

    const method = data.type || "totp";

    if (method === "email") {
      const otp = crypto.randomInt(100000, 999999).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await collection.updateOne(
        { _id: user._id },
        {
          $set: {
            emailOtpCode: otp,
            emailOtpExpiry: expiry,
            twoFactorMethod: "email",
          },
        },
      );

      await sendEmail({
        to: user.email,
        toName: user.name,
        subject: "Set up two-factor authentication — APM Campaign",
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1a1a2e;">Two-Factor Authentication Setup</h2>
            <p>Use the code below to confirm email-based two-factor authentication:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center;
                        padding: 16px; background: #f0f0f5; border-radius: 8px; margin: 16px 0;">
              ${otp}
            </div>
            <p style="color: #666;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>`,
        textBody: `Your 2FA setup code is: ${otp}. It expires in 10 minutes.`,
      });

      return { success: true, enabled: false, method: "email" };
    }

    if (method === "phone") {
      const otp = crypto.randomInt(100000, 999999).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await collection.updateOne(
        { _id: user._id },
        {
          $set: {
            phoneOtpCode: otp,
            phoneOtpExpiry: expiry,
            twoFactorMethod: "phone",
          },
        },
      );

      try {
        await sendSms(
          user.phoneNumber,
          `Your APM Campaign 2FA setup code is: ${otp}. It expires in 10 minutes.`,
        );
      } catch (err) {
        console.error("[auth] Failed to send 2FA setup SMS:", err);
      }

      return { success: true, enabled: false, method: "phone" };
    }

    const secret = generateSecret();
    const uri = generateURI({
      issuer: "APM Campaign",
      label: user.email,
      secret,
      strategy: "totp",
    });
    const qrCode = await QRCode.toDataURL(uri);

    await collection.updateOne(
      { _id: user._id },
      { $set: { totpSecret: secret, twoFactorMethod: "totp" } },
    );

    return { success: true, enabled: false, method: "totp", secret, qrCode };
  }

  async enable2fa(data: Static<typeof AuthEnable2faSchema>, params?: Params) {
    const userId = await this.resolveUserId(data, params);
    if (!userId) return { success: false, error: "Not authenticated" };

    const collection = await getCollection(this.app, "users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) return { success: false, error: "User not found" };

    const method = user.twoFactorMethod || "totp";

    if (method === "email") {
      if (!user.emailOtpCode || !user.emailOtpExpiry) {
        return {
          success: false,
          error: "No pending 2FA setup. Start setup first.",
        };
      }
      if (new Date() > new Date(user.emailOtpExpiry)) {
        return { success: false, error: "OTP has expired. Start setup again." };
      }
      if (user.emailOtpCode !== data.code) {
        return { success: false, error: "Invalid verification code" };
      }
    } else if (method === "phone") {
      if (!user.phoneOtpCode || !user.phoneOtpExpiry) {
        return {
          success: false,
          error: "No pending 2FA setup. Start setup first.",
        };
      }
      if (new Date() > new Date(user.phoneOtpExpiry)) {
        return { success: false, error: "OTP has expired. Start setup again." };
      }
      if (user.phoneOtpCode !== data.code) {
        return { success: false, error: "Invalid verification code" };
      }
    } else {
      if (!user.totpSecret) {
        return {
          success: false,
          error: "No pending 2FA setup. Start setup first.",
        };
      }
      if (!verifyTotpToken(data.code, user.totpSecret)) {
        return { success: false, error: "Invalid verification code" };
      }
    }

    await collection.updateOne(
      { _id: user._id },
      { $set: { totpEnabled: true, emailOtpCode: null, emailOtpExpiry: null } },
    );

    if (method === "totp" && user.totpSecret) {
      const devicesCollection = await getCollection(this.app, "userDevices");
      await devicesCollection.insertOne({
        userId,
        type: "totp",
        secret: user.totpSecret,
        label: "Authenticator App",
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
      });
    }

    const accessToken = await this.createAccessToken(user);
    return { success: true, accessToken };
  }

  async disable2fa(data: Static<typeof AuthDisable2faSchema>, params?: Params) {
    const userId = this.getUserId(params);
    if (!userId) return { success: false, error: "Not authenticated" };

    const collection = await getCollection(this.app, "users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user || !user.password)
      return { success: false, error: "User not found" };

    const isValid = await compare(data.password, user.password);
    if (!isValid) return { success: false, error: "Invalid password" };

    const devicesCollection = await getCollection(this.app, "userDevices");
    await devicesCollection.deleteMany({ userId, type: "totp" });

    await collection.updateOne(
      { _id: user._id },
      { $set: { totpEnabled: false, totpSecret: null } },
    );

    return { success: true };
  }

  // ─── Device Management ───

  async getDevices(params?: Params) {
    const userId = this.getUserId(params);
    if (!userId) return { success: false, error: "Not authenticated" };

    const devicesCollection = await getCollection(this.app, "userDevices");
    const devices = await devicesCollection
      .find({ userId, type: "totp" })
      .sort({ createdAt: 1 })
      .toArray();

    return {
      success: true,
      devices: devices.map((d) => ({
        id: d._id.toString(),
        label: d.label,
        createdAt: d.createdAt,
        lastUsedAt: d.lastUsedAt,
      })),
    };
  }

  async addDevice(data: Static<typeof AuthAddDeviceSchema>, params?: Params) {
    const userId = this.getUserId(params);
    if (!userId) return { success: false, error: "Not authenticated" };

    const secret = generateSecret();
    const collection = await getCollection(this.app, "users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) return { success: false, error: "User not found" };

    const uri = generateURI({
      issuer: "APM Campaign",
      label: user.email,
      secret,
      strategy: "totp",
    });
    const qrCode = await QRCode.toDataURL(uri);

    return { success: true, secret, qrCode };
  }

  async confirmDevice(
    data: Static<typeof AuthConfirmDeviceSchema>,
    params?: Params,
  ) {
    const userId = this.getUserId(params);
    if (!userId) return { success: false, error: "Not authenticated" };

    if (!verifyTotpToken(data.code, data.secret)) {
      return { success: false, error: "Invalid verification code" };
    }

    const devicesCollection = await getCollection(this.app, "userDevices");
    await devicesCollection.insertOne({
      userId,
      type: "totp",
      secret: data.secret,
      label: data.label || "Authenticator App",
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
    });

    const collection = await getCollection(this.app, "users");
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { totpEnabled: true, twoFactorMethod: "totp" } },
    );

    return { success: true };
  }

  async removeDevice(
    data: Static<typeof AuthRemoveDeviceSchema>,
    params?: Params,
  ) {
    const userId = this.getUserId(params);
    if (!userId) return { success: false, error: "Not authenticated" };

    const devicesCollection = await getCollection(this.app, "userDevices");
    const device = await devicesCollection.findOne({
      _id: new ObjectId(data.deviceId),
      userId,
    });
    if (!device) return { success: false, error: "Device not found" };

    await devicesCollection.deleteOne({ _id: new ObjectId(data.deviceId) });

    const remaining = await devicesCollection.countDocuments({
      userId,
      type: "totp",
    });
    if (remaining === 0) {
      const collection = await getCollection(this.app, "users");
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { totpEnabled: false, totpSecret: null } },
      );
    }

    return { success: true };
  }

  // ─── Email OTP ───

  async sendEmailOtp(data: Static<typeof AuthSendEmailOtpSchema>) {
    const collection = await getCollection(this.app, "users");
    const user = await collection.findOne({
      email: data.email.toLowerCase().trim(),
    });
    if (!user) return { success: true };
    if (user.isEmailVerified) return { success: true };

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await collection.updateOne(
      { _id: user._id },
      { $set: { emailOtpCode: otp, emailOtpExpiry: expiry } },
    );

    await sendEmail({
      to: user.email,
      toName: user.name,
      subject: "Verify your email — APM Campaign",
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Email Verification</h2>
          <p>Your verification code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center;
                      padding: 16px; background: #f0f0f5; border-radius: 8px; margin: 16px 0;">
            ${otp}
          </div>
          <p style="color: #666;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>`,
      textBody: `Your verification code is: ${otp}. It expires in 10 minutes.`,
    });

    return { success: true };
  }

  async verifyEmail(data: Static<typeof AuthVerifyEmailSchema>) {
    const collection = await getCollection(this.app, "users");
    const user = await collection.findOne({
      email: data.email.toLowerCase().trim(),
    });
    if (!user) return { success: false, error: "User not found" };
    if (user.isEmailVerified) return { success: true };
    if (!user.emailOtpCode || !user.emailOtpExpiry) {
      return { success: false, error: "No verification code was sent" };
    }
    if (new Date() > new Date(user.emailOtpExpiry)) {
      return { success: false, error: "Verification code has expired" };
    }
    if (user.emailOtpCode !== data.code) {
      return { success: false, error: "Invalid verification code" };
    }

    await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          isEmailVerified: true,
          emailOtpCode: null,
          emailOtpExpiry: null,
        },
      },
    );

    return { success: true };
  }

  async sendPhoneOtp(data: Static<typeof AuthSendPhoneOtpSchema>) {
    const collection = await getCollection(this.app, "users");
    const phoneDigits = data.phone.replace(/\D/g, "");
    const user = await collection.findOne({
      phoneNumber: { $regex: phoneDigits + "$" },
    });
    if (!user) return { success: true };
    if (user.isPhoneVerified) return { success: true };

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await collection.updateOne(
      { _id: user._id },
      { $set: { phoneOtpCode: otp, phoneOtpExpiry: expiry } },
    );

    try {
      await sendSms(
        data.phone,
        `Your APM Campaign phone verification code is: ${otp}. It expires in 10 minutes.`,
      );
    } catch (err) {
      console.error("[auth] Failed to send phone OTP SMS:", err);
    }

    return { success: true };
  }

  async verifyPhone(data: Static<typeof AuthVerifyPhoneSchema>) {
    const collection = await getCollection(this.app, "users");
    const phoneDigits = data.phone.replace(/\D/g, "");
    const user = await collection.findOne({
      phoneNumber: { $regex: phoneDigits + "$" },
    });
    if (!user) return { success: false, error: "User not found" };
    if (user.isPhoneVerified) return { success: true };
    if (!user.phoneOtpCode || !user.phoneOtpExpiry) {
      return { success: false, error: "No verification code was sent" };
    }
    if (new Date() > new Date(user.phoneOtpExpiry)) {
      return { success: false, error: "Verification code has expired" };
    }
    if (user.phoneOtpCode !== data.code) {
      return { success: false, error: "Invalid verification code" };
    }

    await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          isPhoneVerified: true,
          phoneOtpCode: null,
          phoneOtpExpiry: null,
        },
      },
    );

    return { success: true };
  }

  async resendEmailOtp(data: Static<typeof AuthResendOtpSchema>) {
    const userId = await verifyChallengeToken(data.challengeToken);
    if (!userId) return { success: false, error: "Session expired" };

    const collection = await getCollection(this.app, "users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user || !user.totpEnabled) {
      return {
        success: false,
        error: "2FA is not configured for this account",
      };
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await collection.updateOne(
      { _id: user._id },
      { $set: { emailOtpCode: otp, emailOtpExpiry: expiry } },
    );

    await sendEmail({
      to: user.email,
      toName: user.name,
      subject: "Your two-factor authentication code — APM Campaign",
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Two-Factor Authentication</h2>
          <p>Your authentication code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center;
                      padding: 16px; background: #f0f0f5; border-radius: 8px; margin: 16px 0;">
            ${otp}
          </div>
          <p style="color: #666;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>`,
      textBody: `Your two-factor authentication code is: ${otp}. It expires in 10 minutes.`,
    });

    return { success: true };
  }

  async resendPhoneOtp(data: Static<typeof AuthResendOtpSchema>) {
    const userId = await verifyChallengeToken(data.challengeToken);
    if (!userId) return { success: false, error: "Session expired" };

    const collection = await getCollection(this.app, "users");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user || !user.phoneNumber) {
      return { success: false, error: "No phone number on this account" };
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await collection.updateOne(
      { _id: user._id },
      { $set: { phoneOtpCode: otp, phoneOtpExpiry: expiry } },
    );

    try {
      await sendSms(
        user.phoneNumber,
        `Your APM Campaign verification code is: ${otp}. It expires in 10 minutes.`,
      );
    } catch (err) {
      console.error("[auth] Failed to resend phone OTP SMS:", err);
    }

    return { success: true };
  }

  // ─── Password Reset ───

  async forgotPassword(data: Static<typeof AuthForgotPasswordSchema>) {
    const email = data.email.toLowerCase().trim();
    console.log(`[forgotPassword] Request for email: ${email}`);

    const collection = await getCollection(this.app, "users");
    const user = await collection.findOne({ email });

    if (!user) {
      console.log(`[forgotPassword] No user found for ${email} — returning success to prevent enumeration`);
      return { success: true };
    }

    console.log(`[forgotPassword] User found: ${user._id} (${user.name})`);

    const token = await new SignJWT({ email: user.email, purpose: "reset" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .setIssuedAt()
      .sign(secretKey);

    console.log(`[forgotPassword] Reset token generated for ${email}`);

    const clientOrigin = process.env.CLIENT_ORIGIN || "https://apm.app";
    const resetLink = `${clientOrigin}/reset-password/${token}`;

    console.log(`[forgotPassword] Calling sendEmail to ${user.email} with resetLink: ${resetLink}`);

    await sendEmail({
      to: user.email,
      toName: user.name,
      subject: "Reset your password — APM Campaign",
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Password Reset</h2>
          <p>Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetLink}"
             style="display: inline-block; padding: 12px 24px; background: #1a1a2e; color: #fff;
                    text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #666;">If you did not request a password reset, please ignore this email.</p>
        </div>`,
      textBody: `Reset your password here: ${resetLink}. This link expires in 1 hour.`,
    });

    console.log(`[forgotPassword] Email sent successfully to ${email}`);
    return { success: true };
  }

  async resetPassword(data: Static<typeof AuthResetPasswordSchema>) {
    try {
      const { payload } = await jwtVerify(data.token, secretKey);
      if (payload.purpose !== "reset" || !payload.email) {
        return { success: false, error: "Invalid or expired reset link" };
      }

      const passwordHash = await hash(data.newPassword, 12);
      const collection = await getCollection(this.app, "users");
      await collection.updateOne(
        { email: payload.email as string },
        { $set: { password: passwordHash } },
      );

      return { success: true };
    } catch {
      return { success: false, error: "Invalid or expired reset link" };
    }
  }

  // ─── Helpers ───

  private getUserId(params?: Params): string | null {
    const user = (params as any)?.user;
    return user?._id?.toString() || user?.id || null;
  }

  private async createAccessToken(user: any): Promise<string> {
    const authService = this.app.service("authentication");
    const token = await (authService as any).createAccessToken(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        permissions: user.permissions || [],
        primaryRoleCode: user.primaryRoleCode || "",
      },
      { subject: user._id.toString(), expiresIn: "1d" },
    );
    return token;
  }
}

// ─── TOTP Utilities ───

function verifyTotpToken(token: string, secret: string): boolean {
  const result = verifySync({ token, secret });
  return result.valid;
}

async function createChallengeToken(userId: string): Promise<string> {
  return new SignJWT({ userId, purpose: "2fa" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("5m")
    .setIssuedAt()
    .sign(secretKey);
}

async function verifyChallengeToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.purpose === "2fa" && payload.userId) {
      return payload.userId as string;
    }
    return null;
  } catch {
    return null;
  }
}

export type AuthServiceType = AuthService;

export const getOptions = (app: Application) => ({ app });
