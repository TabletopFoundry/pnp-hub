export default function DesignerLoading() {
  return (
    <div className="section-shell py-12">
      <div className="paper-panel rounded-[2.2rem] border border-[var(--border-light)] p-7 sm:p-8">
        <div className="h-4 w-44 animate-pulse rounded-full bg-[var(--bg-terracotta-tint)]" />
        <div className="mt-4 h-12 w-2/3 animate-pulse rounded-2xl bg-[var(--bg-forest-tint)]" />
        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-[1.5rem] bg-white/75 p-4">
              <div className="h-3 w-20 animate-pulse rounded-full bg-[var(--bg-terracotta-tint)]" />
              <div className="mt-4 h-8 w-24 animate-pulse rounded-xl bg-[var(--border-light)]" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="paper-panel rounded-[1.9rem] border border-[var(--border-light)] p-6">
          <div className="h-4 w-32 animate-pulse rounded-full bg-[var(--bg-terracotta-tint)]" />
          <div className="mt-4 h-8 w-3/4 animate-pulse rounded-xl bg-[var(--border-light)]" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-[var(--border-light)]" />
            ))}
          </div>
        </div>
        <div className="paper-panel rounded-[1.9rem] border border-[var(--border-light)] p-6">
          <div className="h-4 w-36 animate-pulse rounded-full bg-[var(--bg-terracotta-tint)]" />
          <div className="mt-4 h-8 w-2/3 animate-pulse rounded-xl bg-[var(--border-light)]" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="h-32 animate-pulse rounded-[1.5rem] bg-[var(--bg-forest-subtle)]" />
            <div className="h-32 animate-pulse rounded-[1.5rem] bg-[var(--bg-gold-tint)]" />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="paper-panel rounded-[1.8rem] border border-[var(--border-light)] p-5">
          <div className="h-4 w-40 animate-pulse rounded-full bg-[var(--bg-terracotta-tint)]" />
          <div className="mt-4 h-72 animate-pulse rounded-2xl bg-[var(--border-light)]" />
        </div>
        <div className="paper-panel rounded-[1.8rem] border border-[var(--border-light)] p-5">
          <div className="h-4 w-32 animate-pulse rounded-full bg-[var(--bg-terracotta-tint)]" />
          <div className="mt-4 h-72 animate-pulse rounded-2xl bg-[var(--border-light)]" />
        </div>
      </div>
      <div className="mt-8 paper-panel rounded-[2rem] border border-[var(--border-light)] p-6">
        <div className="h-4 w-24 animate-pulse rounded-full bg-[var(--bg-terracotta-tint)]" />
        <div className="mt-4 h-8 w-1/2 animate-pulse rounded-xl bg-[var(--border-light)]" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-[1.4rem] bg-white/80" />
          ))}
        </div>
      </div>
    </div>
  );
}
