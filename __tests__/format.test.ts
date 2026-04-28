import { describe, expect, it } from 'vitest';
import {
  accessLabel,
  complexityLabel,
  displayPrice,
  formatCurrency,
  playerLabel,
  premiumBadge,
  primaryCta,
} from '@/lib/format';

describe('formatCurrency', () => {
  it('formats whole dollar amounts without cents', () => {
    expect(formatCurrency(500)).toBe('$5');
  });

  it('formats fractional dollar amounts with cents', () => {
    expect(formatCurrency(799)).toBe('$7.99');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });
});

describe('accessLabel', () => {
  it('returns "Free" for free access', () => {
    expect(accessLabel('free')).toBe('Free');
  });

  it('returns "Included" for included access', () => {
    expect(accessLabel('included')).toBe('Included');
  });

  it('returns "Purchase-only" for purchase access', () => {
    expect(accessLabel('purchase')).toBe('Purchase-only');
  });
});

describe('primaryCta', () => {
  it('returns "Download Free" for free games', () => {
    expect(primaryCta({ accessType: 'free', priceCents: 0 })).toBe('Download Free');
  });

  it('returns "Included with Maker" for included games', () => {
    expect(primaryCta({ accessType: 'included', priceCents: 0 })).toBe('Included with Maker');
  });

  it('returns formatted price for purchase games', () => {
    expect(primaryCta({ accessType: 'purchase', priceCents: 799 })).toBe('Buy for $7.99');
  });
});

describe('premiumBadge', () => {
  it('returns "Free" for free access', () => {
    expect(premiumBadge('free')).toBe('Free');
  });

  it('returns "Premium" for non-free access', () => {
    expect(premiumBadge('included')).toBe('Premium');
    expect(premiumBadge('purchase')).toBe('Premium');
  });
});

describe('displayPrice', () => {
  it('returns "Free" for free games', () => {
    expect(displayPrice({ accessType: 'free', priceCents: 0 })).toBe('Free');
  });

  it('returns "Included with Maker" for included games', () => {
    expect(displayPrice({ accessType: 'included', priceCents: 0 })).toBe('Included with Maker');
  });

  it('returns formatted price for purchase games', () => {
    expect(displayPrice({ accessType: 'purchase', priceCents: 1200 })).toBe('$12');
  });
});

describe('complexityLabel', () => {
  it('returns "Light" for low complexity', () => {
    expect(complexityLabel(1)).toBe('Light');
    expect(complexityLabel(2)).toBe('Light');
  });

  it('returns "Medium" for medium complexity', () => {
    expect(complexityLabel(3)).toBe('Medium');
  });

  it('returns "Crunchy" for high complexity', () => {
    expect(complexityLabel(4)).toBe('Crunchy');
    expect(complexityLabel(5)).toBe('Crunchy');
  });

  it('handles boundary and extreme values', () => {
    expect(complexityLabel(0)).toBe('Light');
    expect(complexityLabel(-1)).toBe('Light');
    expect(complexityLabel(10)).toBe('Crunchy');
  });
});

describe('playerLabel', () => {
  it('handles single player correctly (no plural)', () => {
    expect(playerLabel(1, 1)).toBe('1 player');
  });

  it('handles same min and max above 1', () => {
    expect(playerLabel(2, 2)).toBe('2 players');
  });

  it('handles range', () => {
    expect(playerLabel(2, 4)).toBe('2-4 players');
  });

  it('handles wide range', () => {
    expect(playerLabel(1, 6)).toBe('1-6 players');
  });

  it('handles large player counts', () => {
    expect(playerLabel(2, 12)).toBe('2-12 players');
  });
});

describe('formatCurrency edge cases', () => {
  it('handles large values', () => {
    expect(formatCurrency(100000)).toBe('$1,000');
  });

  it('handles single-digit cents', () => {
    expect(formatCurrency(101)).toBe('$1.01');
  });

  it('handles negative values', () => {
    // Intl.NumberFormat wraps negative values
    const result = formatCurrency(-500);
    expect(result).toContain('5');
  });
});
