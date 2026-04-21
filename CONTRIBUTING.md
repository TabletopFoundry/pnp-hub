# Contributing to PnP Hub

Thank you for your interest in contributing to PnP Hub! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js** ≥ 22 (see `.nvmrc`)
- **npm** ≥ 10

### Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/pnp-hub.git
cd pnp-hub

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`. The SQLite database auto-seeds on first run.

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feat/add-wishlist-feature`
- `fix/marketplace-filter-reset`
- `docs/update-readme`

### Making Changes

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and tests before committing:

```bash
npm run lint
npm test
```

4. Write clear, descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add wishlist button to game cards
fix: correct currency formatting for zero-cent prices
docs: add architecture overview to README
```

5. Open a pull request against `main`

### Code Style

- **TypeScript** with strict mode enabled
- **Tailwind CSS** for styling (no raw CSS unless extending the theme)
- **ESLint** with Next.js and TypeScript configs
- Use `@/` path aliases for imports (e.g., `@/lib/data`)

### Testing

```bash
npm test            # Run all tests once
npm run test:watch  # Run tests in watch mode
```

Tests live in the `__tests__/` directory. We use Vitest with React Testing Library.

## Project Structure

```
app/                  # Next.js App Router pages and components
  components/         # Shared React components
  community/          # Community hub page
  designer/           # Designer dashboard page
  games/[slug]/       # Game detail pages
  marketplace/        # Marketplace browse page
  optimizer/          # Print optimizer page
lib/                  # Core business logic
  data.ts             # Database query helpers
  db.ts               # SQLite connection and schema
  format.ts           # Display formatting utilities
  seed.ts             # Seed data for the demo catalog
  types.ts            # TypeScript type definitions
docs/                 # Project documentation
__tests__/            # Test files
```

## Reporting Issues

When reporting bugs, please include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Node.js version and OS

## Questions?

Open a [GitHub Discussion](https://github.com/your-username/pnp-hub/discussions) or file an issue.
