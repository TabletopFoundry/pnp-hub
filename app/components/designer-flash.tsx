'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type DesignerFlashProps = {
  submitted?: boolean;
};

export function DesignerFlash({ submitted = false }: DesignerFlashProps) {
  const [visible, setVisible] = useState(submitted);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const headingId = useId();
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submitted) return;

    flashRef.current?.focus();

    const params = new URLSearchParams(searchParams.toString());
    params.delete('submitted');
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [pathname, router, searchParams, submitted]);

  if (!visible) return null;

  return (
    <div
      ref={flashRef}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby={headingId}
      className="mt-6 rounded-[1.6rem] border border-[var(--bg-forest-strong)] bg-[var(--bg-forest-subtle)] px-5 py-4 text-sm text-[var(--ink)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p id={headingId} className="font-semibold text-[var(--ink)]">Draft saved to SQLite</p>
          <p className="mt-1 leading-6 text-[var(--text-body)]">Your new submission is ready in the local catalog. Scroll to “My games” to review the draft without keeping a stale query parameter in the URL.</p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="focus-ring rounded-full border border-[var(--border-medium)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)] transition hover:bg-white/70"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
