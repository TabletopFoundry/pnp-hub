import Link from 'next/link';

import { GameCard } from '@/app/components/game-card';
import { StatePanel } from '@/app/components/state-panel';
import { getMarketplaceGames } from '@/lib/data';
import type { MarketplaceFilters } from '@/lib/types';

export const dynamic = 'force-dynamic';

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

  const games = getMarketplaceGames(filters);
  const activeFilters = Object.entries(filters).filter(([, value]) => value && value !== 'newest' && value !== '');

  return (
    <div className="section-shell py-12">
      <div className="paper-panel rounded-[2.2rem] border border-[rgba(77,57,36,0.08)] p-7 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Marketplace</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="section-title font-semibold text-[var(--ink)]">Browse print-and-play gems by budget, player count, and print complexity</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[rgba(58,43,31,0.76)]">
              Search by title or designer, compare Free vs Premium offerings, and tune results for your next family night, solo puzzle, or strategy session.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white/70 px-4 py-3 text-sm text-[rgba(58,43,31,0.74)]">{games.length} titles match right now</div>
        </div>
        <form className="mt-8 grid gap-4 lg:grid-cols-4">
          <label className="space-y-2 text-sm font-medium text-[var(--ink)] lg:col-span-2">
            Search
            <input name="q" defaultValue={filters.query} placeholder="Search titles or designers" className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3" />
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Category
            <select name="category" defaultValue={filters.category} className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3">
              <option value="">All categories</option>
              <option>Strategy</option>
              <option>Party</option>
              <option>Solo</option>
              <option>Family</option>
              <option>Educational</option>
              <option>Cooperative</option>
              <option>2-Player</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Players
            <select name="players" defaultValue={filters.players} className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3">
              <option value="">Any table size</option>
              <option value="1">Solo</option>
              <option value="2">2 players</option>
              <option value="4">4 players</option>
              <option value="5+">5+ players</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Complexity
            <select name="complexity" defaultValue={filters.complexity} className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3">
              <option value="">Any weight</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Crunchy</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Price
            <select name="price" defaultValue={filters.price} className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3">
              <option value="">Any price</option>
              <option value="free">Free</option>
              <option value="paid">Paid only</option>
              <option value="under5">$5 or less</option>
              <option value="under10">$10 or less</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Rating
            <select name="rating" defaultValue={filters.rating} className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3">
              <option value="">Any rating</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Access
            <select name="access" defaultValue={filters.access} className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3">
              <option value="">All access types</option>
              <option value="free">Free</option>
              <option value="included">Included</option>
              <option value="purchase">Purchase-only</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Sort by
            <select name="sort" defaultValue={filters.sort} className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3">
              <option value="newest">Newest</option>
              <option value="popular">Most popular</option>
              <option value="rated">Highest rated</option>
              <option value="price">Price</option>
            </select>
          </label>
          <div className="flex items-end gap-3">
            <button type="submit" className="focus-ring inline-flex h-[50px] items-center justify-center rounded-full bg-[var(--forest)] px-5 text-sm font-semibold text-white transition hover:opacity-90">
              Apply filters
            </button>
            <Link href="/marketplace" className="focus-ring inline-flex h-[50px] items-center justify-center rounded-full border border-[rgba(77,57,36,0.12)] px-5 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70">
              Reset
            </Link>
          </div>
        </form>
        {activeFilters.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {activeFilters.map(([key, value]) => (
              <span key={key} className="rounded-full bg-[rgba(216,165,65,0.12)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">
                {key}: {value}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-8">
        {games.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {games.map((game) => (
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
