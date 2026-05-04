'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';

import { GAME_CATEGORIES } from '@/lib/constants';

function buildMarketplaceHref(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/marketplace?${query}` : '/marketplace';
}

export function MarketplaceFilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchParamsKey = searchParams.toString();

  const currentFilters = useMemo(() => ({
    q: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? '',
    players: searchParams.get('players') ?? '',
    complexity: searchParams.get('complexity') ?? '',
    price: searchParams.get('price') ?? '',
    rating: searchParams.get('rating') ?? '',
    access: searchParams.get('access') ?? '',
    sort: searchParams.get('sort') ?? 'newest',
  }), [searchParams]);

  const [draftQuery, setDraftQuery] = useState(currentFilters.q);

  useEffect(() => {
    setDraftQuery(currentFilters.q);
  }, [currentFilters.q, searchParamsKey]);

  const updateFilter = useCallback(
    (key: string, value: string, options?: { preserveDraftQuery?: boolean }) => {
      const params = new URLSearchParams(searchParamsKey);
      const nextQuery = options?.preserveDraftQuery ? draftQuery.trim() : undefined;

      if (nextQuery !== undefined && key !== 'q') {
        if (nextQuery) {
          params.set('q', nextQuery);
        } else {
          params.delete('q');
        }
      }

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== 'page') params.delete('page');
      startTransition(() => {
        router.push(buildMarketplaceHref(params));
      });
    },
    [draftQuery, router, searchParamsKey, startTransition]
  );

  const activeFilters = Object.entries(currentFilters).filter(
    ([, value]) => value && value !== 'newest' && value !== ''
  );

  const filterLabels: Record<string, string> = {
    q: 'Search',
    category: 'Category',
    players: 'Players',
    complexity: 'Complexity',
    price: 'Price',
    rating: 'Rating',
    access: 'Access',
    sort: 'Sort',
  };

  return (
    <form
      className={isPending ? 'opacity-70 transition-opacity' : ''}
      onSubmit={(event) => {
        event.preventDefault();
        updateFilter('q', draftQuery.trim());
      }}
    >
      <fieldset className="mt-8 grid gap-4 lg:grid-cols-4">
        <legend className="sr-only">Marketplace filters</legend>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)] lg:col-span-2">
          Search
          <div className="flex gap-3">
            <input
              name="q"
              value={draftQuery}
              placeholder="Search titles or designers"
              onChange={(event) => setDraftQuery(event.target.value)}
              onBlur={() => updateFilter('q', draftQuery.trim())}
              className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
            />
            <button
              type="submit"
              className="focus-ring inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--border-medium)] px-5 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70"
            >
              Apply
            </button>
          </div>
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Category
          <select
            value={currentFilters.category}
            onChange={(e) => updateFilter('category', e.target.value, { preserveDraftQuery: true })}
            className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
          >
            <option value="">All categories</option>
            {GAME_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Players
          <select
            value={currentFilters.players}
            onChange={(e) => updateFilter('players', e.target.value, { preserveDraftQuery: true })}
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
            onChange={(e) => updateFilter('complexity', e.target.value, { preserveDraftQuery: true })}
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
            onChange={(e) => updateFilter('price', e.target.value, { preserveDraftQuery: true })}
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
            onChange={(e) => updateFilter('rating', e.target.value, { preserveDraftQuery: true })}
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
            onChange={(e) => updateFilter('access', e.target.value, { preserveDraftQuery: true })}
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
            onChange={(e) => updateFilter('sort', e.target.value, { preserveDraftQuery: true })}
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
              {filterLabels[key] ?? key}: {value}
            </span>
          ))}
        </div>
      ) : null}
    </form>
  );
}
