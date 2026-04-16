import { MockActionButton } from '@/app/components/mock-action-button';

const tiers = [
  {
    name: 'Free Explorer',
    price: '$0',
    badge: 'Start here',
    description: 'Browse the marketplace, claim up to two free titles monthly, and access beginner tutorials.',
    features: ['2 free title claims / month', 'Community craft gallery', 'Basic print notes'],
  },
  {
    name: 'Maker',
    price: '$8/mo',
    badge: 'Most popular',
    description: 'Unlock included titles, subscriber tutorials, and fast optimizer presets for weeknight crafting.',
    features: ['Included catalog access', 'Subscriber tutorials', 'Saved printer profiles'],
  },
  {
    name: 'Maker+',
    price: '$14/mo',
    badge: 'Studio tier',
    description: 'For power users who print often and want premium optimizer guidance and release alerts.',
    features: ['Everything in Maker', 'Priority optimizer queue', 'Version update notices'],
  },
];

export function SubscriptionGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {tiers.map((tier) => (
        <article key={tier.name} className="paper-panel rounded-[1.8rem] border border-[var(--border-light)] p-6" aria-label={`${tier.name} subscription tier at ${tier.price}`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold text-[var(--ink)]">{tier.name}</h3>
            <span className="rounded-full bg-[var(--bg-gold-medium)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">
              {tier.badge}
            </span>
          </div>
          <p className="mt-4 text-4xl font-semibold text-[var(--terracotta)]">{tier.price}</p>
          <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">{tier.description}</p>
          <ul className="mt-5 space-y-3 text-sm text-[var(--text-strong)]">
            {tier.features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <span className="mt-1 text-[var(--forest)]">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <MockActionButton
            defaultLabel={`Choose ${tier.name}`}
            activeLabel={`${tier.name} preview started`}
            className="focus-ring mt-6 inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          />
        </article>
      ))}
    </div>
  );
}
