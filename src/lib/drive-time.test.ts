import { describe, it, expect } from 'vitest';
import { formatDriveTime, parseDriveTime } from './drive-time';

describe('formatDriveTime', () => {
  it('formats values >= 60 as "Xh Ym"', () => {
    expect(formatDriveTime(150)).toBe('2h 30m');
    expect(formatDriveTime(60)).toBe('1h 0m');
    expect(formatDriveTime(90)).toBe('1h 30m');
    expect(formatDriveTime(120)).toBe('2h 0m');
  });

  it('formats values < 60 as "Ym"', () => {
    expect(formatDriveTime(45)).toBe('45m');
    expect(formatDriveTime(1)).toBe('1m');
    expect(formatDriveTime(59)).toBe('59m');
    expect(formatDriveTime(30)).toBe('30m');
  });

  it('formats 0 minutes as "0m"', () => {
    expect(formatDriveTime(0)).toBe('0m');
  });

  it('formats exactly 60 minutes as "1h 0m"', () => {
    expect(formatDriveTime(60)).toBe('1h 0m');
  });

  it('handles large values up to 600', () => {
    expect(formatDriveTime(600)).toBe('10h 0m');
    expect(formatDriveTime(599)).toBe('9h 59m');
    expect(formatDriveTime(330)).toBe('5h 30m');
  });
});

describe('parseDriveTime', () => {
  it('parses "Xh Ym" format', () => {
    expect(parseDriveTime('2h 30m')).toBe(150);
    expect(parseDriveTime('1h 0m')).toBe(60);
    expect(parseDriveTime('10h 0m')).toBe(600);
  });

  it('parses "Ym" format', () => {
    expect(parseDriveTime('45m')).toBe(45);
    expect(parseDriveTime('1m')).toBe(1);
    expect(parseDriveTime('0m')).toBe(0);
  });

  it('throws for invalid format', () => {
    expect(() => parseDriveTime('')).toThrow('Invalid drive time format');
    expect(() => parseDriveTime('2 hours')).toThrow('Invalid drive time format');
    expect(() => parseDriveTime('abc')).toThrow('Invalid drive time format');
    expect(() => parseDriveTime('2h30m')).toThrow('Invalid drive time format');
  });
});

describe('formatDriveTime and parseDriveTime round-trip', () => {
  it('round-trips correctly for values < 60', () => {
    for (const minutes of [0, 1, 15, 30, 45, 59]) {
      expect(parseDriveTime(formatDriveTime(minutes))).toBe(minutes);
    }
  });

  it('round-trips correctly for values >= 60', () => {
    for (const minutes of [60, 90, 120, 150, 270, 330, 600]) {
      expect(parseDriveTime(formatDriveTime(minutes))).toBe(minutes);
    }
  });
});
