/**
 * Component smoke-render tests.
 *
 * Validates that shared UI components mount without errors.
 * Uses React Testing Library with jsdom environment.
 */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const pushMock = vi.fn();
let mockPathname = '/';
let mockSearchParams = new URLSearchParams();

// --- Mock next/navigation ---
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

// --- Mock next/link ---
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// --- Mock seed data (needed by GameArt) ---
vi.mock('@/lib/seed', () => ({
  categoryColors: {
    Strategy: '#2d6a4f',
    Party: '#e07a5f',
    Family: '#6c63ff',
    Solo: '#457b9d',
  },
}));

vi.mock('recharts', () => {
  const MockContainer = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const MockSvgChart = ({ children }: { children?: React.ReactNode }) => <svg>{children}</svg>;
  const NullChartPrimitive = () => null;

  return {
    ResponsiveContainer: MockContainer,
    AreaChart: MockSvgChart,
    CartesianGrid: NullChartPrimitive,
    Tooltip: NullChartPrimitive,
    XAxis: NullChartPrimitive,
    YAxis: NullChartPrimitive,
    Area: NullChartPrimitive,
    BarChart: MockSvgChart,
    Bar: NullChartPrimitive,
  };
});

// --- Imports (after mocks) ---
import { DownloadButton } from '@/app/components/download-button';
import { MockActionButton } from '@/app/components/mock-action-button';
import { AnalyticsChart } from '@/app/components/analytics-chart';
import { GameCard } from '@/app/components/game-card';
import { MarketplaceFilterForm } from '@/app/components/marketplace-filter-form';
import { MobileNav } from '@/app/components/mobile-nav';
import type { GameCardView } from '@/lib/types';

beforeEach(() => {
  pushMock.mockReset();
  mockPathname = '/';
  mockSearchParams = new URLSearchParams();
});

afterEach(cleanup);

// --- Test data ---

const mockGame: GameCardView = {
  id: 1,
  slug: 'test-game',
  title: 'Test Game',
  tagline: 'A fun test game',
  description: 'Description for testing',
  category: 'Strategy',
  status: 'published',
  playerMin: 2,
  playerMax: 4,
  playTime: '30-45 min',
  complexity: 3,
  priceCents: 799,
  accessType: 'purchase',
  rating: 4.5,
  ratingCount: 42,
};

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/marketplace', label: 'Marketplace' },
];

// --- Tests ---

describe('DownloadButton', () => {
  it('renders with the provided label', () => {
    render(<DownloadButton label="Download PDF" />);
    expect(screen.getByRole('button', { name: 'Download PDF' })).toBeInTheDocument();
  });

  it('is not disabled in idle state', () => {
    render(<DownloadButton label="Get Files" />);
    expect(screen.getByRole('button', { name: 'Get Files' })).not.toBeDisabled();
  });

  it('announces progress through a live region after click', () => {
    render(<DownloadButton label="Download PDF" />);

    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }));

    expect(screen.getAllByText('Downloading PnP files…')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Downloading PnP files…' })).toHaveAttribute('aria-busy', 'true');
  });
});

describe('MockActionButton', () => {
  it('renders with the default label', () => {
    render(<MockActionButton defaultLabel="Add to cart" activeLabel="Adding…" />);
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
  });

  it('is not disabled initially', () => {
    render(<MockActionButton defaultLabel="Save" activeLabel="Saving…" />);
    expect(screen.getByRole('button', { name: 'Save' })).not.toBeDisabled();
  });

  it('marks the button busy while the preview action is active', () => {
    render(<MockActionButton defaultLabel="Save" activeLabel="Saving…" />);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('button', { name: 'Saving…' })).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByText('Saving…')).toHaveLength(2);
  });
});

describe('GameCard', () => {
  it('renders the game title', () => {
    render(<GameCard game={mockGame} />);
    const titles = screen.getAllByText('Test Game');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the tagline', () => {
    render(<GameCard game={mockGame} />);
    const taglines = screen.getAllByText('A fun test game');
    expect(taglines.length).toBeGreaterThanOrEqual(1);
  });

  it('renders category badge', () => {
    render(<GameCard game={mockGame} />);
    // Category appears in badge and in GameArt
    const badges = screen.getAllByText('Strategy');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('links to the game detail page', () => {
    render(<GameCard game={mockGame} />);
    const links = screen.getAllByRole('link');
    const gameLink = links.find((link) => link.getAttribute('href') === '/games/test-game');
    expect(gameLink).toBeDefined();
  });
});

describe('MarketplaceFilterForm', () => {
  it('preserves a typed search query when another filter changes', () => {
    render(<MarketplaceFilterForm />);

    fireEvent.change(screen.getByRole('textbox', { name: /search/i }), {
      target: { value: 'forest fox' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /category/i }), {
      target: { value: 'Solo' },
    });

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock.mock.calls[0][0]).toContain('/marketplace?');
    expect(pushMock.mock.calls[0][0]).toContain('q=forest+fox');
    expect(pushMock.mock.calls[0][0]).toContain('category=Solo');
  });
});

describe('AnalyticsChart', () => {
  it('renders accessible summaries and fallback tables for chart data', () => {
    render(
      <AnalyticsChart
        metrics={[
          { label: 'Day 1', downloads: 100, revenue: 12500 },
          { label: 'Day 2', downloads: 160, revenue: 18000 },
        ]}
        geography={[
          { region: 'North America', downloads: 140 },
          { region: 'Europe', downloads: 120 },
        ]}
      />
    );

    expect(screen.getByText(/260 downloads landed over the last 2 days/i)).toBeInTheDocument();
    expect(screen.getByText(/North America leads with 140 downloads/i)).toBeInTheDocument();
    expect(screen.getByText('Downloads over time data table')).toBeInTheDocument();
    expect(screen.getByText('Regional downloads data table')).toBeInTheDocument();
  });
});

describe('MobileNav', () => {
  it('renders the hamburger button', () => {
    render(<MobileNav items={navItems} />);
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
  });

  it('associates the trigger with the drawer dialog', () => {
    render(<MobileNav items={navItems} />);

    const trigger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    expect(trigger).toHaveAttribute('aria-controls', dialog.getAttribute('id'));
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('does not steal focus on initial render', () => {
    render(<MobileNav items={navItems} />);
    expect(screen.getByRole('button', { name: /open navigation menu/i })).not.toHaveFocus();
  });

  it('restores focus to the trigger after closing the drawer', () => {
    render(<MobileNav items={navItems} />);

    const trigger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(trigger);

    const closeButton = screen.getByRole('button', { name: /close mobile navigation drawer/i });
    expect(closeButton).toHaveFocus();

    fireEvent.click(closeButton);
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toHaveFocus();
  });

  it('does not show nav links when closed', () => {
    render(<MobileNav items={navItems} />);
    expect(screen.queryByText('Marketplace')).not.toBeInTheDocument();
  });
});
