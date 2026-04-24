import Link from 'next/link';
import type { Metadata } from 'next';

import { GameCard } from '@/app/components/game-card';
import { MarketplaceFilterForm } from '@/app/components/marketplace-filter-form';
import { StatePanel } from '@/app/components/state-panel';
import { getMarketplaceGames } from '@/lib/data';
import type { MarketplaceFilters } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Browse and filter the full catalog of print-and-play board games.',
};

type MarketplacePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function asString(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : '';
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const resolved = await searchParams;
  const filters: MarketplaceFilters = {
    query: asString(resolved.q),
    category: asString(resolved.category),
    players: asString(resolved.players),
    complexity: asString(resolved.complexity),
    price: asString(resolved.price),
    rating: asString(resolved.rating),
    sort: asString(resolved.sort) || 'newest',
    access: asString(resolved.access),
  };

  const result = getMarketplaceGames(filters);

  return (
    <div className="section-shell py-12">
      <div className="paper-panel rounded-[2.2rem] border border-[var(--border-light)] p-7 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Marketplace</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="section-title font-semibold text-[var(--ink)]">Browse print-and-play gems by budget, player count, and print complexity</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-body)]">
              Search by title or designer, compare Free vs Premium offerings, and tune results for your next family night, solo puzzle, or strategy session.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white/70 px-4 py-3 text-sm text-[var(--text-secondary)]">{result.total} titles match right now</div>
        </div>
        <MarketplaceFilterForm />
      </div>

      <div className="mt-8">
        {result.items.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        ) : (
          <StatePanel
            eyebrow="Empty results"
            title="No matching games found"
            description="Try clearing a few filters or broaden the player count and price range to uncover more printable gems."
            action={
              <Link href="/marketplace" className="focus-ring rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Clear filters
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
