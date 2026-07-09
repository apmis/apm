import { describe, it, expect } from 'vitest';
import type { TestContext } from '../support/types.js';

export function intelligenceTests(getTestContext: () => TestContext) {
  describe('Intelligence', () => {
    it('should be accessible', () => {
      expect(true).toBe(true);
    });
  });
}
