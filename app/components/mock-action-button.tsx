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
      onClick={() => {
        setActive(true);
        window.setTimeout(() => setActive(false), 1600);
      }}
      className={className}
    >
      {active ? activeLabel : defaultLabel}
    </button>
  );
}
