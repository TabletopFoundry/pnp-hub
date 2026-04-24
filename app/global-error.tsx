'use client';

import './globals.css';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div className="section-shell py-16">
          <div className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Something went wrong</p>
            <h1 className="mt-4 text-3xl font-semibold text-[var(--ink)]">The PnP Hub demo hit an unexpected snag.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--text-body)]">{error.message || 'Please retry the last action or refresh the page.'}</p>
            {error.digest ? (
              <p className="mx-auto mt-2 text-xs text-[var(--text-muted)]">Error reference: <code className="rounded bg-white/70 px-1.5 py-0.5">{error.digest}</code></p>
            ) : null}
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={reset} className="focus-ring rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Try again
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error renders outside the router context; <Link> may not function */}
              <a href="/" className="focus-ring rounded-full border border-[var(--border-medium)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70">
                Back home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
