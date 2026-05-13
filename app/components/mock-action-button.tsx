'use client';

import { useEffect, useId, useRef, useState } from 'react';

type MockActionButtonProps = {
  defaultLabel: string;
  activeLabel: string;
  className?: string;
};

export function MockActionButton({ defaultLabel, activeLabel, className }: MockActionButtonProps) {
  const [active, setActive] = useState(false);
  const liveRegionId = useId();
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

  const visibleLabel = active ? activeLabel : defaultLabel;

  return (
    <>
      <button
        type="button"
        disabled={active}
        onClick={handleClick}
        aria-busy={active}
        aria-describedby={active ? liveRegionId : undefined}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {visibleLabel}
      </button>
      <span id={liveRegionId} className="sr-only" aria-live="polite" aria-atomic="true">
        {active ? activeLabel : ''}
      </span>
    </>
  );
}
