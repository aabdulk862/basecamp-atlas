# Basecamp Atlas — Project Steering

## Overview

This project is migrating from a React + Vite SPA (Charlotte Apartment Finder) to **Basecamp Atlas** — an Astro 5 static site with two discovery verticals:

- `/live` — Charlotte apartment finder (React island, existing functionality preserved)
- `/escape` — Curated vacation retreat guide (content collections, multi-region, editorial)

Both verticals share a dark cinematic design system, navigation, and component patterns while maintaining distinct color palettes (blue-slate for apartments, amber/moss for retreats).

## Architecture

### Current State (pre-migration)
- React 19 + Vite SPA with Wouter routing
- 37 apartments in a static TypeScript array
- Single page at `/` with map, list, filters, compare, favorites

### Target State (post-migration)
- Astro 5 with `@astrojs/react` integration (React components as islands)
- File-based routing with content collections
- Static output only (no SSR adapter, no Node.js runtime)
- Vertical registry system driving navigation, sitemap, and palette switching
- Content collections for retreat properties, regions, origin cities, seasonal guides

### Key Patterns
- **Vertical registry** — JSON configs in `src/verticals/` define each section (route prefix, palette, content collection, nav label)
- **Palette switching** — `[data-vertical]` CSS attribute on layout wrapper applies vertical-specific CSS custom properties
- **React islands** — Interactive components (map, filters, compare) hydrate client-side via `client:load` or `client:visible`
- **Content collections** — Retreat data lives as Markdown files with Zod-validated frontmatter in `src/content/`
- **Apartment data** — Remains as a static TypeScript array (no migration needed)

## Conventions

### Code Style
- Use TypeScript strict mode
- Functional components with hooks only (no class components)
- Use the `cn()` utility from `@/lib/utils` for conditional class merging
- Import UI components from `@/components/ui/<component>`
- Import feature components from `@/components/<Component>`
- Import retreat components from `@/components/retreat/<Component>`
- Import shared components from `@/components/shared/<Component>`
- Use the `@/` path alias for all src-relative imports (resolves to `src/`)

### Styling
- Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, no `tailwind.config.js`)
- Two-layer token architecture: semantic tokens (`:root`) → palette values (`[data-vertical]`)
- Use semantic color tokens (`var(--surface-base)`, `var(--accent-primary)`, etc.) — never raw color values
- Background lightness ≤ 11% HSL across both verticals (cinematic dark aesthetic)
- Typography: Playfair Display for headings (h1–h6), Jost for body text
- Cinematic effects (film grain, custom cursor, scroll-reveal) are opt-in CSS utility classes

### Components
- All reusable UI primitives live in `src/components/ui/` — these are shadcn/ui, do not modify
- Apartment feature components live in `src/components/` (FilterSidebar, MapView, etc.)
- Retreat feature components live in `src/components/retreat/` (RetreatBrowse, PropertyCard, etc.)
- Shared cross-vertical components live in `src/components/shared/` (Navigation, MobileMenu)
- Astro layouts live in `src/layouts/` (BaseLayout, VerticalLayout, PropertyLayout)
- Astro pages live in `src/pages/` with file-based routing

### Content Collections
- Property Markdown files in `src/content/properties/`
- Region Markdown files in `src/content/regions/`
- Origin city data files in `src/content/origin-cities/`
- Seasonal guide Markdown files in `src/content/seasonal-guides/`
- Schemas defined in `src/content/config.ts` with Zod validation
- Adding new content = adding a Markdown file with valid frontmatter (no code changes)

### Data
- Apartment data is a typed array in `src/data/apartments.ts` (unchanged from pre-migration)
- The `Apartment` interface defines the shape — always keep it in sync when adding fields
- **URL rule**: Every apartment `url` field MUST point to the property's own website. Never use Zillow, apartments.com, or any aggregator.
- **Retreat URL rule**: Every property `bookingUrl` MUST point to the property's own domain or a specific listing page (individual Airbnb/VRBO listing). Never search results or aggregator homepages.

### Curation Standards (Retreat Properties)
- Privacy level ≥ 3 out of 5
- Hot tub or soaking tub required in amenities
- Road access must be "sedan-friendly"
- Wow factor description 20–300 characters
- Direct booking URL required
- These are enforced at build time via Zod schema refinements

### State Management
- Apartment filter state: `src/hooks/use-apartment-filters.ts` (URL sync)
- Retreat filter state: `src/hooks/use-retreat-filters.ts` (URL sync via `history.replaceState`)
- Favorites: `src/hooks/use-favorites.ts` (localStorage persistence)
- Score weights: `src/hooks/use-score-weights.ts` (localStorage persistence)

## Build & Dev

```bash
# Dev server (Astro dev with HMR + React Fast Refresh)
npm run dev

# Production build (static output to dist/)
npm run build

# Preview production build
npm run preview

# Type checking (Astro check + TypeScript)
npm run typecheck

# Run tests
npm run test
```

## Key Dependencies

- `astro` — Build framework (static site generation, content collections, file-based routing)
- `@astrojs/react` — React island integration
- `@astrojs/sitemap` — Automatic sitemap generation
- `react` / `react-dom` — UI components (rendered as islands)
- `react-leaflet` / `leaflet` — Map rendering (lazy-loaded via `client:visible`)
- `tailwindcss` / `@tailwindcss/vite` — Styling
- `zod` — Content collection schema validation
- `lucide-react` — Icon library
- `framer-motion` — Animations (available)
- `vitest` / `fast-check` — Testing (property-based + unit)

## When Adding Features

### Adding a new vertical
1. Create a JSON config in `src/verticals/` with id, name, routePrefix, palette, order
2. Create a palette CSS file in `src/styles/palettes/`
3. Create page templates in `src/pages/[prefix]/`
4. Optionally create a content collection in `src/content/` with schema in `src/content/config.ts`
5. The vertical auto-registers in navigation and sitemap

### Adding a new retreat property
1. Create a Markdown file in `src/content/properties/` with valid frontmatter
2. Ensure it meets curation standards (privacy ≥ 3, hot tub, sedan-friendly, wow factor, direct URL)
3. It appears automatically on browse page and region page after rebuild

### Adding a new destination region
1. Create a Markdown file in `src/content/regions/` with name, slug, description (≥ 50 chars), highlights
2. Add at least one property in that region
3. Region appears in navigation and browse page after rebuild

### Adding a new origin city
1. Create a data file in `src/content/origin-cities/` with name, slug, coordinates
2. Add drive time entries to property frontmatter for the new city

### Adding new apartment fields
1. Update the `Apartment` interface in `src/data/apartments.ts`
2. Populate the field for all entries
3. Update filter logic in `use-apartment-filters.ts` if filterable

### Adding new apartment filter controls
1. Add state in `use-apartment-filters.ts`
2. Add filter logic to `filteredApartments` useMemo
3. Update URL serialization
4. Increment `activeFilterCount`

### General rules
- Prefer existing UI components from `src/components/ui/` before installing new libraries
- Keep the app fully client-side — no API calls or server dependencies
- Heavy libraries should use `client:visible` directive for lazy hydration
- All content pages must have meta tags (title, description, og:*) and canonical URL
