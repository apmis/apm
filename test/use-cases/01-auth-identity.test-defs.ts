import { describe, it, expect } from 'vitest';
import type { TestContext } from '../support/types.js';

export function authIdentityTests(getTestContext: () => TestContext) {
  describe('Auth Identity', () => {
    it('should login as admin', async () => {
      const ctx = getTestContext();
      const admin = await ctx.asAdmin();
      expect(admin).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const ctx = getTestContext();
      const res = await ctx.request({
        method: 'POST',
        path: '/authentication',
        body: { strategy: 'local', email: 'nonexistent@test.com', password: 'wrong' },
      });
      expect(res.status).toBe(401);
    });

    it('should register a new user', async () => {
      const ctx = getTestContext();
      const res = await ctx.request({
        method: 'POST',
        path: '/apm/auth',
        body: { method: 'register', name: 'Test New User', email: 'test-new-reg@example.com', password: 'password123' },
      });
      expect(res.status).toBe(201);
      expect((res.body as any).success).toBe(true);
    });

    it('should not register a duplicate email', async () => {
      const ctx = getTestContext();
      const res = await ctx.request({
        method: 'POST',
        path: '/apm/auth',
        body: { method: 'register', name: 'Admin Dupe', email: 'admin@apm.test', password: 'password123' },
      });
      expect(res.status).toBe(201);
      expect((res.body as any).success).toBe(false);
    });
  });
}
