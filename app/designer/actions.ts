'use server';

import { revalidatePath } from 'next/cache';

import { createDraftGame } from '@/lib/db';
import { ACCESS_TYPES, GAME_CATEGORIES, MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from '@/lib/constants';
import type { AccessType, GameCategory } from '@/lib/types';

export type SubmissionResult = { error?: string; success?: boolean } | null;

const VALID_CATEGORIES = GAME_CATEGORIES satisfies readonly GameCategory[];
const VALID_ACCESS_TYPES: readonly AccessType[] = ACCESS_TYPES;

export async function createDesignerSubmission(formData: FormData): Promise<SubmissionResult> {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const category = String(formData.get('category') ?? 'Strategy');
  const accessType = String(formData.get('accessType') ?? 'purchase');
  const priceDollars = Number(formData.get('price') ?? '0');
  const files = formData
    .getAll('files')
    .filter((value): value is File => value instanceof File && value.size > 0 && value.name.length > 0)
    .map((file) => file.name);

  // Required fields
  if (!title || !description) {
    return { error: 'Please complete the name and description fields.' };
  }

  // Length limits
  if (title.length > MAX_TITLE_LENGTH) {
    return { error: `Title must be under ${MAX_TITLE_LENGTH} characters.` };
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return { error: `Description must be under ${MAX_DESCRIPTION_LENGTH} characters.` };
  }

  // Validate category against known values
  if (!(VALID_CATEGORIES as readonly string[]).includes(category)) {
    return { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}.` };
  }

  // Validate access type against known values
  if (!VALID_ACCESS_TYPES.includes(accessType as AccessType)) {
    return { error: `Invalid access type. Must be one of: ${VALID_ACCESS_TYPES.join(', ')}.` };
  }

  // Validate price for purchase type
  if (accessType === 'purchase' && (isNaN(priceDollars) || priceDollars <= 0)) {
    return { error: 'Purchase games must have a price greater than $0.' };
  }

  try {
    createDraftGame({
      title,
      description,
      category,
      accessType,
      priceCents: Math.round(priceDollars * 100),
      uploadedFiles: files.length ? files : ['mock-rules.pdf', 'print-sheets.zip'],
    });
  } catch {
    return { error: 'Failed to save your submission. Please try again.' };
  }

  revalidatePath('/designer');
  return { success: true };
}
