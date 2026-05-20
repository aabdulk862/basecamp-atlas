# Charlotte Apartment Finder — Project Steering

## Overview

This is a React + TypeScript single-page application that displays Charlotte, NC apartments on an interactive Leaflet map with a filter sidebar, list view, and favorites system. All data is static (no backend).

## Architecture

- Single-page app with Wouter routing (only `/` and a 404 fallback)
- All apartment data is hardcoded in `src/data/apartments.ts`
- The main page is `src/pages/Map.tsx` — a thin layout shell that composes feature components
- Feature components: `FilterSidebar`, `MapView`, `ApartmentListView`, `ApartmentDetailCard`
- Custom hooks: `useApartmentFilters` (filter state + URL sync), `useFavorites` (localStorage persistence)
- UI components follow the shadcn/ui pattern: Radix primitives wrapped with CVA + tailwind-merge in `src/components/ui/`

## Conventions

### Code Style
- Use TypeScript strict mode
- Functional components with hooks only (no class components)
- Use the `cn()` utility from `@/lib/utils` for conditional class merging
- Import UI components from `@/components/ui/<component>`
- Import feature components from `@/components/<Component>`
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
- Feature components (FilterSidebar, MapView, etc.) live in `src/components/`
- Page-level components go in `src/pages/`
- Shared hooks go in `src/hooks/`

### Data
- Apartment data is a typed array in `src/data/apartments.ts`
- The `Apartment` interface defines the shape — always keep it in sync when adding fields
- Derived exports (`neighborhoods`, `washerDryerOptions`) are computed from the data array
- Score weighting constants (`SCORE_WEIGHTS`, `SCORE_WEIGHT_LABELS`) are exported for UI display

### State Management
- Filter state lives in `src/hooks/use-apartment-filters.ts` and syncs to URL query params
- Favorites state lives in `src/hooks/use-favorites.ts` and persists to localStorage
- Selected apartment and view mode are local state in the page component

## Build & Dev

```bash
# Dev server (no env vars required, defaults to port 5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck
```

## Key Dependencies

- `react-leaflet` / `leaflet` — map rendering (lazy-loaded)
- `wouter` — lightweight client-side routing
- `@tanstack/react-query` — available but currently unused (no API calls)
- `lucide-react` — icon library
- `framer-motion` — available for animations
- `zod` / `react-hook-form` — available for form validation if needed

## When Adding Features

1. If adding a new page, register it in `src/App.tsx` inside the `<Switch>` block
2. If adding new apartment fields, update the `Apartment` interface in `src/data/apartments.ts` and populate the field for all 37 entries
3. If adding new filter controls, add state in `use-apartment-filters.ts`, add the filter logic to the `filteredApartments` useMemo, update URL serialization, and increment `activeFilterCount`
4. If adding new feature components, put them in `src/components/` (not in `ui/`)
5. Prefer existing UI components from `src/components/ui/` before installing new libraries
6. Keep the app fully client-side — no API calls or server dependencies
7. Heavy libraries should be lazy-loaded with `React.lazy()` + `Suspense`
