import { describe, it, expect } from 'vitest';
import { getScoreColor } from './score-color';

describe('getScoreColor', () => {
  it('returns green (#22c55e) for scores >= 8', () => {
    expect(getScoreColor(8)).toBe('#22c55e');
    expect(getScoreColor(9)).toBe('#22c55e');
    expect(getScoreColor(10)).toBe('#22c55e');
    expect(getScoreColor(8.5)).toBe('#22c55e');
  });

  it('returns lime (#84cc16) for scores >= 7 and < 8', () => {
    expect(getScoreColor(7)).toBe('#84cc16');
    expect(getScoreColor(7.5)).toBe('#84cc16');
    expect(getScoreColor(7.99)).toBe('#84cc16');
  });

  it('returns yellow (#eab308) for scores >= 6 and < 7', () => {
    expect(getScoreColor(6)).toBe('#eab308');
    expect(getScoreColor(6.5)).toBe('#eab308');
    expect(getScoreColor(6.99)).toBe('#eab308');
  });

  it('returns orange (#f97316) for scores >= 5 and < 6', () => {
    expect(getScoreColor(5)).toBe('#f97316');
    expect(getScoreColor(5.5)).toBe('#f97316');
    expect(getScoreColor(5.99)).toBe('#f97316');
  });

  it('returns red (#ef4444) for scores < 5', () => {
    expect(getScoreColor(4)).toBe('#ef4444');
    expect(getScoreColor(4.99)).toBe('#ef4444');
    expect(getScoreColor(0)).toBe('#ef4444');
    expect(getScoreColor(1)).toBe('#ef4444');
  });

  it('handles boundary values correctly', () => {
    expect(getScoreColor(5)).toBe('#f97316');   // exactly 5 → orange
    expect(getScoreColor(6)).toBe('#eab308');   // exactly 6 → yellow
    expect(getScoreColor(7)).toBe('#84cc16');   // exactly 7 → lime
    expect(getScoreColor(8)).toBe('#22c55e');   // exactly 8 → green
  });
});
