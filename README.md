# Wird

Public-facing pages and admin dashboard for the Wird app — a platform for managing Quran reading contests, groups, leaderboards, and participants.

## Tech Stack

- **Runtime:** [Bun](https://bun.sh)
- **Build:** [Vite](https://vitejs.dev) + TypeScript
- **Framework:** React 19, React Router v7
- **Data Fetching:** TanStack Query v5
- **UI:** Tailwind CSS v4, shadcn/ui, Radix UI, Base UI
- **Forms:** React Hook Form + Zod
- **Animations:** Motion (Framer Motion)
- **i18n:** i18next (Arabic default, English supported, RTL)
- **HTTP:** Axios with token refresh interceptors
- **Linting/Formatting:** Biome
- **Testing:** Vitest

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3+

### Install & Run

```bash
bun install       # Install dependencies
bun dev           # Start dev server at http://localhost:3000
```

### Scripts

```bash
bun dev            # Start dev server
bun run build      # Production build (output: build/)
bun run build:dev  # Development build
bun run preview    # Preview production build
bun test           # Run tests (Vitest)
bun run lint       # Lint with Biome
bun run lint:fix   # Lint and auto-fix
bun run format     # Format with Biome
bun run check      # Run all Biome checks
bun run check:fix  # Run all Biome checks and auto-fix
bun run typecheck  # TypeScript type checking
```

## Project Structure

```
src/
├── pages/               # Route-level page components
│   └── public/          # Public pages (landing, help, policy, password reset)
├── components/
│   ├── public/          # Public-facing components (header, footer, landing, SEO)
│   ├── Competition/     # Contest management
│   ├── contest-results/ # Contest results display
│   ├── ContestCriteria/ # Contest criteria configuration
│   ├── Groups/          # Group management
│   ├── leaderboard/     # Leaderboard views
│   ├── users/           # User management
│   ├── Home/            # Dashboard home
│   ├── layout/          # Dashboard layout (sidebar, navbar)
│   ├── shared/          # Shared components (modals, etc.)
│   ├── providers/       # App-wide context providers
│   └── ui/              # shadcn/ui components
├── services/            # API layer (one folder per domain: service + queries)
├── ui/                  # Reusable UI utilities (animated-page, error-boundary)
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── util/                # Utilities (axios config, roles, helpers)
├── lib/                 # Shared library utilities
├── styles/              # Global styles and theme
├── data/                # Static data and i18n translations
├── assets/              # Images and static assets
└── router.tsx           # Route definitions
```

## Architecture

### API Layer

Services are organized by domain under `src/services/`. Each domain has:
- `*.service.ts` — Axios API calls
- `queries.ts` — TanStack Query hooks (queries & mutations)

Centralized Axios instance with auth interceptors and automatic token refresh in `src/util/axios.ts`.

### Path Aliases

Configured in both `vite.config.ts` and `tsconfig.json`:

```
@/*  →  src/*
components/*  →  src/components/*
services/*    →  src/services/*
ui/*          →  src/ui/*
hooks/*       →  src/hooks/*
util/*        →  src/util/*
types/*       →  src/types/*
lib/*         →  src/lib/*
styles/*      →  src/styles/*
data/*        →  src/data/*
assets/*      →  src/assets/*
```

### Authentication

Session management in `src/services/auth/session.ts` with role-based access control via `src/util/roles.ts`.

### Internationalization

- Default language: Arabic (`ar`)
- Supported: `["ar", "en"]`
- Language persisted in `localStorage` (`lang` key)
- Full RTL support for Arabic
