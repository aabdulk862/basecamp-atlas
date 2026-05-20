# Charlotte Apartment Finder — Project Steering

## Overview

This is a React + TypeScript single-page application that displays Charlotte, NC apartments on an interactive Leaflet map with a filter sidebar. All data is static (no backend).

## Architecture

- Single-page app with Wouter routing (only `/` and a 404 fallback)
- All apartment data is hardcoded in `src/data/apartments.ts`
- The main (and only real) page is `src/pages/Map.tsx`
- UI components follow the shadcn/ui pattern: Radix primitives wrapped with CVA + tailwind-merge in `src/components/ui/`

## Conventions

### Code Style
- Use TypeScript strict mode
- Functional components with hooks only (no class components)
- Use the `cn()` utility from `@/lib/utils` for conditional class merging
- Import UI components from `@/components/ui/<component>`
- Use the `@/` path alias for all src-relative imports

### Styling
- Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, no `tailwind.config.js`)
- Theme tokens defined as CSS custom properties in `src/index.css`
- Use semantic color tokens (`bg-background`, `text-foreground`, `bg-primary`, etc.) — never raw color values
- The app uses a permanent dark theme (deep blue slate palette)
- Font: Inter via Google Fonts

### Components
- All reusable UI primitives live in `src/components/ui/`
- These are shadcn/ui components — do not modify them unless fixing a bug
- Page-level components go in `src/pages/`
- Shared hooks go in `src/hooks/`

### Data
- Apartment data is a typed array in `src/data/apartments.ts`
- The `Apartment` interface defines the shape — always keep it in sync when adding fields
- Derived exports (`neighborhoods`, `washerDryerOptions`) are computed from the data array

## Build & Dev

```bash
# Dev server (requires PORT and BASE_PATH env vars)
PORT=5173 BASE_PATH="/" npm run dev

# Production build
PORT=5173 BASE_PATH="/" npm run build

# Type checking
npm run typecheck
```

## Key Dependencies

- `react-leaflet` / `leaflet` — map rendering
- `wouter` — lightweight client-side routing
- `@tanstack/react-query` — available but currently unused (no API calls)
- `lucide-react` — icon library
- `framer-motion` — available for animations
- `zod` / `react-hook-form` — available for form validation if needed

## When Adding Features

1. If adding a new page, register it in `src/App.tsx` inside the `<Switch>` block
2. If adding new apartment fields, update the `Apartment` interface in `src/data/apartments.ts` and populate the field for all 37 entries
3. If adding new filter controls, add state in `Map.tsx`, add the filter logic to the `filteredApartments` useMemo, and increment `activeFilterCount` accordingly
4. Prefer existing UI components from `src/components/ui/` before installing new libraries
5. Keep the app fully client-side — no API calls or server dependencies
