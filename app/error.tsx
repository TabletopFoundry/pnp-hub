'use client';

import './globals.css';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div className="section-shell py-16">
          <div className="paper-panel rounded-[2rem] border border-[rgba(181,110,79,0.16)] p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Something went wrong</p>
            <h1 className="mt-4 text-3xl font-semibold text-[var(--ink)]">The PnP Hub demo hit an unexpected snag.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--text-body)]">{error.message || 'Please retry the last action or refresh the page.'}</p>
            <button onClick={reset} className="focus-ring mt-6 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
