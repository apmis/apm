import { beforeAll, afterAll, test, expect } from 'vitest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import supertest from 'supertest';
import { createApp } from '../src/app.js';

let replSet: MongoMemoryReplSet;
let app: Awaited<ReturnType<typeof createApp>>;
let callback: ReturnType<typeof app.callback>;

beforeAll(async () => {
  replSet = await MongoMemoryReplSet.create({
    binary: { version: '6.0.6', downloadDir: './mongo-binaries' },
    replSet: { count: 1, storageEngine: 'wiredTiger' },
    instanceOpts: [{ launchTimeout: 60000 }],
  });
  app = await createApp({ mongodb: replSet.getUri(), paginate: false });
  callback = app.callback();
  await app.service('apm/users').create({
    email: 'admin@apm.test', password: 'password123',
    name: 'Admin User', permissions: ['apm_admin'],
  });
}, 60000);

afterAll(async () => { await replSet.stop(); }, 30000);

test('debug custom methods', async () => {
  const loginRes = await supertest(callback).post('/authentication')
    .send({ strategy: 'local', email: 'admin@apm.test', password: 'password123' });
  const token = loginRes.body.accessToken;

  // Try calling getSummary directly
  const svc = app.service('apm/canvassing-reports') as any;
  try {
    const result = await svc.getSummary({ provider: undefined });
    console.log('getSummary DIRECT:', JSON.stringify(result));
  } catch (e: any) {
    console.log('getSummary DIRECT ERROR:', e.message);
  }

  // Try calling via HTTP
  const r = await supertest(callback).post('/apm/canvassing-reports/getSummary')
    .set('Authorization', `Bearer ${token}`);
  console.log('getSummary HTTP:', r.status, JSON.stringify(r.body).slice(0, 200));
});
