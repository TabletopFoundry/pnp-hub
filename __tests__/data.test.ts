import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  DESIGNER_REVENUE_SHARE,
  DEFAULT_FEATURED_LIMIT,
  MAX_RELATED_GAMES,
} from '@/lib/constants';
import {
  getCraftGallery,
  getDesignerDashboard,
  getFeaturedGames,
  getGameBySlug,
  getGameOptions,
  getMarketplaceGames,
  getMonthlyCraftGame,
  getOptimizerGames,
  getRelatedGames,
  getReviewsForGame,
  getTutorials,
} from '@/lib/data';
import { createDraftGame, createSeededDatabase, resetDatabase } from '@/lib/db';

beforeEach(() => {
  const testDb = createSeededDatabase(':memory:');
  resetDatabase(testDb);
});

afterEach(() => {
  resetDatabase();
});

describe('getFeaturedGames', () => {
  it('returns an array of featured games', () => {
    const games = getFeaturedGames();
    expect(games.length).toBeGreaterThan(0);
    expect(games.length).toBeLessThanOrEqual(DEFAULT_FEATURED_LIMIT);
  });

  it('respects the limit parameter', () => {
    const games = getFeaturedGames(2);
    expect(games.length).toBeLessThanOrEqual(2);
  });

  it('returns games with expected shape', () => {
    const games = getFeaturedGames(1);
    const game = games[0];
    expect(game).toBeDefined();
    expect(game).toHaveProperty('slug');
    expect(game).toHaveProperty('title');
    expect(game).toHaveProperty('category');
    expect(game).toHaveProperty('accessType');
    expect(game).toHaveProperty('rating');
  });
});

describe('getGameBySlug', () => {
  it('returns a game when slug exists', () => {
    const featured = getFeaturedGames(1);
    const slug = featured[0]?.slug;
    expect(slug).toBeDefined();

    const game = getGameBySlug(slug!);
    expect(game).not.toBeNull();
    expect(game!.slug).toBe(slug);
    expect(game!.components).toBeInstanceOf(Array);
    expect(game!.gallery).toBeInstanceOf(Array);
  });

  it('returns null for non-existent slug', () => {
    const game = getGameBySlug('definitely-not-a-real-game-slug');
    expect(game).toBeNull();
  });
});

describe('getRelatedGames', () => {
  it('returns related games in the same category', () => {
    const featured = getFeaturedGames(1);
    const game = featured[0];
    expect(game).toBeDefined();

    const related = getRelatedGames(game!.category, game!.slug);
    expect(related.length).toBeLessThanOrEqual(MAX_RELATED_GAMES);
    for (const r of related) {
      expect(r.slug).not.toBe(game!.slug);
    }
  });
});

describe('getMarketplaceGames', () => {
  it('returns paginated results with default parameters', () => {
    const result = getMarketplaceGames({});
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBeGreaterThanOrEqual(1);
  });

  it('filters by category', () => {
    const result = getMarketplaceGames({ category: 'Strategy' });
    for (const game of result.items) {
      expect(game.category).toBe('Strategy');
    }
  });

  it('filters by search query', () => {
    const all = getMarketplaceGames({});
    const firstTitle = all.items[0]?.title ?? '';
    const keyword = firstTitle.split(' ')[0] ?? '';

    if (keyword) {
      const result = getMarketplaceGames({ query: keyword });
      expect(result.total).toBeGreaterThanOrEqual(1);
    }
  });

  it('handles empty results gracefully', () => {
    const result = getMarketplaceGames({ query: 'zzzzz_no_match_ever_zzzzz' });
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('sorts by price', () => {
    const result = getMarketplaceGames({ sort: 'price' });
    for (let i = 1; i < result.items.length; i++) {
      expect(result.items[i]!.priceCents).toBeGreaterThanOrEqual(result.items[i - 1]!.priceCents);
    }
  });
});

describe('getReviewsForGame', () => {
  it('returns reviews for an existing game', () => {
    const featured = getFeaturedGames(1);
    const game = featured[0];
    expect(game).toBeDefined();

    const fullGame = getGameBySlug(game!.slug);
    expect(fullGame).not.toBeNull();

    const reviews = getReviewsForGame(fullGame!.id);
    expect(reviews).toBeInstanceOf(Array);
    // Reviews may or may not exist depending on seed data
  });
});

describe('getTutorials', () => {
  it('returns seeded tutorials', () => {
    const tutorials = getTutorials();
    expect(tutorials.length).toBeGreaterThan(0);
    expect(tutorials[0]).toHaveProperty('title');
    expect(tutorials[0]).toHaveProperty('difficulty');
    expect(tutorials[0]).toHaveProperty('technique');
  });
});

describe('getCraftGallery', () => {
  it('returns seeded craft gallery items', () => {
    const gallery = getCraftGallery();
    expect(gallery.length).toBeGreaterThan(0);
    expect(gallery[0]).toHaveProperty('title');
    expect(gallery[0]).toHaveProperty('maker');
  });
});

describe('getMonthlyCraftGame', () => {
  it('returns a monthly craft game or null', () => {
    const game = getMonthlyCraftGame();
    // May or may not exist depending on seed data
    if (game) {
      expect(game).toHaveProperty('slug');
      expect(game).toHaveProperty('title');
    }
  });
});

describe('getGameOptions', () => {
  it('returns slug+title pairs sorted alphabetically', () => {
    const options = getGameOptions();
    expect(options.length).toBeGreaterThan(0);
    expect(options[0]).toHaveProperty('slug');
    expect(options[0]).toHaveProperty('title');

    // Verify alphabetical ordering
    for (let i = 1; i < options.length; i++) {
      expect(options[i]!.title.localeCompare(options[i - 1]!.title)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('getOptimizerGames', () => {
  it('returns optimizer-ready game data', () => {
    const games = getOptimizerGames();
    expect(games.length).toBeGreaterThan(0);
    const game = games[0]!;
    expect(game).toHaveProperty('slug');
    expect(game).toHaveProperty('sheetCount');
    expect(game).toHaveProperty('estimatedInk');
    expect(game).toHaveProperty('paperStockRecommendation');
  });
});

describe('getDesignerDashboard', () => {
  it('returns dashboard with summary metrics', () => {
    const dashboard = getDesignerDashboard();
    expect(dashboard.games.length).toBeGreaterThan(0);
    expect(dashboard.metrics).toBeInstanceOf(Array);
    expect(dashboard.geography).toBeInstanceOf(Array);
    expect(dashboard.summary).toHaveProperty('totalRevenue');
    expect(dashboard.summary).toHaveProperty('totalDownloads');
    expect(dashboard.summary).toHaveProperty('averageRating');
    expect(dashboard.summary).toHaveProperty('payoutShare');
    expect(dashboard.summary).toHaveProperty('platformShare');
  });

  it('calculates revenue split correctly using DESIGNER_REVENUE_SHARE', () => {
    const dashboard = getDesignerDashboard();
    const { totalRevenue, payoutShare, platformShare } = dashboard.summary;
    expect(payoutShare).toBe(Math.round(totalRevenue * DESIGNER_REVENUE_SHARE));
    expect(platformShare).toBe(totalRevenue - payoutShare);
    expect(payoutShare + platformShare).toBe(totalRevenue);
  });
});

describe('createDraftGame', () => {
  it('inserts a draft game into the database', () => {
    const before = getMarketplaceGames({});

    createDraftGame({
      title: 'Test Draft Game',
      description: 'A test game for the data layer.',
      category: 'Strategy',
      accessType: 'free',
      priceCents: 0,
      uploadedFiles: ['test.pdf'],
    });

    // Draft games won't show in marketplace (status = 'draft', not 'published')
    const after = getMarketplaceGames({});
    expect(after.total).toBe(before.total); // drafts are excluded from published queries

    // But should appear in designer dashboard
    const dashboard = getDesignerDashboard();
    const draft = dashboard.games.find((g) => g.title === 'Test Draft Game');
    expect(draft).toBeDefined();
    expect(draft!.status).toBe('draft');
  });
});
