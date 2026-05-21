import type { Metadata } from 'next';

import { OptimizerTool } from '@/app/components/optimizer-tool';
import { getOptimizerGames } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Print Optimizer',
  description: 'Optimize your print-and-play game layouts to save paper and ink.',
};

type OptimizerPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type OptimizerProfile = {
  paperSize: 'Letter' | 'A4';
  colorMode: 'Color' | 'B&W';
  duplex: 'Simplex' | 'Duplex';
};

function asString(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : '';
}

function parsePaperSize(value: string): OptimizerProfile['paperSize'] | undefined {
  const normalized = value.toLowerCase();
  if (normalized === 'letter') return 'Letter';
  if (normalized === 'a4') return 'A4';
  return undefined;
}

function parseColorMode(value: string): OptimizerProfile['colorMode'] | undefined {
  const normalized = value.toLowerCase();
  if (normalized === 'color') return 'Color';
  if (normalized === 'bw') return 'B&W';
  return undefined;
}

function parseDuplexMode(value: string): OptimizerProfile['duplex'] | undefined {
  const normalized = value.toLowerCase();
  if (normalized === 'simplex') return 'Simplex';
  if (normalized === 'duplex') return 'Duplex';
  return undefined;
}

export default async function OptimizerPage({ searchParams }: OptimizerPageProps) {
  const resolved = await searchParams;
  const initialSlug = asString(resolved.game) || undefined;
  const paperSize = parsePaperSize(asString(resolved.paper));
  const colorMode = parseColorMode(asString(resolved.color));
  const duplex = parseDuplexMode(asString(resolved.duplex));
  const initialProfile: Partial<OptimizerProfile> = {
    ...(paperSize ? { paperSize } : {}),
    ...(colorMode ? { colorMode } : {}),
    ...(duplex ? { duplex } : {}),
  };
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
      <OptimizerTool games={games} initialSlug={initialSlug} initialProfile={Object.keys(initialProfile).length ? initialProfile : undefined} />
    </div>
  );
}
