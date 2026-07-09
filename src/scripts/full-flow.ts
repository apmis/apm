import { config } from 'dotenv';
config();
import { MongoClient } from 'mongodb';
import { authenticator } from 'otplib';

const uri = process.env.mongodb || 'mongodb://localhost:27017/apm-campaign';
async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  // Register a fresh user
  const email = `test${Date.now()}@test.com`;
  const password = 'Test@12345';
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await db.collection('users').insertOne({
    name: 'Test User',
    email,
    password: '$2a$12$LJ3m4ys3Lk0TSwHnbfOMe.X5S6UjGFREgHjVqGDVFsZ0TOxGON02O', // Test@12345
    permissions: ['polling_units_read', 'canvassing_reports_read', 'canvassing_reports_write', 'incidents_read', 'incidents_write'],
    primaryRoleCode: 'FIELD_AGENT',
    accountStatus: 'active',
    isPhoneVerified: false,
    isEmailVerified: false,
    totpEnabled: false,
    twoFactorMethod: 'none',
    emailOtpCode: otp,
    emailOtpExpiry: expiry,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  console.log(`USER_EMAIL=${email}`);
  console.log(`USER_PASSWORD=${password}`);
  console.log(`EMAIL_OTP=${otp}`);

  await client.close();
}
main().catch(e => { console.error(e); process.exit(1); });
