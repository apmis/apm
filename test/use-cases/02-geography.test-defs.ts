import { describe, it, expect } from 'vitest';
import type { TestContext } from '../support/types.js';

export function geographyTests(getTestContext: () => TestContext) {
  describe('Geography', () => {
    it('should list states', async () => {
      const ctx = getTestContext();
      const res = await ctx.request({ method: 'GET', path: '/apm/states' });
      expect(res.status).toBe(200);
    });
  });
}
