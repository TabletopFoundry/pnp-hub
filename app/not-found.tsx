import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="section-shell py-16">
      <div className="paper-panel rounded-[2rem] border border-[rgba(77,57,36,0.08)] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Not found</p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--ink)]">That print-and-play page isn’t in the binder.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[rgba(58,43,31,0.76)]">Try browsing the marketplace again or jump back to the homepage.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/marketplace" className="focus-ring rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            Browse marketplace
          </Link>
          <Link href="/" className="focus-ring rounded-full border border-[rgba(77,57,36,0.12)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
