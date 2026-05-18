import { afterEach, describe, expect, it, vi } from 'vitest';

import { createDatabase, createSeededDatabase, resetDatabase, seedDatabase } from '@/lib/db';
import { seededGames, seededReviews } from '@/lib/seed';

afterEach(() => {
  resetDatabase();
  vi.unstubAllEnvs();
});

describe('seedDatabase', () => {
  it('is idempotent when run multiple times against the same database', () => {
    const db = createDatabase(':memory:');

    seedDatabase(db, { forceSeed: true });
    seedDatabase(db, { forceSeed: true });

    const gameCount = (db.prepare("SELECT COUNT(*) as count FROM games WHERE status = 'published'").get() as { count: number }).count;
    const reviewCount = (db.prepare('SELECT COUNT(*) as count FROM reviews').get() as { count: number }).count;

    expect(gameCount).toBe(seededGames.length);
    expect(reviewCount).toBe(seededReviews.length);

    db.close();
  });

  it('skips auto-seeding in production unless explicitly allowed', () => {
    vi.stubEnv('NODE_ENV', 'production');

    const guardedDb = createDatabase(':memory:');
    expect(seedDatabase(guardedDb)).toBe(false);
    expect((guardedDb.prepare('SELECT COUNT(*) as count FROM games').get() as { count: number }).count).toBe(0);
    guardedDb.close();

    vi.stubEnv('PNP_HUB_ALLOW_PRODUCTION_SEED', 'true');
    const allowedDb = createDatabase(':memory:');
    expect(seedDatabase(allowedDb)).toBe(true);
    expect((allowedDb.prepare('SELECT COUNT(*) as count FROM games').get() as { count: number }).count).toBe(seededGames.length);
    allowedDb.close();
  });

  it('allows explicitly seeded test databases even when NODE_ENV is production', () => {
    vi.stubEnv('NODE_ENV', 'production');

    const db = createSeededDatabase(':memory:');
    expect((db.prepare('SELECT COUNT(*) as count FROM games').get() as { count: number }).count).toBe(seededGames.length);
    db.close();
  });
});
