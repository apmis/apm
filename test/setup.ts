import { MongoMemoryReplSet } from 'mongodb-memory-server';
import supertest from 'supertest';
import type { TestContext, HttpRequest, HttpResponse } from './support/types.js';
import { createApp } from '../src/app.js';

let replSet: MongoMemoryReplSet;
let app: Awaited<ReturnType<typeof createApp>>;
let server: Awaited<ReturnType<typeof app.listen>>;
let baseUrl: string;

let callback: ReturnType<typeof app.callback>;

export function setCallback(cb: ReturnType<typeof app.callback>) {
  callback = cb;
}

class FeathersTestContext implements TestContext {
  private headers: Record<string, string> = {};

  constructor(headers?: Record<string, string>) {
    if (headers) this.headers = { ...headers };
  }

  async request(req: HttpRequest): Promise<HttpResponse> {
    const method = req.method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';
    const url = req.query
      ? `${req.path}?${new URLSearchParams(req.query).toString()}`
      : req.path;

    const superReq = (supertest(callback) as any)[method](url);
    for (const [key, value] of Object.entries(this.headers)) {
      superReq.set(key, value);
    }
    if (req.body && method !== 'get') {
      superReq.send(req.body as Record<string, unknown>);
    }
    if (req.headers) {
      for (const [key, value] of Object.entries(req.headers)) {
        superReq.set(key, value);
      }
    }
    const response = await superReq;
    return {
      status: response.status,
      body: response.body,
      headers: response.headers as Record<string, string>,
    };
  }

  async asAdmin(): Promise<TestContext> {
    const { body } = await this.request({
      method: 'POST',
      path: '/authentication',
      body: { strategy: 'local', email: 'admin@apm.test', password: 'password123' },
    });
    const token = (body as any).accessToken as string;
    return new FeathersTestContext({ Authorization: `Bearer ${token}` });
  }

  asPublic(): TestContext {
    return new FeathersTestContext();
  }

  async asUser(email: string, password: string): Promise<TestContext> {
    const { body } = await this.request({
      method: 'POST',
      path: '/authentication',
      body: { strategy: 'local', email, password },
    });
    const token = (body as any).accessToken as string;
    return new FeathersTestContext({ Authorization: `Bearer ${token}` });
  }

  async seed(): Promise<void> {
    await app.service('apm/users').create({
      email: 'admin@apm.test',
      password: 'password123',
      name: 'Admin User',
      permissions: ['*'],
    });
  }

  async cleanup(): Promise<void> {
    // Nothing per-test cleanup needed
  }
}

export function getTestContext(): TestContext {
  return new FeathersTestContext();
}

export async function setupTestEnvironment(): Promise<void> {
  replSet = await MongoMemoryReplSet.create({
    binary: { version: '6.0.6', downloadDir: './mongo-binaries' },
    replSet: { count: 1, storageEngine: 'wiredTiger' },
    instanceOpts: [{ launchTimeout: 60000 }],
  });

  app = await createApp({ mongodb: replSet.getUri(), paginate: false });
  server = await app.listen(0);
  baseUrl = `http://localhost:${(server as any).address().port}`;
  setCallback(app.callback());

  await app.service('apm/users').create({
    email: 'admin@apm.test',
    password: 'password123',
    name: 'Admin User',
    permissions: ['*'],
  });

  await app.service('apm/users').create({
    email: 'user@apm.test',
    password: 'password123',
    name: 'Regular User',
    permissions: [],
  });

}

export async function teardownTestEnvironment(): Promise<void> {
  if (server) await new Promise<void>((resolve) => server.close(() => resolve()));
  const mongoClient = await app?.get('mongodbClient');
  if (mongoClient) await mongoClient.close();
  if (replSet) await replSet.stop();
}

export { FeathersTestContext };
