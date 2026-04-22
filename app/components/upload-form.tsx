'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';

import { createDesignerSubmission, type SubmissionResult } from '@/app/designer/actions';
import { UploadSubmitButton } from '@/app/components/upload-submit-button';

export function UploadForm() {
  const router = useRouter();
  const [accessType, setAccessType] = useState('purchase');
  const isPurchase = accessType === 'purchase';

  const [state, formAction] = useActionState<SubmissionResult, FormData>(
    async (_prev: SubmissionResult, formData: FormData) => {
      return createDesignerSubmission(formData);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      router.push('/designer?submitted=1');
    }
  }, [state, router]);

  return (
    <form action={formAction} className="paper-panel rounded-[1.9rem] border border-[var(--border-light)] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Upload wizard</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Create a new draft submission</h3>
        </div>
        <span className="rounded-full bg-[var(--bg-gold-tint)] px-3 py-1 text-xs font-semibold text-[var(--ink)]">Mock file upload</span>
      </div>
      {state?.error ? (
        <div className="mt-4 rounded-[1.4rem] border border-[var(--bg-terracotta-strong)] bg-[var(--bg-terracotta-subtle)] px-5 py-4 text-sm text-[var(--ink)]" role="alert">
          {state.error}
        </div>
      ) : null}
      <fieldset className="mt-6 grid gap-4 md:grid-cols-2">
        <legend className="sr-only">Game submission details</legend>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Game name
          <input name="title" required placeholder="Murmurs of the Mill" className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3" />
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Category
          <select name="category" className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3">
            <option>Strategy</option>
            <option>Party</option>
            <option>Solo</option>
            <option>Family</option>
            <option>Educational</option>
            <option>Cooperative</option>
            <option>2-Player</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)] md:col-span-2">
          Description
          <textarea
            name="description"
            required
            rows={5}
            placeholder="Describe the hook, player experience, and what makes the print package sing."
            className="focus-ring w-full rounded-[1.4rem] border border-[var(--border-medium)] bg-white/80 px-4 py-3"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Access model
          <select name="accessType" value={accessType} onChange={(e) => setAccessType(e.target.value)} className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3">
            <option value="purchase">Purchase-only</option>
            <option value="included">Included</option>
            <option value="free">Free</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
          Price (USD)
          <input name="price" type="number" min="0" defaultValue="7" step="0.5" disabled={!isPurchase} className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50" />
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--ink)] md:col-span-2">
          Files
          <input name="files" type="file" multiple className="focus-ring w-full rounded-2xl border border-dashed border-[var(--border-dashed-strong)] bg-white/80 px-4 py-3" />
          <span className="block text-xs leading-5 text-[var(--text-secondary)]">Attach rules PDFs, print sheets, or preview assets. The MVP stores file names and creates a draft record in SQLite.</span>
        </label>
      </fieldset>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-light)] pt-5">
        <p className="text-sm leading-6 text-[var(--text-secondary)]">Submissions start as drafts so editorial review can validate print readiness before publishing.</p>
        <UploadSubmitButton />
      </div>
    </form>
  );
}
