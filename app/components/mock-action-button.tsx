'use client';

import { useEffect, useRef, useState } from 'react';

type MockActionButtonProps = {
  defaultLabel: string;
  activeLabel: string;
  className?: string;
};

export function MockActionButton({ defaultLabel, activeLabel, className }: MockActionButtonProps) {
  const [active, setActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setActive(true);
    timerRef.current = window.setTimeout(() => setActive(false), 1600) as unknown as number;
  };

  return (
    <button
      type="button"
      disabled={active}
      onClick={handleClick}
      aria-live="polite"
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {active ? activeLabel : defaultLabel}
    </button>
  );
}
