import { describe, it, expect } from 'vitest';
import type { TestContext } from '../support/types.js';

export function userAdminTests(getTestContext: () => TestContext) {
  describe('User Admin - Two-Step Creation', () => {
    it('Step 1: should create a user with basic info', async () => {
      const ctx = getTestContext();
      const admin = await ctx.asAdmin();

      const res = await admin.request({
        method: 'POST',
        path: '/apm/users',
        body: {
          name: 'New Staff',
          email: 'staff@apm.test',
          password: 'tempPass123',
          phoneNumber: '+2348012345678',
        },
      });

      expect(res.status).toBe(201);
      const body = res.body as any;
      expect(body.name).toBe('New Staff');
      expect(body.email).toBe('staff@apm.test');
      expect(body._id).toBeDefined();
    });

    it('Step 2: should set permissions and geography scope for a user', async () => {
      const ctx = getTestContext();
      const admin = await ctx.asAdmin();

      const createRes = await admin.request({
        method: 'POST',
        path: '/apm/users',
        body: {
          name: 'Scope User',
          email: 'scope@apm.test',
          password: 'tempPass123',
        },
      });
      expect(createRes.status).toBe(201);
      const userId = (createRes.body as any)._id;

      const setupRes = await admin.request({
        method: 'POST',
        path: `/apm/users/${userId}/setupPermissions`,
        body: {
          permissions: ['users_read', 'canvassing_reports_write', 'wards_read'],
          geographyAssignments: [
            {
              scopeLevel: 'lga',
              lgaId: '507f1f77bcf86cd799439011',
              canViewChildren: true,
              effectiveFrom: '2026-01-01T00:00:00.000Z',
            },
          ],
        },
      });

      expect(setupRes.status).toBe(201);
      const setupBody = setupRes.body as any;
      expect(setupBody.permissions).toContain('users_read');
      expect(setupBody.permissions).toContain('canvassing_reports_write');
      expect(setupBody.accountStatus).toBe('active');
    });

    it('should reject setupPermissions without admin auth', async () => {
      const ctx = getTestContext();
      const res = await ctx.request({
        method: 'POST',
        path: '/apm/users/fakeid123/setupPermissions',
        body: { permissions: ['users_read'] },
      });
      expect(res.status).toBe(401);
    });

    it('should fail setupPermissions for non-existent user', async () => {
      const ctx = getTestContext();
      const admin = await ctx.asAdmin();
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await admin.request({
        method: 'POST',
        path: `/apm/users/${fakeId}/setupPermissions`,
        body: { permissions: ['users_read'] },
      });
      expect(res.status >= 400).toBe(true);
    });
  });
}
