import { config } from 'dotenv';
config();
import { MongoClient } from 'mongodb';

const uri = process.env.mongodb || 'mongodb://localhost:27017/apm-campaign';
const client = new MongoClient(uri);
async function main() {
  await client.connect();
  const db = client.db();
  for (const email of ['demo@test.com', 'admin@apm.test']) {
    const user = await db.collection('users').findOne({ email });
    if (user) {
      console.log(`\n${email}:`);
      console.log('  OTP:', user.emailOtpCode);
      console.log('  email verified:', user.isEmailVerified);
      console.log('  totpEnabled:', user.totpEnabled);
      console.log('  totpSecret:', user.totpSecret || '(none)');
      console.log('  accountStatus:', user.accountStatus);
    }
  }
  await client.close();
}
main().catch(e => { console.error(e); process.exit(1); });
