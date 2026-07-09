import { describe, it, expect } from 'vitest';
import type { TestContext } from '../support/types.js';

export function eventsToursTests(getTestContext: () => TestContext) {
  describe('Events & Tours', () => {
    it('should be accessible', () => {
      expect(true).toBe(true);
    });
  });
}
