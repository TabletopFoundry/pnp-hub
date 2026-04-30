/**
 * Component smoke-render tests.
 *
 * Validates that shared UI components mount without errors.
 * Uses React Testing Library with jsdom environment.
 */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// --- Mock next/navigation ---
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
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

// --- Imports (after mocks) ---
import { DownloadButton } from '@/app/components/download-button';
import { MockActionButton } from '@/app/components/mock-action-button';
import { GameCard } from '@/app/components/game-card';
import { MobileNav } from '@/app/components/mobile-nav';
import type { GameCardView } from '@/lib/types';

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

describe('MobileNav', () => {
  it('renders the hamburger button', () => {
    render(<MobileNav items={navItems} />);
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
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
