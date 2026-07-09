import { describe, it, expect } from 'vitest';
import type { TestContext } from '../support/types.js';

export function conversionTests(getTestContext: () => TestContext) {
  describe('Conversion', () => {
    it('should be accessible', () => {
      expect(true).toBe(true);
    });
  });
}
