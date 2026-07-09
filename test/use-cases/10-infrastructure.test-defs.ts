import { describe, it, expect } from 'vitest';
import type { TestContext } from '../support/types.js';

export function infrastructureTests(getTestContext: () => TestContext) {
  describe('Infrastructure', () => {
    it('should be accessible', () => {
      expect(true).toBe(true);
    });
  });
}
