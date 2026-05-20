'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavigationItem = {
  href: string;
  label: string;
  matchPaths?: string[];
};

type SiteNavLinksProps = {
  items: NavigationItem[];
  variant?: 'header' | 'footer';
};

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

export function isNavigationItemActive(pathname: string, item: NavigationItem) {
  const normalizedPathname = normalizePath(pathname);
  const matchPaths = item.matchPaths?.length ? item.matchPaths : [item.href];

  return matchPaths.some((matchPath) => {
    const normalizedMatchPath = normalizePath(matchPath);
    return normalizedMatchPath === '/'
      ? normalizedPathname === '/'
      : normalizedPathname === normalizedMatchPath || normalizedPathname.startsWith(`${normalizedMatchPath}/`);
  });
}

export function SiteNavLinks({ items, variant = 'header' }: SiteNavLinksProps) {
  const pathname = usePathname();
  const baseClassName =
    variant === 'header'
      ? 'focus-ring rounded-full px-4 py-2 transition'
      : 'focus-ring rounded-2xl px-4 py-3 transition';

  return items.map((item) => {
    const active = isNavigationItemActive(pathname, item);
    const stateClassName = active
      ? 'bg-[var(--bg-forest-tint)] text-[var(--forest)]'
      : 'text-[var(--text-body)] hover:bg-white/70';

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? 'page' : undefined}
        className={`${baseClassName} ${stateClassName}`}
      >
        {item.label}
      </Link>
    );
  });
}
