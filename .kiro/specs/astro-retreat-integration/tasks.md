# Implementation Plan: Astro Retreat Integration (Basecamp Atlas)

## Overview

Migrate the Charlotte Apartment Finder from React + Vite to Astro 5 and integrate the solo retreat guide as a second vertical. The implementation proceeds in dependency order: scaffolding → design system → shared infrastructure → content collections → vertical pages → SEO → deployment config → testing → rebrand.

## Tasks

- [x] 1. Astro 5 project scaffolding and migration
  - [x] 1.1 Initialize Astro 5 project with React integration
    - Install `astro`, `@astrojs/react`, `@astrojs/sitemap` and configure `astro.config.mjs` with `output: 'static'`, `@tailwindcss/vite` plugin, `@/` path alias, Sharp image service, and prefetch on hover
    - Update `package.json` name to `basecamp-atlas`, add scripts: `dev`, `build`, `preview`, `typecheck`
    - Create `tsconfig.json` with `@/*` path alias and strict mode
    - _Requirements: 1.1, 1.2, 1.4, 12.1_

  - [x] 1.2 Migrate existing source files into Astro project structure
    - Move `src/components/`, `src/hooks/`, `src/data/`, `src/lib/` into the Astro `src/` directory preserving all paths
    - Move `src/components/ui/` (55 shadcn/ui files) unchanged
    - Move `public/` assets (manifest.json, apartment.png)
    - Remove Vite config, `index.html`, Wouter routing, and `src/main.tsx`
    - Verify all `@/` imports resolve correctly
    - _Requirements: 1.3, 1.5, 2.1_

  - [x] 1.3 Create ApartmentFinder wrapper island component
    - Create `src/components/ApartmentFinder.tsx` that wraps the existing `Map.tsx` page logic (filters, favorites, compare, map/list toggle, score weights) as a single React island
    - Include `QueryClientProvider`, `TooltipProvider`, and `Toaster` within the island boundary
    - Preserve all existing state management (URL sync via `useApartmentFilters`, localStorage via `useFavorites` and `useScoreWeights`)
    - _Requirements: 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 2.8_

- [x] 2. Vertical registry system
  - [x] 2.1 Implement vertical registry loader and types
    - Create `src/lib/types.ts` with `VerticalConfig` interface (id, name, description, routePrefix, palette, contentCollection, order)
    - Create `src/lib/verticals.ts` with `loadVerticals()`, `getActiveVertical(pathname)`, and `validateVerticals(configs)` functions
    - `loadVerticals()` reads all JSON files from `src/verticals/` directory
    - `getActiveVertical()` returns the vertical whose routePrefix is a prefix of the pathname (longest prefix match)
    - `validateVerticals()` checks for duplicate route prefixes, missing required fields, name ≤ 20 chars, routePrefix starts with "/"
    - _Requirements: 14.1, 14.5, 14.7, 14.8, 14.9_

  - [x] 2.2 Create vertical configuration files
    - Create `src/verticals/live.json` with id "live", name "Live", routePrefix "/live", palette "live.css", order 1
    - Create `src/verticals/escape.json` with id "escape", name "Escape", routePrefix "/escape", palette "escape.css", contentCollection "properties", order 2
    - _Requirements: 14.1, 14.2_

  - [x]* 2.3 Write property test for vertical config validation (Property 9)
    - **Property 9: Vertical config validation**
    - Test that validation passes for valid config sets and fails for duplicate route prefixes or missing fields
    - Use fast-check to generate random valid/invalid config sets
    - **Validates: Requirements 14.1, 14.5, 14.8, 14.9**

  - [x]* 2.4 Write property test for route-to-vertical mapping (Property 8)
    - **Property 8: Route-to-vertical mapping**
    - Test that `getActiveVertical` returns correct vertical for any pathname or null if no match
    - Use fast-check to generate random URL paths and vertical configs
    - **Validates: Requirements 6.5, 10.2**

- [x] 3. Design system — palettes, typography, and effects
  - [x] 3.1 Create global CSS with shared typography and semantic tokens
    - Create `src/styles/global.css` with Tailwind imports, `@font-face` declarations for Playfair Display (400, 700, 900, italic) and Jost (200, 300, 400)
    - Define semantic token layer (`:root` variables mapping to `--palette-*` values): surface-base, surface-elevated, surface-overlay, text-primary, text-secondary, text-muted, accent-primary, accent-secondary, accent-tertiary, border-subtle, border-default
    - Ensure background lightness ≤ 11% HSL for both palettes
    - _Requirements: 6.1, 6.6_

  - [x] 3.2 Create vertical-specific palette CSS files
    - Create `src/styles/palettes/live.css` with `[data-vertical="live"]` selector and blue-slate palette values (existing colors from current app)
    - Create `src/styles/palettes/escape.css` with `[data-vertical="escape"]` selector and amber/moss/rust palette values
    - _Requirements: 6.2, 6.3, 6.5, 14.3_

  - [x] 3.3 Create cinematic effects CSS
    - Create `src/styles/effects.css` with opt-in utility classes: `.grain-overlay` (film grain via SVG fractalNoise), `.custom-cursor` (amber dot + lagging ring), `.scroll-reveal` (fade-up on scroll with IntersectionObserver)
    - All effects inactive by default, activated by adding class to element
    - _Requirements: 6.7_

- [x] 4. Shared navigation and layouts
  - [x] 4.1 Create BaseLayout.astro
    - Create `src/layouts/BaseLayout.astro` with HTML shell, `<head>` (charset, viewport, fonts, meta tags from props), grain overlay slot
    - Accept props: title, description, ogTitle, ogDescription, ogType, ogUrl, canonical
    - Include all palette CSS imports and global.css
    - Include JSON-LD slot for pages that need structured data
    - _Requirements: 11.4, 15.9_

  - [x] 4.2 Create VerticalLayout.astro
    - Create `src/layouts/VerticalLayout.astro` that wraps BaseLayout
    - Accept `vertical` prop, apply `data-vertical` attribute to wrapper div
    - Import and render Navigation island with `client:load`
    - Pass verticals list and active vertical to Navigation
    - _Requirements: 6.5, 10.1, 10.5_

  - [x] 4.3 Create shared Navigation React island
    - Create `src/components/shared/Navigation.tsx` with fixed-position nav bar
    - Render brand mark "Basecamp Atlas" linking to `/`
    - Render vertical links from registry (ordered by `config.order`)
    - Active state uses vertical's `--accent-primary` color
    - Create `src/components/shared/MobileMenu.tsx` with hamburger toggle, focus trap, keyboard nav (Tab, Escape), `aria-expanded` state
    - Collapse to mobile menu at viewport ≤ 768px
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 4.4 Create PropertyLayout.astro
    - Create `src/layouts/PropertyLayout.astro` for two-column property detail layout
    - Main editorial content on left, metadata sidebar on right
    - Collapse to single stacked column below 900px viewport width
    - Include breadcrumb navigation, scroll-reveal, film grain, custom cursor
    - _Requirements: 13.3, 13.4, 13.6_

- [x] 5. Checkpoint — Verify scaffolding builds
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Apartment finder preservation as React island
  - [x] 6.1 Create /live route page
    - Create `src/pages/live/index.astro` using VerticalLayout with vertical="live"
    - Render `<ApartmentFinder client:load />` island
    - Set page title, description, and meta tags for apartment finder
    - _Requirements: 2.1, 2.6_

  - [x]* 6.2 Write property test for apartment filter URL round-trip (Property 1)
    - **Property 1: Apartment filter state URL round-trip**
    - Test that serializing filter state to URL params and parsing back produces equivalent state
    - Verify default values are omitted from URL
    - Use fast-check to generate random FilterState objects
    - **Validates: Requirements 2.4, 2.8**

  - [x]* 6.3 Write property test for weighted score calculation (Property 2)
    - **Property 2: Weighted score calculation correctness**
    - Test that for any apartment scores and weights summing to 1.0, calculated score equals sum of (score × weight) rounded to 1 decimal
    - Use fast-check to generate random scores (1–10) and weights
    - **Validates: Requirements 2.5**

  - [x]* 6.4 Write property test for CSV export round-trip (Property 3)
    - **Property 3: CSV export round-trip**
    - Test that exporting apartments to CSV and parsing back preserves names, addresses, neighborhoods, rent ranges, and scores
    - Use fast-check to generate random apartment subsets
    - **Validates: Requirements 2.3**

- [x] 7. Content collection schemas
  - [x] 7.1 Create content collection config with Zod schemas
    - Create `src/content/config.ts` with `defineCollection` for: properties, regions, originCities, seasonalGuides
    - Properties schema: name, slug, region, stayType, priceRange, driveTimes, privacyLevel, amenities, wowFactor, bookingUrl, coordinates, nearbyHikes, seasonalTags (optional), lastVerified (optional), roadAccess
    - Add Zod refinements: privacy ≥ 3, hot tub/soaking tub required, roadAccess = "sedan-friendly"
    - Regions schema: name, slug, description (min 50 chars), highlights, coordinates
    - Origin cities schema (data collection): name, slug, coordinates
    - Seasonal guides schema: title, slug, season (enum), featuredProperties (3–10 slugs), description
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 9.1, 9.6_

  - [x] 7.2 Create seed content files for properties
    - Create at least 3 sample property Markdown files in `src/content/properties/` with valid frontmatter covering different stay types and regions
    - Include editorial Markdown body content with headings, lists, and descriptions
    - _Requirements: 3.4, 3.5, 7.1_

  - [x] 7.3 Create seed content files for regions and origin cities
    - Create region Markdown files in `src/content/regions/` for launch regions: asheville-blue-ridge, smokies, south-cumberland, north-georgia, shenandoah-va, new-river-gorge-wv, upstate-sc
    - Create origin city JSON/YAML files in `src/content/origin-cities/` for: charlotte, atlanta, nashville, richmond, charleston-wv, greenville, raleigh, asheville
    - _Requirements: 4.2, 4.5, 4.6, 4.7_

  - [x] 7.4 Create seed seasonal guide content
    - Create at least 3 seasonal guide Markdown files in `src/content/seasonal-guides/`: fall-foliage, winter-hot-tub, summer-waterfalls
    - Reference valid property slugs from seed content
    - _Requirements: 9.1, 9.4, 9.5_

  - [x]* 7.5 Write property test for content schema validation (Property 4)
    - **Property 4: Content schema validation**
    - Test that valid property objects pass schema and invalid ones are rejected with field-specific errors
    - Use fast-check to generate random valid/invalid property objects
    - **Validates: Requirements 3.2, 3.3, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**

  - [x]* 7.6 Write property test for seasonal guide resolution (Property 13)
    - **Property 13: Seasonal guide property resolution**
    - Test that resolving featured property slugs returns correct objects for valid slugs and errors for invalid ones
    - Use fast-check to generate random property sets and slug lists
    - **Validates: Requirements 9.2, 9.3**

- [x] 8. Drive time utilities
  - [x] 8.1 Implement drive time formatting utility
    - Create `src/lib/drive-time.ts` with `formatDriveTime(minutes: number): string` function
    - Format: "Xh Ym" for ≥ 60 minutes, "Ym" for < 60 minutes
    - Add `parseDriveTime(formatted: string): number` for round-trip verification
    - _Requirements: 4.4_

  - [x]* 8.2 Write property test for drive time formatting (Property 7)
    - **Property 7: Drive time formatting**
    - Test that formatting and parsing are inverse operations for any integer 1–600
    - Use fast-check to generate random minute values
    - **Validates: Requirements 4.4**

- [x] 9. Retreat browse page with filters
  - [x] 9.1 Implement retreat filter logic and URL sync
    - Create `src/hooks/use-retreat-filters.ts` with `RetreatFilterState` interface
    - Implement filter logic: regions (multi-select), stayTypes (multi-select, case-insensitive), priceRange ($50–$1500, $25 increments), maxDriveTime (60–360 min, 30-min increments), selectedOrigin, minPrivacy (1–5), amenities (checkboxes)
    - Sync non-default filter values to URL query params via `history.replaceState`
    - Implement reset function that clears all filters and removes URL params
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.7, 5.8_

  - [x] 9.2 Create RetreatBrowse React island
    - Create `src/components/retreat/RetreatBrowse.tsx` accepting serialized properties, regions, and origin cities as props
    - Render property cards with filter sidebar
    - Display matching count in format "{count} properties"
    - Show empty state with reset button when no results match
    - _Requirements: 5.1, 5.3, 5.6, 5.7_

  - [x] 9.3 Create RetreatFilterSidebar component
    - Create `src/components/retreat/RetreatFilterSidebar.tsx` with all filter controls
    - Region multi-select, stay type multi-select, price range slider, drive time slider with origin selector, privacy minimum, amenity checkboxes (hot tub, fire pit, sauna, kitchen)
    - _Requirements: 5.2_

  - [x] 9.4 Create PropertyCard component
    - Create `src/components/retreat/PropertyCard.tsx` displaying property name, stay type, region, price range, privacy dots, drive times from selected origin, wow factor excerpt, and link to detail page
    - _Requirements: 5.1, 4.4_

  - [x] 9.5 Create /escape browse page
    - Create `src/pages/escape/index.astro` using VerticalLayout with vertical="escape"
    - Fetch all properties, regions, and origin cities from content collections
    - Pass serialized data to `<RetreatBrowse client:load />` island
    - Support `?stayType=` query param for pre-applied filter presets
    - _Requirements: 5.1, 5.5_

  - [x]* 9.6 Write property test for retreat filter correctness (Property 5)
    - **Property 5: Retreat filter correctness**
    - Test that applying filters returns exactly those properties satisfying ALL criteria simultaneously
    - Use fast-check to generate random property arrays and filter states
    - **Validates: Requirements 5.2, 5.6, 7.3, 4.3**

  - [x]* 9.7 Write property test for retreat filter URL round-trip (Property 6)
    - **Property 6: Retreat filter state URL round-trip**
    - Test that serializing retreat filter state to URL params and parsing back produces equivalent state
    - Use fast-check to generate random RetreatFilterState objects
    - **Validates: Requirements 5.4, 5.8**

- [x] 10. Checkpoint — Verify browse and filter functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Property detail pages
  - [x] 11.1 Create property detail page template
    - Create `src/pages/escape/[region]/[property].astro` using PropertyLayout
    - Fetch property by slug, render: name, stay type badge, region, editorial body (Markdown), amenity pills, privacy dots, price range, drive times (sorted shortest first), nearby hikes, road access, wow factor callout, booking CTA (new tab)
    - Omit sections for absent optional fields (no empty containers)
    - Include breadcrumb: Escape → [Region Name] → [Property Name]
    - Generate `getStaticPaths()` from all properties in collection
    - _Requirements: 13.1, 13.2, 13.4, 13.5, 13.6_

  - [x]* 11.2 Write property test for property detail rendering completeness (Property 12)
    - **Property 12: Property detail rendering completeness**
    - Test that all required fields appear in rendered output and absent optional fields produce no empty containers
    - Use fast-check to generate random valid property objects with varying optional fields
    - **Validates: Requirements 13.2, 13.5**

- [x] 12. Region pages
  - [x] 12.1 Create region page template
    - Create `src/pages/escape/[region].astro` using VerticalLayout with vertical="escape"
    - Fetch region by slug, display region intro (description, highlights)
    - List all properties in that region with PropertyCard components
    - Generate `getStaticPaths()` from all regions in collection
    - Hide regions with zero properties from navigation
    - _Requirements: 4.1, 4.3, 4.8_

  - [x]* 12.2 Write property test for empty regions excluded (Property 10)
    - **Property 10: Empty regions excluded from navigation**
    - Test that only regions with ≥ 1 published property appear in navigation/browse
    - Use fast-check to generate random region/property sets
    - **Validates: Requirements 4.8**

- [x] 13. Seasonal guide pages
  - [x] 13.1 Create seasonal guide page template
    - Create `src/pages/escape/seasonal/[guide].astro` using VerticalLayout with vertical="escape"
    - Fetch guide by slug, resolve featured property slugs to property objects
    - Render editorial Markdown body with inline property cards for featured properties
    - Produce build-time error if any slug doesn't resolve
    - Generate `getStaticPaths()` from all seasonal guides
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

- [x] 14. Landing page
  - [x] 14.1 Create landing page at /
    - Create `src/pages/index.astro` using BaseLayout (no vertical palette)
    - Display "Basecamp Atlas" brand identity with value proposition headline (≤ 80 chars) and subtext (≤ 200 chars)
    - Render entry point card for each registered vertical: name, description, accent color, link
    - Feature at least 3 preview cards from each vertical's content collection
    - Include internal links to all destination region pages
    - Use cinematic dark aesthetic with shared typography, no React islands
    - _Requirements: 10.3, 15.1, 15.2, 15.3, 15.4, 15.6, 15.7, 15.8_

  - [x] 14.2 Add JSON-LD structured data to landing page
    - Add schema.org `WebSite` JSON-LD with name, url, description, and `potentialAction` (SearchAction)
    - Describe site as a local business discovery platform
    - _Requirements: 15.5_

- [x] 15. SEO — sitemap, meta, canonical, JSON-LD
  - [x] 15.1 Configure sitemap generation and canonical URLs
    - Verify `@astrojs/sitemap` integration generates valid sitemap.xml with all routes (properties, regions, seasonal guides, /live, /)
    - Add `<link rel="canonical">` with absolute URL to BaseLayout for every page
    - Ensure all pages have meta tags: title, description, og:title, og:description, og:type, og:url
    - _Requirements: 11.3, 11.4, 15.9_

  - [x]* 15.2 Write integration test for static output completeness (Property 11)
    - **Property 11: Static output completeness**
    - Post-build assertion: verify HTML file exists for every content route, sitemap.xml contains all URLs, every HTML has required meta tags and canonical link
    - **Validates: Requirements 11.2, 11.3, 11.4, 15.8, 15.9**

- [x] 16. Static deployment configuration
  - [x] 16.1 Configure static deployment and image optimization
    - Verify `output: 'static'` produces dist/ with only HTML, CSS, JS, and assets
    - Configure Astro image optimization with Sharp (WebP/AVIF output)
    - Add Vercel/Cloudflare Pages deployment config if needed (static adapter)
    - Verify build completes in < 120 seconds for seed content
    - _Requirements: 11.1, 11.2, 11.5, 11.6_

- [x] 17. Project rebrand
  - [x] 17.1 Complete rebrand to Basecamp Atlas
    - Update `package.json` name to "basecamp-atlas"
    - Update `public/manifest.json` name and short_name to "Basecamp Atlas"
    - Update README title to "Basecamp Atlas"
    - Ensure no user-facing content references "charlotte-apartments" or "Charlotte Apartment Finder"
    - Update HTML title template to include "Basecamp Atlas"
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 18. Testing infrastructure setup
  - [x] 18.1 Set up Vitest and fast-check testing framework
    - Install `vitest`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`
    - Create `vitest.config.ts` with path aliases and React testing setup
    - Create test setup file for jest-dom matchers
    - Configure minimum 100 iterations for property tests
    - _Requirements: (testing infrastructure for all property tests)_

- [x] 19. Final checkpoint — Full build and test verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The existing 55 shadcn/ui components require zero changes — they already consume CSS custom properties
- Apartment data remains as a static TypeScript array (no content collection migration needed)
- All React islands use `client:load` for above-fold interactive content and `client:visible` for heavy below-fold components (Leaflet map)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "18.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "2.1", "2.2", "3.1"] },
    { "id": 3, "tasks": ["2.3", "2.4", "3.2", "3.3"] },
    { "id": 4, "tasks": ["4.1", "8.1"] },
    { "id": 5, "tasks": ["4.2", "4.3", "4.4", "8.2"] },
    { "id": 6, "tasks": ["6.1", "7.1"] },
    { "id": 7, "tasks": ["6.2", "6.3", "6.4", "7.2", "7.3", "7.4"] },
    { "id": 8, "tasks": ["7.5", "7.6", "9.1"] },
    { "id": 9, "tasks": ["9.2", "9.3", "9.4"] },
    { "id": 10, "tasks": ["9.5"] },
    { "id": 11, "tasks": ["9.6", "9.7", "11.1"] },
    { "id": 12, "tasks": ["11.2", "12.1"] },
    { "id": 13, "tasks": ["12.2", "13.1"] },
    { "id": 14, "tasks": ["14.1"] },
    { "id": 15, "tasks": ["14.2", "15.1", "17.1"] },
    { "id": 16, "tasks": ["15.2", "16.1"] }
  ]
}
```
