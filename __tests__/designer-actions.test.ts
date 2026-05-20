import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { createDesignerSubmission } from '@/app/designer/actions';
import { createSeededDatabase, resetDatabase } from '@/lib/db';

beforeEach(() => {
  const testDb = createSeededDatabase(':memory:');
  resetDatabase(testDb);
});

afterEach(() => {
  resetDatabase();
});

describe('createDesignerSubmission', () => {
  it('rejects submissions that do not choose a category', async () => {
    const formData = new FormData();
    formData.set('title', 'Unsorted Draft');
    formData.set('description', 'A tidy draft that still needs a category.');
    formData.set('category', '');
    formData.set('accessType', 'free');
    formData.set('price', '0');

    await expect(createDesignerSubmission(formData)).resolves.toEqual({
      error: 'Please choose a category before saving your draft.',
    });
  });

  it('rejects tampered categories that are not in the supported list', async () => {
    const formData = new FormData();
    formData.set('title', 'Tampered Draft');
    formData.set('description', 'A draft with an unsupported category.');
    formData.set('category', 'Unknown');
    formData.set('accessType', 'free');
    formData.set('price', '0');

    await expect(createDesignerSubmission(formData)).resolves.toEqual({
      error: 'Invalid category. Must be one of: Strategy, Party, Family, Solo, Cooperative, Card, Educational, 2-Player.',
    });
  });
});
