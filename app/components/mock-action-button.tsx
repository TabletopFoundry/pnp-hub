'use client';

import { useState } from 'react';

type MockActionButtonProps = {
  defaultLabel: string;
  activeLabel: string;
  className?: string;
};

export function MockActionButton({ defaultLabel, activeLabel, className }: MockActionButtonProps) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      disabled={active}
      onClick={() => {
        setActive(true);
        window.setTimeout(() => setActive(false), 1600);
      }}
      aria-live="polite"
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {active ? activeLabel : defaultLabel}
    </button>
  );
}
