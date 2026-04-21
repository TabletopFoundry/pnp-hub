'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MobileNavProps = {
  items: Array<{ href: string; label: string }>;
};

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  // Close drawer on route change
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus first focusable element when drawer opens; restore focus on close
  useEffect(() => {
    if (open) {
      const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Focus trap
  const handleFocusTrap = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !drawerRef.current) return;
    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [open, handleFocusTrap]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="focus-ring flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/70"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-30 bg-black/30" onClick={() => setOpen(false)} aria-hidden="true" />
          <nav
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            className="fixed right-0 top-0 z-40 flex h-full w-72 flex-col gap-2 border-l border-[var(--border-light)] bg-[var(--paper)] p-6 shadow-xl"
            aria-label="Mobile navigation"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-[var(--ink)]">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/70"
                aria-label="Close navigation menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-white/70 ${pathname === item.href ? 'bg-[var(--bg-forest-tint)] text-[var(--forest)]' : 'text-[var(--text-body)]'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </>
      ) : null}
    </div>
  );
}
