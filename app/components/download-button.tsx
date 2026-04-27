'use client';

import { useEffect, useRef, useState } from 'react';

type DownloadButtonProps = {
  label: string;
};

export function DownloadButton({ label }: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'done'>('idle');
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

  return (
    <button
      type="button"
      disabled={status !== 'idle'}
      onClick={handleClick}
      aria-live="polite"
      className="focus-ring inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {status === 'idle' ? label : status === 'pending' ? 'Downloading PnP files…' : 'Download ready'}
    </button>
  );
}
