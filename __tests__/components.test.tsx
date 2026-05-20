/**
 * Component smoke-render tests.
 *
 * Validates that shared UI components mount without errors.
 * Uses React Testing Library with jsdom environment.
 */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const pushMock = vi.fn();
const replaceMock = vi.fn();
let mockPathname = '/';
let mockSearchParams = new URLSearchParams();

// --- Mock next/navigation ---
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock, prefetch: vi.fn() }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

// --- Mock next/link ---
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
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
import MarketplacePage from '@/app/marketplace/page';
import { AnalyticsChart } from '@/app/components/analytics-chart';
import { CraftAlongCalendar } from '@/app/components/craft-along-calendar';
import { DesignerFlash } from '@/app/components/designer-flash';
import { DesignerGamesTable } from '@/app/components/designer-games-table';
import { DesignerSpotlights } from '@/app/components/designer-spotlights';
import { DownloadButton } from '@/app/components/download-button';
import { GameCard } from '@/app/components/game-card';
import { MarketplaceFilterForm } from '@/app/components/marketplace-filter-form';
import { MobileNav } from '@/app/components/mobile-nav';
import { MockActionButton } from '@/app/components/mock-action-button';
import { PageBreadcrumbs } from '@/app/components/page-breadcrumbs';
import { SiteNavLinks } from '@/app/components/site-nav-links';
import { SubscriptionGrid } from '@/app/components/subscription-grid';
import { TutorialLibrary } from '@/app/components/tutorial-library';
import type { CraftAlongFeature, DesignerProfile, GameCardView, GameListingView, Tutorial } from '@/lib/types';

beforeEach(() => {
  pushMock.mockReset();
  replaceMock.mockReset();
  mockPathname = '/';
  mockSearchParams = new URLSearchParams();
  window.location.hash = '';
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

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
  { href: '/', label: 'Home', matchPaths: ['/'] },
  { href: '/marketplace', label: 'Marketplace', matchPaths: ['/marketplace', '/games'] },
];

const mockSchedule: CraftAlongFeature[] = [
  {
    id: 1,
    monthLabel: 'May',
    gameSlug: 'festival-of-kites',
    gameTitle: 'Festival of Kites',
    theme: 'Bright builds',
    summary: 'A breezy family build with layered cards and paper banners.',
    materialFocus: 'Heavy cardstock',
    isCurrent: true,
  },
];

const mockDesigners: DesignerProfile[] = [
  {
    slug: 'paper-sparrow-studio',
    name: 'Paper Sparrow Studio',
    headline: 'Cozy strategy and family builds',
    bio: 'Designs approachable print-and-play games with tactile assembly guides.',
    location: 'Barcelona, ES',
    specialties: ['Card crafting', 'Solo modes'],
    joinedAt: '2024-02-11',
    featuredGameSlug: 'festival-of-kites',
    gameCount: 4,
    totalRevenueCents: 54200,
    totalDownloads: 1820,
  },
];

const mockTutorials: Tutorial[] = [
  {
    id: 1,
    title: 'Card Sleeves on a Budget',
    difficulty: 'Beginner',
    estimatedTime: '12 min',
    thumbnailLabel: 'Sleeves',
    accessType: 'free',
    technique: 'Card Craft',
    linkedGameSlug: 'tea-leaves-thunder',
    summary: 'Turn plain paper decks into sturdy table-ready cards with cheap sleeves and scrap backing.',
  },
  {
    id: 2,
    title: 'Ink-Saving Home Printer Settings',
    difficulty: 'Beginner',
    estimatedTime: '10 min',
    thumbnailLabel: 'Printer',
    accessType: 'subscriber',
    technique: 'Printer Setup',
    linkedGameSlug: null,
    summary: 'Balance saturation, readability, and speed when switching between draft and final runs.',
  },
];

const mockListingGames: GameListingView[] = [
  {
    ...mockGame,
    ageRange: '10+',
    assemblyEffort: 'Low',
    paperRequirements: '6 sheets',
    estimatedInk: 'Medium',
    sheetCount: 6,
    cutDifficulty: 'Easy',
    paperStockRecommendation: '200gsm cardstock',
    cutGuide: 'Straight cuts',
    previewLayout: '2 cards per row',
    componentSummary: 'Cards and rules',
    designerName: 'Paper Sparrow Studio',
    designerSlug: 'paper-sparrow-studio',
    revenueCents: 15200,
    downloadCount: 220,
    publishedAt: '2024-03-01T00:00:00.000Z',
    popularity: 98,
    isFeatured: true,
    isMonthlyCraft: false,
    uploadedFiles: ['rules.pdf', 'print-sheets.zip'],
  },
  {
    ...mockGame,
    id: 2,
    slug: 'draft-game',
    title: 'Draft Game',
    status: 'draft',
    rating: 0,
    ratingCount: 0,
    revenueCents: 0,
    downloadCount: 0,
    publishedAt: '2024-04-01T00:00:00.000Z',
    popularity: 0,
    isFeatured: false,
    isMonthlyCraft: false,
    ageRange: '10+',
    assemblyEffort: 'Pending',
    paperRequirements: 'Pending review',
    estimatedInk: 'Pending analysis',
    sheetCount: 0,
    cutDifficulty: 'Pending',
    paperStockRecommendation: 'Pending review',
    cutGuide: 'Pending review',
    previewLayout: 'Pending review',
    componentSummary: 'Pending review',
    designerName: 'Paper Sparrow Studio',
    designerSlug: 'paper-sparrow-studio',
    uploadedFiles: ['draft-rules.pdf'],
  },
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

describe('SiteNavLinks', () => {
  it('marks the current section with aria-current, including game detail routes mapped to marketplace', () => {
    mockPathname = '/games/test-game';

    render(<SiteNavLinks items={navItems} variant="header" />);

    expect(screen.getByRole('link', { name: 'Marketplace' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});

describe('PageBreadcrumbs', () => {
  it('renders breadcrumb links and announces the current page', () => {
    render(
      <PageBreadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'Test Game' },
        ]}
      />
    );

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Marketplace' })).toHaveAttribute('href', '/marketplace');
    expect(screen.getByText('Test Game')).toHaveAttribute('aria-current', 'page');
  });
});

describe('MarketplaceFilterForm', () => {
  it('preserves a typed search query when another filter changes', () => {
    render(<MarketplaceFilterForm />);

    fireEvent.change(screen.getByRole('searchbox', { name: /search/i }), {
      target: { value: 'forest fox' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /category/i }), {
      target: { value: 'Solo' },
    });

    expect(pushMock).toHaveBeenCalledTimes(1);
    const firstPush = pushMock.mock.calls[0]?.[0];
    expect(firstPush).toBeDefined();
    expect(firstPush).toContain('/marketplace?');
    expect(firstPush).toContain('q=forest+fox');
    expect(firstPush).toContain('category=Solo');
  });

  it('debounces text search updates', () => {
    vi.useFakeTimers();
    render(<MarketplaceFilterForm />);

    fireEvent.change(screen.getByRole('searchbox', { name: /search/i }), {
      target: { value: 'ink saver' },
    });

    expect(pushMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(350);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock.mock.calls[0]?.[0]).toContain('q=ink+saver');
  });

  it('keeps focus and value after a debounced search updates the URL state', () => {
    vi.useFakeTimers();
    const { rerender } = render(<MarketplaceFilterForm />);

    const input = screen.getByRole('searchbox', { name: /search/i });
    input.focus();

    fireEvent.change(input, {
      target: { value: 'hello' },
    });

    vi.advanceTimersByTime(350);

    expect(pushMock).toHaveBeenCalledTimes(1);

    mockSearchParams = new URLSearchParams('q=hello');
    rerender(<MarketplaceFilterForm />);

    const updatedInput = screen.getByRole('searchbox', { name: /search/i });
    expect(updatedInput).toHaveValue('hello');
    expect(updatedInput).toHaveFocus();
  });

  it('renders active filter chips with user-facing labels', () => {
    mockSearchParams = new URLSearchParams('complexity=heavy&price=under5&sort=popular&rating=4.5&access=purchase');
    render(<MarketplaceFilterForm />);

    expect(screen.getByRole('button', { name: /remove complexity filter: crunchy/i })).toHaveTextContent('Complexity: Crunchy ×');
    expect(screen.getByRole('button', { name: /remove price filter: \$5 or less/i })).toHaveTextContent('Price: $5 or less ×');
    expect(screen.getByRole('button', { name: /remove sort filter: most popular/i })).toHaveTextContent('Sort: Most popular ×');
    expect(screen.getByRole('button', { name: /remove rating filter: 4.5\+/i })).toHaveTextContent('Rating: 4.5+ ×');
    expect(screen.getByRole('button', { name: /remove access filter: purchase-only/i })).toHaveTextContent('Access: Purchase-only ×');
  });

  it('lets users remove a single active filter chip', () => {
    mockSearchParams = new URLSearchParams('category=Solo&price=free');
    render(<MarketplaceFilterForm />);

    fireEvent.click(screen.getByRole('button', { name: /remove category filter: solo/i }));

    expect(pushMock).toHaveBeenCalledTimes(1);
    const nextHref = pushMock.mock.calls[0]?.[0] as string;
    expect(nextHref).toContain('price=free');
    expect(nextHref).not.toContain('category=Solo');
  });
});

describe('MarketplacePage', () => {
  it('uses a single polite live region for marketplace result updates', async () => {
    const page = await MarketplacePage({ searchParams: Promise.resolve({}) });
    const { container } = render(page);

    expect(container.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);
    expect(container.querySelector('#marketplace-results-summary')).toHaveAttribute('aria-live', 'polite');
    expect(container.querySelector('section[aria-describedby="marketplace-results-summary"]')).not.toHaveAttribute('aria-live');
  });
});

describe('CraftAlongCalendar', () => {
  it('surfaces the seeded craft-along schedule with game links', () => {
    render(<CraftAlongCalendar schedule={mockSchedule} />);

    expect(screen.getByText(/full year of planned builds/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open festival of kites/i })).toHaveAttribute('href', '/games/festival-of-kites');
  });
});

describe('TutorialLibrary', () => {
  it('surfaces related game and subscription handoff links from tutorial metadata', () => {
    render(<TutorialLibrary tutorials={mockTutorials} />);

    expect(screen.getByRole('link', { name: /open related game/i })).toHaveAttribute('href', '/games/tea-leaves-thunder');
    expect(screen.getByRole('link', { name: /browse marketplace/i })).toHaveAttribute('href', '/marketplace');
    expect(screen.getByRole('link', { name: /compare support tiers/i })).toHaveAttribute('href', '/community#subscription-comparison');
  });
});

describe('DesignerSpotlights', () => {
  it('renders creator spotlights with featured-game and catalog links', () => {
    render(<DesignerSpotlights designers={mockDesigners} />);

    expect(screen.getByText(/paper sparrow studio/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view featured game/i })).toHaveAttribute('href', '/games/festival-of-kites');
    expect(screen.getByRole('link', { name: /browse designer catalog/i })).toHaveAttribute('href', '/marketplace?q=Paper%20Sparrow%20Studio');
  });
});

describe('DesignerGamesTable', () => {
  it('adds context and next-step links for published and draft games', () => {
    render(<DesignerGamesTable games={mockListingGames} sectionId="my-games" />);

    expect(screen.getByText(/titles managed by paper sparrow studio/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /open live listing/i })).toHaveLength(1);
    expect(screen.getByRole('link', { name: /open live listing/i })).toHaveAttribute('href', '/games/test-game');
    expect(screen.getByText(/awaiting editorial review/i)).toBeInTheDocument();
  });
});

describe('DesignerFlash', () => {
  it('announces success, preserves the hash, and exposes a jump link', () => {
    mockPathname = '/designer';
    mockSearchParams = new URLSearchParams('submitted=1&tab=recent');
    window.location.hash = '#my-games';

    render(<DesignerFlash submitted />);

    expect(screen.getByRole('status')).toHaveTextContent(/draft saved to sqlite/i);
    expect(replaceMock).toHaveBeenCalledWith('/designer?tab=recent#my-games', { scroll: false });
    expect(screen.getByRole('link', { name: /jump to my games/i })).toHaveAttribute('href', '#my-games');
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
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

  it('announces the active destination when the drawer is open', () => {
    mockPathname = '/games/test-game';
    render(<MobileNav items={navItems} />);

    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));

    expect(screen.getByRole('link', { name: 'Marketplace' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('SubscriptionGrid', () => {
  it('uses route-based CTAs for each tier instead of mock buttons', () => {
    render(<SubscriptionGrid />);

    expect(screen.getByRole('link', { name: /browse free titles/i })).toHaveAttribute('href', '/marketplace?access=free');
    expect(screen.getByRole('link', { name: /see included catalog/i })).toHaveAttribute('href', '/marketplace?access=included');
    expect(screen.getByRole('link', { name: /open premium print workflow/i })).toHaveAttribute('href', '/optimizer');
  });
});
