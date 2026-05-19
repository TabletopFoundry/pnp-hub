---
title: Testing
description: Run, write, and debug PnP Hub tests.
---

# Testing

PnP Hub uses [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and `jsdom`. Tests live in `__tests__/` and mirror the structure of `lib/` and `app/`.

## Run the suite

```bash
npm test                  # single-run mode (CI)
npm run test:watch        # interactive watch mode
npm run test:coverage     # generate V8 coverage in coverage/
```

The full suite runs in under 10 seconds on a modern laptop.

## Test layout

```
__tests__/
├── lib/
│   ├── data.test.ts         # SQL query helpers
│   ├── db.test.ts           # schema + seed lifecycle
│   └── format.test.ts       # currency, percentage, date formatters
└── app/
    └── components/
        └── optimizer-tool.test.tsx
```

## In-memory database pattern

Every test that touches the database creates its own in-memory SQLite instance:

```ts
import { createDatabase } from '@/lib/db';
import { describe, expect, it } from 'vitest';

describe('catalog queries', () => {
  it('returns only published games', () => {
    const db = createDatabase(':memory:');
    // seed runs automatically inside createDatabase
    const rows = db
      .prepare("SELECT slug FROM games WHERE status = 'published'")
      .all();
    expect(rows.length).toBeGreaterThan(0);
  });
});
```

This is the canonical pattern — never test against the dev database file directly.

## Testing components

Client components are tested with React Testing Library:

```ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptimizerTool } from '@/app/components/optimizer-tool';

it('switches paper size when the user selects A4', async () => {
  const user = userEvent.setup();
  render(<OptimizerTool games={[/* fixtures */]} />);
  await user.click(screen.getByRole('radio', { name: /a4/i }));
  expect(screen.getByText(/A4/)).toBeInTheDocument();
});
```

## What to test (and what not to)

| ✅ Test | ❌ Don't bother |
|---|---|
| Pure helpers in `lib/format.ts` | Trivial getters |
| Query helpers in `lib/data.ts` with edge cases (empty results, malformed JSON, filter combinations) | Re-testing Next.js routing |
| Seed idempotency and version bumping | CSS or visual styling |
| Optimizer math at the boundaries (duplex, A4 multiplier, free games) | Implementation details of Next.js components |
| Filter composition (category × sort × search) | Mocking SQLite — use the real in-memory DB |

## Coverage targets

There's no enforced threshold, but the bias is:

- `lib/` modules: aim for **>90%** branch coverage. They're pure and easy to test.
- `app/components/` interactive components: cover the happy path + one error case.
- `app/<route>/page.tsx` server components: usually skipped — they're thin compositions over `lib/data.ts`, which has its own tests.

Run coverage and open `coverage/index.html`:

```bash
npm run test:coverage
open coverage/index.html
```

## Debugging a failing test

```bash
# Run a single file
npx vitest run __tests__/lib/data.test.ts

# Run with the debugger (Node Inspector)
node --inspect-brk node_modules/.bin/vitest run __tests__/lib/data.test.ts
```

VS Code users: install the **Vitest** extension for inline test runners.
