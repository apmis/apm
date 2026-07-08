import { config } from 'dotenv';
config();
import { MongoClient } from 'mongodb';
import { TOTP } from 'otplib';
const totp = new TOTP();

const API = 'http://localhost:3030/apm/auth';

async function api(method: string, data: any) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, ...data }),
  });
  return res.json();
}

async function main() {
  const uri = process.env.mongodb || 'mongodb://localhost:27017/apm-campaign';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  // 1. Register
  console.log('--- Register ---');
  const reg = await api('register', { name: 'Demo User', email: 'demo@test.com', password: 'Demo@12345' });
  console.log(JSON.stringify(reg));

  // 2. Get OTP
  const user = await db.collection('users').findOne({ email: 'demo@test.com' });
  const otp = user?.emailOtpCode;
  console.log(`\n--- Verify Email (OTP: ${otp}) ---`);
  const verify = await api('verifyEmail', { email: 'demo@test.com', code: otp });
  console.log(JSON.stringify(verify));

  // 3. Login
  console.log('\n--- Login ---');
  const login1 = await api('login', { email: 'demo@test.com', password: 'Demo@12345' });
  console.log(JSON.stringify(login1));
  const challenge1 = login1.challengeToken;

  // 4. Setup 2FA
  console.log('\n--- Setup 2FA ---');
  const setup = await api('setup2fa', { challengeToken: challenge1 });
  const secret = setup.secret;
  console.log(`TOTP Secret: ${secret}`);

  // 5. Enable 2FA
  const totpCode = totp.generate(secret);
  console.log(`\n--- Enable 2FA (code: ${totpCode}) ---`);
  const enable = await api('enable2fa', { challengeToken: challenge1, code: totpCode });
  console.log(`Access token: ${(enable.accessToken || '').substring(0, 30)}...`);

  // 6. Login again (2FA required)
  console.log('\n--- Login (2FA enabled) ---');
  const login2 = await api('login', { email: 'demo@test.com', password: 'Demo@12345' });
  console.log(JSON.stringify(login2));
  const challenge2 = login2.challengeToken;

  // 7. Verify 2FA
  const totpCode2 = totp.generate(secret);
  console.log(`\n--- Verify 2FA (code: ${totpCode2}) ---`);
  const final = await api('verify2fa', { challengeToken: challenge2, code: totpCode2, method: 'totp' });
  const token = final.accessToken;
  console.log(`Final token: ${(token || '').substring(0, 40)}...`);

  // 8. Test protected endpoint
  if (token) {
    console.log('\n--- Test /apm/states (public) ---');
    const states = await (await fetch('http://localhost:3030/apm/states')).json();
    console.log(`States: ${states.total}`);

    console.log('\n--- Test /apm/voter-contacts (auth required) ---');
    const vc = await (await fetch('http://localhost:3030/apm/voter-contacts', {
      headers: { Authorization: `Bearer ${token}` },
    })).json();
    console.log(`VoterContacts: ${JSON.stringify(vc).substring(0, 100)}`);
  }

  await client.close();
}

main().catch(e => { console.error(e); process.exit(1); });
