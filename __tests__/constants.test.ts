import { describe, expect, it } from 'vitest';

import {
  ACCESS_TYPES,
  DESIGNER_REVENUE_SHARE,
  GAME_CATEGORIES,
  PLATFORM_REVENUE_SHARE,
} from '@/lib/constants';

describe('revenue split', () => {
  it('designer and platform shares sum to 1', () => {
    expect(DESIGNER_REVENUE_SHARE + PLATFORM_REVENUE_SHARE).toBeCloseTo(1);
  });

  it('designer share is between 0 and 1 exclusive', () => {
    expect(DESIGNER_REVENUE_SHARE).toBeGreaterThan(0);
    expect(DESIGNER_REVENUE_SHARE).toBeLessThan(1);
  });
});

describe('GAME_CATEGORIES', () => {
  it('contains expected categories', () => {
    expect(GAME_CATEGORIES).toContain('Strategy');
    expect(GAME_CATEGORIES).toContain('Solo');
    expect(GAME_CATEGORIES).toContain('2-Player');
  });

  it('has no duplicates', () => {
    const unique = new Set(GAME_CATEGORIES);
    expect(unique.size).toBe(GAME_CATEGORIES.length);
  });
});

describe('ACCESS_TYPES', () => {
  it('contains all expected access types', () => {
    expect(ACCESS_TYPES).toEqual(['free', 'included', 'purchase']);
  });
});
