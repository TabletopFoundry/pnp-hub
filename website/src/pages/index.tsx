import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Feature = {
  icon: string;
  title: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    icon: '🛒',
    title: 'Curated marketplace',
    body: 'Browse 56+ seeded games with search, category filters, sorting, badges, and responsive cards built for any device.',
  },
  {
    icon: '🖨️',
    title: 'Print optimizer',
    body: 'Switch between Letter and A4, compare color vs grayscale, preview layouts, and estimate sheet and ink costs before printing.',
  },
  {
    icon: '📊',
    title: 'Designer dashboard',
    body: 'Track downloads, revenue, and geography with a transparent 75/25 split. Draft uploads persist across reloads.',
  },
  {
    icon: '🎨',
    title: 'Community gallery',
    body: 'Showcase craft photos, share assembly tutorials, and spotlight a monthly craft-along — all seeded with realistic data.',
  },
  {
    icon: '⚡',
    title: 'Next.js 16 + SQLite',
    body: 'App Router, React 19, server actions, and a zero-config SQLite database that auto-seeds on first run. No external services.',
  },
];

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} — Print-and-play marketplace`}
      description="A craft-inspired print-and-play board game marketplace built with Next.js, TypeScript, and SQLite."
    >
      <header className="hero-pnp">
        <div className="container text--center">
          <span className="hero-pnp__eyebrow">Print · Play · Share</span>
          <h1 className="hero-pnp__title">A craft-inspired marketplace for print-and-play board games.</h1>
          <p className="hero-pnp__subtitle">
            PnP Hub helps designers publish games and helps players discover, optimize, and print
            them with confidence. Open source, self-contained, and ready to fork.
          </p>

          <div className="hero-pnp__ctas">
            <Link className="button button--primary button--lg" to="/getting-started/quickstart">
              Get started in 2 minutes
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="https://github.com/TabletopFoundry/pnp-hub"
            >
              View on GitHub
            </Link>
          </div>

          <div className="hero-pnp__install">
            <span className="hero-pnp__install-prompt">$</span>
            <code>git clone https://github.com/TabletopFoundry/pnp-hub &amp;&amp; cd pnp-hub &amp;&amp; npm install &amp;&amp; npm run dev</code>
          </div>
        </div>
      </header>

      <section className="trust-strip">
        <div className="trust-strip__heading">What you get out of the box</div>
        <div className="trust-strip__stats">
          <div>
            <div className="trust-stat__value">56</div>
            <div className="trust-stat__label">Seeded games</div>
          </div>
          <div>
            <div className="trust-stat__value">12</div>
            <div className="trust-stat__label">Designer profiles</div>
          </div>
          <div>
            <div className="trust-stat__value">100+</div>
            <div className="trust-stat__label">Realistic reviews</div>
          </div>
          <div>
            <div className="trust-stat__value">75/25</div>
            <div className="trust-stat__label">Designer revenue split</div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="text--center" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Built for the people who print at the kitchen table</h2>
            <p style={{ maxWidth: '60ch', margin: '0 auto', opacity: 0.75 }}>
              Five tightly integrated surfaces — marketplace, game detail, optimizer, designer dashboard, and community —
              all powered by a single SQLite database.
            </p>
          </div>
          <div className="features__grid">
            {FEATURES.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <span className="feature-card__icon" aria-hidden>{feature.icon}</span>
                <div className="feature-card__title">{feature.title}</div>
                <p className="feature-card__body">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
