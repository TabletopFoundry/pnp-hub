'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createDraftGame } from '@/lib/db';

export async function createDesignerSubmission(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const category = String(formData.get('category') ?? 'Strategy');
  const accessType = String(formData.get('accessType') ?? 'purchase');
  const priceDollars = Number(formData.get('price') ?? '0');
  const files = formData
    .getAll('files')
    .filter((value): value is File => value instanceof File && value.size >= 0 && value.name.length > 0)
    .map((file) => file.name);

  if (!title || !description) {
    redirect('/designer?error=Please+complete+the+name+and+description+fields');
  }

  createDraftGame({
    title,
    description,
    category,
    accessType,
    priceCents: Math.round(priceDollars * 100),
    uploadedFiles: files.length ? files : ['mock-rules.pdf', 'print-sheets.zip'],
  });

  revalidatePath('/designer');
  redirect('/designer?submitted=1');
}
