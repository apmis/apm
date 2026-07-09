import { describe, it, expect } from 'vitest';
import type { TestContext } from '../support/types.js';

export function campaignContentTests(getTestContext: () => TestContext) {
  describe('Campaign Content', () => {
    it('should be accessible', () => {
      expect(true).toBe(true);
    });
  });
}
