export default function Loading() {
  return (
    <div className="section-shell py-12">
      <div className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-8">
        <div className="h-4 w-40 animate-pulse rounded-full bg-[var(--bg-terracotta-strong)]" />
        <div className="mt-4 h-12 w-2/3 animate-pulse rounded-2xl bg-[var(--bg-forest-tint)]" />
        <div className="mt-4 h-5 w-full animate-pulse rounded-full bg-[var(--border-light)]" />
        <div className="mt-3 h-5 w-4/5 animate-pulse rounded-full bg-[var(--border-light)]" />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="paper-panel rounded-[1.8rem] border border-[var(--border-light)] p-4">
            <div className="h-56 animate-pulse rounded-[1.5rem] bg-[var(--bg-gold-tint)]" />
            <div className="mt-4 h-5 animate-pulse rounded-full bg-[var(--border-light)]" />
            <div className="mt-3 h-4 animate-pulse rounded-full bg-[var(--border-light)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
