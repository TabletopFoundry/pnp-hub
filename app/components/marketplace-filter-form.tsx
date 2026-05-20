'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { GAME_CATEGORIES } from '@/lib/constants';

function buildMarketplaceHref(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/marketplace?${query}` : '/marketplace';
}

type FilterKey = 'q' | 'category' | 'players' | 'complexity' | 'price' | 'rating' | 'access' | 'sort' | 'page';

type CurrentFilters = {
  q: string;
  category: string;
  players: string;
  complexity: string;
  price: string;
  rating: string;
  access: string;
  sort: string;
};

export function MarketplaceFilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchParamsKey = searchParams.toString();
  const queryDebounceRef = useRef<number | null>(null);

  const currentFilters = useMemo<CurrentFilters>(() => {
    const params = new URLSearchParams(searchParamsKey);
    return {
      q: params.get('q') ?? '',
      category: params.get('category') ?? '',
      players: params.get('players') ?? '',
      complexity: params.get('complexity') ?? '',
      price: params.get('price') ?? '',
      rating: params.get('rating') ?? '',
      access: params.get('access') ?? '',
      sort: params.get('sort') ?? 'newest',
    };
  }, [searchParamsKey]);

  const [query, setQuery] = useState(currentFilters.q);

  const clearPendingQuery = useCallback(() => {
    if (queryDebounceRef.current !== null) {
      window.clearTimeout(queryDebounceRef.current);
      queryDebounceRef.current = null;
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL params are the source of truth after navigation events.
    setQuery(currentFilters.q);
  }, [currentFilters.q]);

  useEffect(() => () => clearPendingQuery(), [clearPendingQuery]);

  const pushParams = useCallback((params: URLSearchParams) => {
    startTransition(() => {
      router.push(buildMarketplaceHref(params));
    });
  }, [router, startTransition]);

  const updateFilter = useCallback(
    (key: FilterKey, value: string, options?: { preserveDraftQuery?: boolean }) => {
      if (key !== 'q') {
        clearPendingQuery();
      }

      const params = new URLSearchParams(searchParamsKey);
      const nextQuery = options?.preserveDraftQuery ? query.trim() : undefined;

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

      if (key !== 'page') {
        params.delete('page');
      }

      pushParams(params);
    },
    [clearPendingQuery, pushParams, query, searchParamsKey]
  );

  const scheduleQueryUpdate = useCallback((value: string) => {
    clearPendingQuery();
    queryDebounceRef.current = window.setTimeout(() => {
      updateFilter('q', value.trim());
    }, 350) as unknown as number;
  }, [clearPendingQuery, updateFilter]);

  const activeFilters = Object.entries(currentFilters).filter(
    ([key, value]) => value && !(key === 'sort' && value === 'newest')
  ) as Array<[keyof CurrentFilters, string]>;

  const filterLabels: Record<keyof CurrentFilters, string> = {
    q: 'Search',
    category: 'Category',
    players: 'Players',
    complexity: 'Complexity',
    price: 'Price',
    rating: 'Rating',
    access: 'Access',
    sort: 'Sort',
  };

  const filterValueLabels: Partial<Record<keyof CurrentFilters, Record<string, string>>> = {
    players: {
      '1': 'Solo',
      '2': '2 players',
      '4': '4 players',
      '5+': '5+ players',
    },
    complexity: {
      light: 'Light',
      medium: 'Medium',
      heavy: 'Crunchy',
    },
    price: {
      free: 'Free',
      paid: 'Paid only',
      under5: '$5 or less',
      under10: '$10 or less',
    },
    rating: {
      '4': '4.0+',
      '4.5': '4.5+',
    },
    access: {
      free: 'Free',
      included: 'Included',
      purchase: 'Purchase-only',
    },
    sort: {
      newest: 'Newest',
      popular: 'Most popular',
      rated: 'Highest rated',
      price: 'Price',
    },
  };

  const statusMessage = isPending
    ? 'Updating marketplace results…'
    : activeFilters.length
      ? `${activeFilters.length} filter${activeFilters.length === 1 ? '' : 's'} applied.`
      : 'Showing all marketplace titles.';

  return (
    <form
      aria-busy={isPending}
      className={isPending ? 'opacity-70 transition-opacity' : ''}
      onSubmit={(event) => {
        event.preventDefault();
        clearPendingQuery();
        updateFilter('q', query.trim());
      }}
    >
      <p className="mt-6 text-sm leading-6 text-[var(--text-secondary)]">
        {statusMessage}
      </p>
      <fieldset className="mt-4 grid gap-4 lg:grid-cols-4">
        <legend className="sr-only">Marketplace filters</legend>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)] lg:col-span-2">
          Search
          <div className="flex gap-3">
            <input
              name="q"
              type="search"
              value={query}
              placeholder="Search titles or designers"
              autoComplete="off"
              onChange={(event) => {
                setQuery(event.target.value);
                scheduleQueryUpdate(event.target.value);
              }}
              className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
            />
            <button
              type="submit"
              className="focus-ring inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--border-medium)] px-5 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70"
            >
              Search
            </button>
          </div>
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Category
          <select
            value={currentFilters.category}
            onChange={(event) => updateFilter('category', event.target.value, { preserveDraftQuery: true })}
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
            onChange={(event) => updateFilter('players', event.target.value, { preserveDraftQuery: true })}
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
            onChange={(event) => updateFilter('complexity', event.target.value, { preserveDraftQuery: true })}
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
            onChange={(event) => updateFilter('price', event.target.value, { preserveDraftQuery: true })}
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
            onChange={(event) => updateFilter('rating', event.target.value, { preserveDraftQuery: true })}
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
            onChange={(event) => updateFilter('access', event.target.value, { preserveDraftQuery: true })}
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
            onChange={(event) => updateFilter('sort', event.target.value, { preserveDraftQuery: true })}
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
            Clear all filters
          </Link>
        </div>
      </fieldset>
      {activeFilters.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {activeFilters.map(([key, value]) => {
            const displayValue = filterValueLabels[key]?.[value] ?? value;

            return (
              <button
                key={key}
                type="button"
                onClick={() => updateFilter(key, '', { preserveDraftQuery: key !== 'q' })}
                className="focus-ring rounded-full bg-[var(--bg-gold-tint)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)] transition hover:bg-[var(--bg-gold-medium)]"
                aria-label={`Remove ${filterLabels[key]} filter: ${displayValue}`}
              >
                {filterLabels[key]}: {displayValue} ×
              </button>
            );
          })}
        </div>
      ) : null}
    </form>
  );
}
