'use client';

import { useEffect, useId, useRef, useState } from 'react';

type DownloadButtonProps = {
  label: string;
};

export function DownloadButton({ label }: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'done'>('idle');
  const liveRegionId = useId();
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handleClick = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    setStatus('pending');
    timersRef.current.push(window.setTimeout(() => setStatus('done'), 1400) as unknown as number);
    timersRef.current.push(window.setTimeout(() => setStatus('idle'), 2800) as unknown as number);
  };

  const buttonLabel = status === 'idle' ? label : status === 'pending' ? 'Downloading PnP files…' : 'Download ready';
  const liveMessage = status === 'idle' ? '' : buttonLabel;

  return (
    <>
      <button
        type="button"
        disabled={status !== 'idle'}
        onClick={handleClick}
        aria-busy={status === 'pending'}
        aria-describedby={liveMessage ? liveRegionId : undefined}
        className="focus-ring inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {buttonLabel}
      </button>
      <span id={liveRegionId} className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </span>
    </>
  );
}
