import * as crypto from "crypto";
import type { Collection } from "mongodb";
import { ObjectId } from "mongodb";

const OTP_TTL_MS = 10 * 60 * 1000;

type Channel = "email" | "phone";

const FIELDS: Record<Channel, { code: string; expiry: string }> = {
  email: { code: "emailOtpCode", expiry: "emailOtpExpiry" },
  phone: { code: "phoneOtpCode", expiry: "phoneOtpExpiry" },
};

export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function storeOtp(
  collection: Collection,
  userId: ObjectId,
  channel: Channel,
  code?: string,
): Promise<string> {
  const otp = code ?? generateOtp();
  const expiry = new Date(Date.now() + OTP_TTL_MS).toISOString();
  const fields = FIELDS[channel];
  await collection.updateOne(
    { _id: userId } as any,
    { $set: { [fields.code]: otp, [fields.expiry]: expiry } },
  );
  return otp;
}

export function verifyOtp(
  user: any,
  channel: Channel,
  code: string,
): { valid: boolean; error?: string } {
  const fields = FIELDS[channel];
  const storedCode = user[fields.code] as string | null | undefined;
  const storedExpiry = user[fields.expiry] as string | null | undefined;

  if (!storedCode || !storedExpiry) {
    return { valid: false, error: "No verification code was sent" };
  }
  if (new Date() > new Date(storedExpiry)) {
    return { valid: false, error: "Verification code has expired" };
  }
  if (storedCode !== code) {
    return { valid: false, error: "Invalid verification code" };
  }
  return { valid: true };
}

export async function clearOtp(
  collection: Collection,
  userId: ObjectId,
  channel: Channel,
): Promise<void> {
  const fields = FIELDS[channel];
  await collection.updateOne(
    { _id: userId } as any,
    { $set: { [fields.code]: null, [fields.expiry]: null } },
  );
}
