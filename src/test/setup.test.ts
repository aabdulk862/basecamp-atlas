import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

describe('Testing infrastructure', () => {
  it('vitest runs correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('fast-check runs with minimum 100 iterations', () => {
    let runCount = 0;
    fc.assert(
      fc.property(fc.integer(), (n) => {
        runCount++;
        return typeof n === 'number';
      })
    );
    expect(runCount).toBeGreaterThanOrEqual(100);
  });
});
