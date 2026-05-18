import { describe, expect, it } from 'vitest';

import {
  seededCraftAlongSchedule,
  seededCraftGallery,
  seededDesignerProfiles,
  seededGames,
  seededReviews,
  seededTutorials,
} from '@/lib/seed';

describe('seed dataset richness', () => {
  it('contains 50+ games across every supported category', () => {
    expect(seededGames.length).toBeGreaterThanOrEqual(50);
    expect(new Set(seededGames.map((game) => game.category))).toEqual(
      new Set(['Strategy', 'Party', 'Solo', 'Family', 'Educational', 'Cooperative', 'Card', '2-Player'])
    );
  });

  it('mixes free and paid catalog entries within the target price range', () => {
    expect(seededGames.some((game) => game.accessType === 'free')).toBe(true);
    expect(seededGames.some((game) => game.accessType === 'purchase')).toBe(true);
    expect(Math.max(...seededGames.map((game) => game.priceCents))).toBeLessThanOrEqual(1500);
    expect(Math.min(...seededGames.map((game) => game.priceCents))).toBe(0);
  });

  it('includes long descriptions, zero-review games, and a large review corpus', () => {
    expect(seededReviews.length).toBeGreaterThanOrEqual(100);
    expect(seededGames.some((game) => game.ratingCount === 0)).toBe(true);
    expect(seededGames.some((game) => game.description.length > 1000)).toBe(true);
  });

  it('seeds designer profiles, tutorials, craft gallery entries, and craft-along schedule', () => {
    expect(seededDesignerProfiles.length).toBeGreaterThanOrEqual(10);
    expect(seededDesignerProfiles.some((designer) => designer.gameCount === 1)).toBe(true);
    expect(seededCraftGallery.length).toBeGreaterThanOrEqual(20);
    expect(seededTutorials.length).toBeGreaterThanOrEqual(15);
    expect(seededCraftAlongSchedule.length).toBeGreaterThanOrEqual(12);
  });
});
