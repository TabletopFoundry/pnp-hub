import { categoryColors } from '@/lib/seed';

type GameArtProps = {
  title: string;
  subtitle: string;
  category: string;
  heightClassName?: string;
};

export function GameArt({ title, subtitle, category, heightClassName = 'h-64' }: GameArtProps) {
  const accent = categoryColors[category] ?? '#7e6c5c';

  return (
    <div
      role="img"
      aria-label={`Cover art for ${title}: ${subtitle}`}
      className={`paper-texture ${heightClassName} relative overflow-hidden rounded-[1.75rem] border border-white/60 p-5 text-white`}
      style={{
        background: `linear-gradient(140deg, ${accent}, color-mix(in srgb, ${accent} 45%, #f7ecdd))`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),_transparent_26%)]" />
      <div className="absolute inset-0 bg-black/20 rounded-[1.75rem]" />
      <div className="relative flex h-full flex-col justify-between">
        <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em]">{category}</span>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white">PnP cover preview</p>
          <h3 className="mt-2 max-w-[18rem] text-2xl font-semibold leading-tight">{title}</h3>
          <p className="mt-3 max-w-[20rem] text-sm leading-6 text-white/95">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
