'use client';

import { useState } from 'react';

type DownloadButtonProps = {
  label: string;
};

export function DownloadButton({ label }: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'done'>('idle');

  return (
    <button
      type="button"
      onClick={() => {
        setStatus('pending');
        window.setTimeout(() => setStatus('done'), 1400);
        window.setTimeout(() => setStatus('idle'), 2800);
      }}
      className="focus-ring inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
    >
      {status === 'idle' ? label : status === 'pending' ? 'Downloading PnP files…' : 'Download ready'}
    </button>
  );
}
