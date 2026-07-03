#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22

echo "=== Starting server ==="
npx tsx src/index.ts &
SERVER_PID=$!
sleep 7

BASE="http://localhost:3030/apm/auth"

echo ""
echo "=== 1. Register user ==="
curl -s --max-time 5 $BASE -X POST -H "Content-Type: application/json" \
  -d '{"method":"register","name":"Demo User","email":"demo@test.com","password":"Demo@12345"}'
echo ""

echo "=== 2. Get OTP from DB ==="
OTP=$(node -e "
require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.mongodb || 'mongodb://localhost:27017/apm-campaign';
new MongoClient(uri).connect().then(c => 
  c.db().collection('users').findOne({ email: 'demo@test.com' })
).then(u => { console.log(u.emailOtpCode); process.exit(0); }).catch(e => { console.error(e.message); process.exit(1); });
" 2>/dev/null)
echo "OTP=$OTP"

echo ""
echo "=== 3. Verify email ==="
curl -s --max-time 5 $BASE -X POST -H "Content-Type: application/json" \
  -d "{\"method\":\"verifyEmail\",\"email\":\"demo@test.com\",\"code\":\"$OTP\"}"
echo ""

echo ""
echo "=== 4. Login (post-verification) ==="
LOGIN1=$(curl -s --max-time 5 $BASE -X POST -H "Content-Type: application/json" \
  -d '{"method":"login","email":"demo@test.com","password":"Demo@12345"}')
echo "$LOGIN1"
CHALLENGE1=$(echo "$LOGIN1" | python3 -c "import sys,json; print(json.load(sys.stdin)['challengeToken'])" 2>/dev/null)

echo ""
echo "=== 5. Setup 2FA ==="
SETUP=$(curl -s --max-time 5 $BASE -X POST -H "Content-Type: application/json" \
  -d "{\"method\":\"setup2fa\",\"challengeToken\":\"$CHALLENGE1\"}")
echo "$SETUP"
SECRET=$(echo "$SETUP" | python3 -c "import sys,json; print(json.load(sys.stdin)['secret'])" 2>/dev/null)

echo ""
echo "=== 6. Enable 2FA ==="
TOTP1=$(node -e "const { generateSync } = require('otplib/functional'); console.log(generateSync({ secret: '$SECRET' }))")
echo "TOTP=$TOTP1"
ENABLE=$(curl -s --max-time 5 $BASE -X POST -H "Content-Type: application/json" \
  -d "{\"method\":\"enable2fa\",\"challengeToken\":\"$CHALLENGE1\",\"code\":\"$TOTP1\"}")
echo "$ENABLE"
TOKEN1=$(echo "$ENABLE" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null)
echo "Token: ${TOKEN1:0:40}..."

echo ""
echo "=== 7. Login again (2FA enabled) ==="
LOGIN2=$(curl -s --max-time 5 $BASE -X POST -H "Content-Type: application/json" \
  -d '{"method":"login","email":"demo@test.com","password":"Demo@12345"}')
echo "$LOGIN2"
CHALLENGE2=$(echo "$LOGIN2" | python3 -c "import sys,json; print(json.load(sys.stdin)['challengeToken'])" 2>/dev/null)

echo ""
echo "=== 8. Verify 2FA ==="
TOTP2=$(node -e "const { generateSync } = require('otplib/functional'); console.log(generateSync({ secret: '$SECRET' }))")
echo "TOTP=$TOTP2"
VERIFY=$(curl -s --max-time 5 $BASE -X POST -H "Content-Type: application/json" \
  -d "{\"method\":\"verify2fa\",\"challengeToken\":\"$CHALLENGE2\",\"code\":\"$TOTP2\"}")
echo "$VERIFY"
FINAL_TOKEN=$(echo "$VERIFY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null)

echo ""
echo "=== 9. States (public) ==="
curl -s --max-time 5 http://localhost:3030/apm/states | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{d[\"total\"]} states, first: {d[\"data\"][0][\"name\"]}')" 2>/dev/null

echo ""
echo "=== 10. VoterContacts (auth required) ==="
curl -s --max-time 5 http://localhost:3030/apm/voter-contacts \
  -H "Authorization: Bearer $FINAL_TOKEN" 2>/dev/null

echo ""
echo "=== DONE ==="

kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null
