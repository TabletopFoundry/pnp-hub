'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import Link from 'next/link';

export function MarketplaceFilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`/marketplace?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  const currentFilters = {
    q: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? '',
    players: searchParams.get('players') ?? '',
    complexity: searchParams.get('complexity') ?? '',
    price: searchParams.get('price') ?? '',
    rating: searchParams.get('rating') ?? '',
    access: searchParams.get('access') ?? '',
    sort: searchParams.get('sort') ?? 'newest',
  };

  const activeFilters = Object.entries(currentFilters).filter(
    ([, value]) => value && value !== 'newest' && value !== ''
  );

  return (
    <div className={isPending ? 'opacity-70 transition-opacity' : ''}>
      <fieldset className="mt-8 grid gap-4 lg:grid-cols-4">
        <legend className="sr-only">Marketplace filters</legend>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)] lg:col-span-2">
          Search
          <input
            name="q"
            defaultValue={currentFilters.q}
            placeholder="Search titles or designers"
            onBlur={(e) => updateFilter('q', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateFilter('q', e.currentTarget.value);
            }}
            className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Category
          <select
            value={currentFilters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
          >
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
          <select
            value={currentFilters.players}
            onChange={(e) => updateFilter('players', e.target.value)}
            className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
          >
            <option value="">Any table size</option>
            <option value="1">Solo</option>
            <option value="2">2 players</option>
            <option value="4">4 players</option>
            <option value="5+">5+ players</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Complexity
          <select
            value={currentFilters.complexity}
            onChange={(e) => updateFilter('complexity', e.target.value)}
            className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
          >
            <option value="">Any weight</option>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Crunchy</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Price
          <select
            value={currentFilters.price}
            onChange={(e) => updateFilter('price', e.target.value)}
            className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
          >
            <option value="">Any price</option>
            <option value="free">Free</option>
            <option value="paid">Paid only</option>
            <option value="under5">$5 or less</option>
            <option value="under10">$10 or less</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Rating
          <select
            value={currentFilters.rating}
            onChange={(e) => updateFilter('rating', e.target.value)}
            className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
          >
            <option value="">Any rating</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Access
          <select
            value={currentFilters.access}
            onChange={(e) => updateFilter('access', e.target.value)}
            className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
          >
            <option value="">All access types</option>
            <option value="free">Free</option>
            <option value="included">Included</option>
            <option value="purchase">Purchase-only</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Sort by
          <select
            value={currentFilters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most popular</option>
            <option value="rated">Highest rated</option>
            <option value="price">Price</option>
          </select>
        </label>
        <div className="flex items-end gap-3">
          <Link
            href="/marketplace"
            className="focus-ring inline-flex h-[50px] items-center justify-center rounded-full border border-[var(--border-medium)] px-5 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70"
          >
            Reset
          </Link>
        </div>
      </fieldset>
      {activeFilters.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {activeFilters.map(([key, value]) => (
            <span key={key} className="rounded-full bg-[var(--bg-gold-tint)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">
              {key}: {value}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
