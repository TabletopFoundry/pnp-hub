export default function OptimizerLoading() {
  return (
    <div className="section-shell py-12">
      <div className="mb-8 max-w-3xl">
        <div className="h-4 w-40 animate-pulse rounded-full bg-[var(--bg-terracotta-tint)]" />
        <div className="mt-4 h-12 w-2/3 animate-pulse rounded-2xl bg-[var(--bg-forest-tint)]" />
        <div className="mt-4 h-5 w-full animate-pulse rounded-full bg-[var(--border-light)]" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="paper-panel rounded-[1.9rem] border border-[var(--border-light)] p-5">
          <div className="h-4 w-28 animate-pulse rounded-full bg-[var(--bg-terracotta-tint)]" />
          <div className="mt-4 h-8 w-3/4 animate-pulse rounded-xl bg-[var(--border-light)]" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-[var(--border-light)]" />
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="h-24 animate-pulse rounded-[1.4rem] bg-[var(--bg-gold-tint)]" />
            <div className="h-24 animate-pulse rounded-[1.4rem] bg-[var(--bg-forest-subtle)]" />
            <div className="h-24 animate-pulse rounded-[1.4rem] bg-[var(--bg-terracotta-tint)]" />
          </div>
        </div>
        <div className="paper-panel rounded-[1.9rem] border border-[var(--border-light)] p-5">
          <div className="h-4 w-40 animate-pulse rounded-full bg-[var(--bg-terracotta-tint)]" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="rounded-[1.4rem] border border-[var(--border-light)] bg-white/80 p-4">
                <div className="aspect-[3/4] animate-pulse rounded-[1rem] bg-[var(--border-light)]" />
                <div className="mt-3 h-4 w-16 animate-pulse rounded-full bg-[var(--border-light)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
