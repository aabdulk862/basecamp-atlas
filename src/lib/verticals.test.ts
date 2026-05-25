import { describe, it, expect } from 'vitest';
import { getActiveVertical, validateVerticals } from './verticals';
import type { VerticalConfig } from './types';

const liveVertical: VerticalConfig = {
  id: 'live',
  name: 'Live',
  description: 'Interactive apartment finder with map and scoring',
  routePrefix: '/live',
  palette: 'live.css',
  order: 1,
};

const escapeVertical: VerticalConfig = {
  id: 'escape',
  name: 'Escape',
  description: 'Curated nature retreats within driving distance',
  routePrefix: '/escape',
  palette: 'escape.css',
  contentCollection: 'properties',
  order: 2,
};

const verticals = [liveVertical, escapeVertical];

describe('getActiveVertical', () => {
  it('returns the matching vertical for an exact route prefix', () => {
    expect(getActiveVertical('/live', verticals)).toEqual(liveVertical);
    expect(getActiveVertical('/escape', verticals)).toEqual(escapeVertical);
  });

  it('returns the matching vertical for a sub-path', () => {
    expect(getActiveVertical('/escape/asheville', verticals)).toEqual(escapeVertical);
    expect(getActiveVertical('/live/details', verticals)).toEqual(liveVertical);
  });

  it('returns null when no vertical matches', () => {
    expect(getActiveVertical('/', verticals)).toBeNull();
    expect(getActiveVertical('/about', verticals)).toBeNull();
  });

  it('uses longest prefix match', () => {
    const nestedVertical: VerticalConfig = {
      id: 'escape-seasonal',
      name: 'Seasonal',
      description: 'Seasonal guides',
      routePrefix: '/escape/seasonal',
      palette: 'escape.css',
      order: 3,
    };
    const allVerticals = [...verticals, nestedVertical];

    expect(getActiveVertical('/escape/seasonal/fall', allVerticals)).toEqual(nestedVertical);
    expect(getActiveVertical('/escape/asheville', allVerticals)).toEqual(escapeVertical);
  });

  it('does not match partial prefix (e.g., /lively should not match /live)', () => {
    expect(getActiveVertical('/lively', verticals)).toBeNull();
    expect(getActiveVertical('/escaping', verticals)).toBeNull();
  });
});

describe('validateVerticals', () => {
  it('passes for valid configs', () => {
    expect(() => validateVerticals(verticals)).not.toThrow();
  });

  it('throws for missing required field: id', () => {
    const invalid = [{ ...liveVertical, id: '' }];
    expect(() => validateVerticals(invalid)).toThrow(/missing required field.*id/i);
  });

  it('throws for missing required field: name', () => {
    const invalid = [{ ...liveVertical, name: '' }];
    expect(() => validateVerticals(invalid)).toThrow(/missing required field.*name/i);
  });

  it('throws for missing required field: routePrefix', () => {
    const invalid = [{ ...liveVertical, routePrefix: '' }];
    expect(() => validateVerticals(invalid)).toThrow(/missing required field.*routePrefix/i);
  });

  it('throws for missing required field: palette', () => {
    const invalid = [{ ...liveVertical, palette: '' }];
    expect(() => validateVerticals(invalid)).toThrow(/missing required field.*palette/i);
  });

  it('throws for name exceeding 20 characters', () => {
    const invalid = [{ ...liveVertical, name: 'A'.repeat(21) }];
    expect(() => validateVerticals(invalid)).toThrow(/exceeds 20 characters/i);
  });

  it('throws for routePrefix not starting with /', () => {
    const invalid = [{ ...liveVertical, routePrefix: 'live' }];
    expect(() => validateVerticals(invalid)).toThrow(/must start with "\/"/i);
  });

  it('throws for duplicate route prefixes', () => {
    const duplicate = [
      liveVertical,
      { ...escapeVertical, routePrefix: '/live' },
    ];
    expect(() => validateVerticals(duplicate)).toThrow(/duplicate routePrefix "\/live"/i);
  });

  it('allows name exactly 20 characters', () => {
    const valid = [{ ...liveVertical, name: 'A'.repeat(20) }];
    expect(() => validateVerticals(valid)).not.toThrow();
  });
});
