'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type MarketplacePaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function MarketplacePagination({ currentPage, totalPages }: MarketplacePaginationProps) {
  const searchParams = useSearchParams();

  function buildPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    return `/marketplace${qs ? `?${qs}` : ''}`;
  }

  // Build a compact page number list: 1 ... (current-1) current (current+1) ... totalPages
  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (i === 2 && currentPage > 3) {
      pages.push('ellipsis-start');
    } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
      pages.push('ellipsis-end');
    }
  }

  return (
    <nav aria-label="Marketplace pagination" className="mt-8 flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="focus-ring rounded-full border border-[var(--border-medium)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70"
        >
          ← Previous
        </Link>
      ) : (
        <span className="rounded-full border border-[var(--border-light)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] opacity-50">
          ← Previous
        </span>
      )}

      {pages.map((item) => {
        if (typeof item === 'string') {
          return (
            <span key={item} className="px-2 text-sm text-[var(--text-secondary)]">
              …
            </span>
          );
        }
        return item === currentPage ? (
          <span
            key={item}
            aria-current="page"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--forest)] text-sm font-semibold text-white"
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={buildPageUrl(item)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-medium)] text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70"
          >
            {item}
          </Link>
        );
      })}

      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="focus-ring rounded-full border border-[var(--border-medium)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70"
        >
          Next →
        </Link>
      ) : (
        <span className="rounded-full border border-[var(--border-light)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] opacity-50">
          Next →
        </span>
      )}
    </nav>
  );
}
