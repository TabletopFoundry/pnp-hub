import { OptimizerTool } from '@/app/components/optimizer-tool';
import { getOptimizerGames } from '@/lib/data';

export const dynamic = 'force-dynamic';

type OptimizerPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OptimizerPage({ searchParams }: OptimizerPageProps) {
  const resolved = await searchParams;
  const initialSlug = typeof resolved.game === 'string' ? resolved.game : undefined;
  const games = getOptimizerGames();

  return (
    <div className="section-shell py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Print optimizer tool</p>
        <h1 className="section-title mt-3 font-semibold text-[var(--ink)]">Preview optimized layouts before paper and ink hit the tray</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--text-body)]">
          Switch between Letter and A4, compare color and grayscale runs, review paper stock recommendations, and see estimated print costs for any seeded title.
        </p>
      </div>
      <OptimizerTool games={games} initialSlug={initialSlug} />
    </div>
  );
}
