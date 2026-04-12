'use client';

import { useFormStatus } from 'react-dom';

export function UploadSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="focus-ring inline-flex items-center justify-center rounded-full bg-[var(--terracotta)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving draft…' : 'Submit mock upload'}
    </button>
  );
}
