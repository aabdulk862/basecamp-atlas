# Implementation Plan: Unified Map Expansion

## Overview

This plan extracts the existing `MapView.tsx` into a shared `UnifiedMap` component with vertical-specific adapters, introduces multi-city and international destination support via content collections, expands vacation categories, builds a premium homepage, and ensures full responsive behavior. Tasks are ordered so each step builds on the previous, with property-based tests validating correctness properties from the design.

## Tasks

- [x] 1. Define shared types, interfaces, and content collection schemas
  - [x] 1.1 Create `src/components/map/types.ts` with `MarkerDescriptor`, `MapThemeConfig`, and `UnifiedMapProps` interfaces
    - Define `MarkerDescriptor` with id, position (lat/lng), label, category, metadata
    - Define `MapThemeConfig` with tileUrl, clusterBgColor, clusterBorderColor, clusterTextColor, overlayBgColor
    - Define `UnifiedMapProps` with center, zoom, markers, clusterThreshold, markerRenderer, onMarkerSelect, theme, disableDoubleTapZoom, children
    - Export `LIVE_THEME` and `ESCAPE_THEME` default config objects
    - Export `VACATION_CATEGORIES` const array and type (retreat, cruise, resort, villa, glamping, adventure, wellness)
    - Export `CATEGORY_ICONS` mapping (shape + color per category: cabin/moss, ship/blue, palm/gold, house/rust, tent/purple, compass/orange, lotus/teal)
    - _Requirements: 1.1, 1.2, 1.4, 7.1, 7.5, 6.1_

  - [x] 1.2 Add `cityConfigs` and `destinationConfigs` content collections to `src/content/config.ts`
    - Add `cityConfigs` collection with glob loader for `src/content/city-configs/*.json`
    - Schema: name, slug (regex `^[a-z0-9-]+$`), center (lat/lng with min/max), zoom (int 10–15), dataSource
    - Add `destinationConfigs` collection with glob loader for `src/content/destination-configs/*.json`
    - Schema: name, slug, description (min 50 chars), scope (enum us/international), center (lat/lng), zoom (int 3–12)
    - Update `stayType` field in properties schema from `z.string()` to `z.enum(VACATION_CATEGORIES)` (retreat, cruise, resort, villa, glamping, adventure, wellness)
    - Export updated `collections` object
    - _Requirements: 4.1, 4.6, 5.1, 5.7, 6.1_

  - [x] 1.3 Create seed content collection data files
    - Create `src/content/city-configs/charlotte.json` with Charlotte defaults (lat 35.205, lng -80.845, zoom 12)
    - Create `src/content/destination-configs/` with at least one US and one international example entry (e.g., smoky-mountains.json for US, vietnam.json for international with center ~16.05/108.22, zoom 6)
    - Update existing property Markdown frontmatter `stayType` values to match the new enum (retreat, cruise, resort, villa, glamping, adventure, wellness)
    - _Requirements: 4.1, 4.6, 5.2, 5.7_

  - [x]* 1.4 Write property tests for content collection schema validation
    - **Property 12: Content collection schema validation**
    - Test CityConfig schema accepts valid objects and rejects invalid (bad slug, out-of-range zoom, missing fields)
    - Test DestinationConfig schema accepts valid objects and rejects invalid (short description, bad scope, out-of-range zoom)
    - Test VacationCategory enum accepts only defined values (retreat, cruise, resort, villa, glamping, adventure, wellness) and rejects others
    - **Validates: Requirements 4.1, 5.1, 6.1**

- [x] 2. Implement UnifiedMap shared component
  - [x] 2.1 Create `src/components/map/UnifiedMap.tsx` with core map rendering
    - Render `MapContainer` with configurable center, zoom, and tile layer from theme
    - Implement marker rendering from `MarkerDescriptor[]` using `markerRenderer` prop or Leaflet default
    - Implement `MarkerClusterGroup` activation when markers exceed `clusterThreshold` (default 10)
    - Apply theme tokens to cluster icons (background, border, text colors from CSS custom properties)
    - Position `ZoomControl` at bottom-right
    - Render `children` as overlay layers outside cluster group
    - Handle empty markers array gracefully (render base map only)
    - Fire `onMarkerSelect` callback on marker click with the full `MarkerDescriptor`
    - On mobile: disable double-tap zoom when `disableDoubleTapZoom` is true, enable touch pan/pinch-zoom
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 7.1, 7.4, 9.1, 9.3, 9.7_

  - [x]* 2.2 Write property test for marker rendering count
    - **Property 1: Marker rendering count matches input**
    - Generate arbitrary arrays of valid MarkerDescriptor objects with distinct positions
    - Assert rendered marker count equals input array length (clustering disabled)
    - **Validates: Requirements 1.2**

  - [x]* 2.3 Write property test for clustering threshold activation
    - **Property 2: Clustering threshold activation**
    - Generate arbitrary marker arrays and threshold values
    - Assert clustering enabled when count > threshold, individual rendering when count ≤ threshold
    - **Validates: Requirements 1.3**

  - [x]* 2.4 Write property test for marker click callback correctness
    - **Property 3: Marker click delivers correct descriptor**
    - Generate arbitrary MarkerDescriptor, simulate click, assert callback receives exact same object
    - **Validates: Requirements 1.6**

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement LiveMapAdapter
  - [x] 4.1 Create `src/components/map/LiveMapAdapter.tsx`
    - Accept `LiveMapAdapterProps` (apartments, favorites, onSelectApartment, cityConfig)
    - Transform `Apartment[]` → `MarkerDescriptor[]`, filtering out invalid coordinates (lat outside [-90,90] or lng outside [-180,180])
    - Set marker id to apartment name, label to apartment name, category to "apartment", metadata with overallScore, neighborhood, source Apartment
    - Provide `markerRenderer` function using existing `createCustomIcon` logic (score-colored pins)
    - Add heart indicator on markers for apartments in favorites list
    - Pass light rail stations and neighborhood polygons as overlay children to UnifiedMap
    - Center map on `cityConfig.center` at `cityConfig.zoom`
    - Apply `LIVE_THEME` (Google satellite hybrid tiles)
    - Invoke `onSelectApartment` with Apartment from marker metadata on selection
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 7.2, 7.5_

  - [x] 4.2 Create `src/lib/score-color.ts` — extract score-to-color mapping as a pure function
    - Export `getScoreColor(score: number): string` with the existing color scale logic
    - Green (#22c55e) for ≥ 8, lime (#84cc16) for ≥ 7, yellow (#eab308) for ≥ 6, orange (#f97316) for ≥ 5, red (#ef4444) for < 5
    - _Requirements: 2.2_

  - [x]* 4.3 Write property test for score-to-color mapping
    - **Property 5: Score-to-color mapping correctness**
    - Generate arbitrary scores 0–10, assert correct color returned for each range
    - **Validates: Requirements 2.2**

  - [x]* 4.4 Write property test for LiveMapAdapter transformation
    - **Property 4: Live adapter transformation preserves apartment data**
    - Generate arbitrary valid Apartment objects, assert MarkerDescriptor fields match source
    - **Validates: Requirements 2.1**

  - [x]* 4.5 Write property test for favorites indicator
    - **Property 6: Favorites indicator matches list membership**
    - Generate arbitrary apartment names and favorites lists, assert heart indicator iff name in list
    - **Validates: Requirements 2.3**

  - [x]* 4.6 Write property test for invalid coordinate exclusion
    - **Property 7: Invalid coordinates are excluded**
    - Generate apartment arrays with some invalid coordinates, assert output only contains valid entries
    - **Validates: Requirements 2.6**

- [x] 5. Implement EscapeMapAdapter and PropertySummaryCard
  - [x] 5.1 Create `src/components/map/EscapeMapAdapter.tsx`
    - Accept `EscapeMapAdapterProps` (properties, filters, destinationConfig, onSelectProperty, selectedProperty, onDismissCard)
    - Transform filtered `SerializedProperty[]` → `MarkerDescriptor[]` with coordinates, name, region, stayType as category, metadata with price range and source property
    - Provide `markerRenderer` with unique icon per VacationCategory (using CATEGORY_ICONS mapping)
    - Center map on `destinationConfig.center`/`zoom` when provided
    - Show "no results" indicator when filtered markers are empty
    - Apply `ESCAPE_THEME` (OpenStreetMap tiles)
    - Manage selected property state for summary card display
    - _Requirements: 3.1, 3.2, 3.6, 3.7, 3.8, 5.3, 5.6, 7.3, 7.5_

  - [x] 5.2 Create `src/components/escape/PropertySummaryCard.tsx`
    - Display property name, region, price range formatted as "$min–$max/night"
    - Display wow factor truncated to 120 characters with ellipsis if longer
    - Include link to `/escape/[region]/[slug]`
    - Close button and click-outside dismiss behavior
    - Max width 250px on desktop, full-width bottom sheet on mobile (via vaul Drawer)
    - _Requirements: 3.3, 3.4, 3.5, 9.2, 10.4_

  - [x]* 5.3 Write property test for EscapeMapAdapter transformation
    - **Property 8: Escape adapter transformation preserves property data**
    - Generate arbitrary SerializedProperty objects, assert MarkerDescriptor fields match source
    - **Validates: Requirements 3.1**

  - [x]* 5.4 Write property test for category icon uniqueness
    - **Property 9: Category icon uniqueness**
    - For all pairs of distinct VacationCategory values, assert icon mapping produces different shape or color
    - **Validates: Requirements 3.2, 6.5**

  - [x]* 5.5 Write property test for summary card content and truncation
    - **Property 10: Summary card content completeness and truncation**
    - Generate arbitrary properties with varying wowFactor lengths, assert truncation at 120 chars + ellipsis
    - **Validates: Requirements 3.3**

  - [x]* 5.6 Write property test for filter-to-marker visibility
    - **Property 11: Filter criteria determines visible markers**
    - Generate arbitrary property sets and filter combinations, assert visible markers = subset matching all criteria
    - **Validates: Requirements 3.7, 6.3**

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement multi-city support for Live vertical
  - [x] 7.1 Create `src/components/map/CitySelector.tsx`
    - Accept `CitySelectorProps` (cities, currentCity slug)
    - Render cities in alphabetical order by name
    - Desktop: dropdown in toolbar area
    - Mobile: full-width bottom sheet via vaul Drawer
    - Navigate to `/live/[city-slug]` on selection
    - _Requirements: 4.4, 9.5, 10.1_

  - [x] 7.2 Create dynamic route page `src/pages/live/[city].astro`
    - Load `cityConfigs` content collection, find matching city by slug
    - If slug not found, render 404 page with navigation back to city selector
    - Pass city config and apartment data to LiveMapAdapter
    - Default `/live` to Charlotte city config
    - _Requirements: 4.2, 4.3, 4.5_

  - [x] 7.3 Update `src/pages/live/index.astro` to integrate CitySelector and UnifiedMap
    - Replace direct `MapView` usage with `LiveMapAdapter` consuming `UnifiedMap`
    - Add CitySelector to toolbar
    - Default to Charlotte city config
    - Preserve existing filter sidebar, favorites, compare, and view toggle functionality
    - _Requirements: 4.5, 2.5_

  - [x]* 7.4 Write property test for alphabetical ordering in CitySelector
    - **Property 13: Alphabetical ordering in selectors**
    - Generate arbitrary city name arrays, assert displayed order is case-insensitive alphabetical
    - **Validates: Requirements 4.4, 5.5**

- [x] 8. Implement international destination support for Escape vertical
  - [x] 8.1 Create `src/components/escape/DestinationBrowser.tsx`
    - Accept `DestinationBrowserProps` (destinations array)
    - Group destinations by scope (US / International)
    - Alphabetical sort within each group
    - Desktop: multi-column grid (≥2 columns at 1024px+)
    - Mobile: scrollable vertical list
    - Link each destination to `/escape/destinations/[slug]`
    - _Requirements: 5.5, 10.2_

  - [x] 8.2 Create dynamic route page `src/pages/escape/destinations/[destination].astro`
    - Load `destinationConfigs` collection, find matching destination by slug
    - If slug not found, render 404 page
    - Load properties associated with destination, pass to EscapeMapAdapter
    - If destination has zero properties, show "no properties available" message on map
    - Use destination's configured zoom and terrain/standard tile layer for international
    - _Requirements: 5.3, 5.4, 5.6, 5.8_

  - [x] 8.3 Create destination browser index page `src/pages/escape/destinations/index.astro`
    - Load all destination configs, pass to DestinationBrowser component
    - Responsive layout: single column mobile, multi-column desktop
    - _Requirements: 5.5, 10.2_

- [x] 9. Implement expanded vacation categories and filter integration
  - [x] 9.1 Update `src/components/retreat/RetreatFilterSidebar.tsx` to add category filter
    - Add checkbox controls for each VacationCategory value
    - Minimum tap target 44x44 CSS pixels on viewports below 1024px
    - Integrate with existing filter state (add categories to `useRetreatFilters`)
    - _Requirements: 6.2, 6.3, 6.4, 10.3_

  - [x] 9.2 Update `src/hooks/use-retreat-filters.ts` to support category filtering
    - Add `categories` field to `RetreatFilterState`
    - Add category filter logic to `filteredProperties` useMemo
    - Sync categories to URL params
    - When no categories selected, show all (unfiltered default)
    - _Requirements: 6.3, 6.4_

  - [x] 9.3 Update `src/components/retreat/PropertyCard.tsx` to display category badge
    - Add visible badge/label in card header showing the property's VacationCategory
    - Style badge with category-specific color from CATEGORY_ICONS mapping
    - _Requirements: 6.6_

  - [x]* 9.4 Write property test for category badge display
    - **Property 14: Property card displays category badge**
    - Generate arbitrary properties with valid VacationCategory, assert badge text matches category
    - **Validates: Requirements 6.6**

- [x] 10. Implement escape map page with filter integration
  - [x] 10.1 Create `src/pages/escape/map.astro` (or update existing escape page to include map view)
    - Load properties and regions from content collections
    - Pass to EscapeMapAdapter with RetreatFilterSidebar integration
    - Responsive split-pane: side-by-side on desktop (≥1024px), stacked with collapsible filter drawer on mobile/tablet
    - Filter button triggers slide-out drawer (max-width 85vw, capped at 24rem) on mobile
    - Map occupies ≥60% viewport width on tablet when alongside filter panel
    - _Requirements: 3.6, 3.7, 3.8, 9.4, 10.6, 10.7_

  - [x] 10.2 Wire marker selection to PropertySummaryCard with mobile bottom sheet
    - Desktop: overlay card (max 250px width) on marker select
    - Mobile: vaul Drawer bottom sheet (max 85dvh) on marker select
    - Replace card on new selection, dismiss on click-outside or close button
    - Ensure card readable at 320px viewport (max-width 100vw - 32px padding)
    - _Requirements: 3.3, 3.4, 3.5, 9.2, 10.4, 10.8_

- [x] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement premium homepage
  - [x] 12.1 Create `src/components/home/HeroSection.tsx`
    - Full-height hero (min-height 100vh) with dark gradient background (max lightness 11% HSL)
    - Tagline (≤60 chars), value proposition (≤200 chars)
    - Two CTA buttons linking to `/live` and `/escape` with min tap target 44×44px
    - Scroll-reveal animation via framer-motion (300–600ms duration)
    - _Requirements: 8.1, 8.2, 8.8_

  - [x] 12.2 Create `src/components/home/VerticalCards.tsx`
    - Cards for Live and Escape verticals with distinct accent colors from vertical palettes
    - Icon distinguishing each vertical
    - Scale or glow hover transition completing within 200ms
    - Scroll-reveal with stagger delay ≤150ms between siblings
    - _Requirements: 8.3, 8.8_

  - [x] 12.3 Create `src/components/home/FeaturedProperties.tsx`
    - Display 3–6 property preview cards with image placeholder, pricing, location, score/wow-factor
    - Mobile (<768px): horizontal scroll/carousel pattern
    - Desktop (≥768px): grid layout 2–3 columns
    - Hide section entirely if zero featured properties
    - _Requirements: 8.4, 8.5, 8.11_

  - [x] 12.4 Create `src/components/home/SocialProof.tsx`
    - Display ≥3 numeric metrics (cities, properties, destinations)
    - Animated count-up triggered on viewport entry via `useInView`
    - Animation completes within 2 seconds
    - _Requirements: 8.6, 8.8_

  - [x] 12.5 Create `src/components/home/DestinationHighlights.tsx`
    - Geographic visualization or region list showing multi-city/destination coverage
    - Display all regions from content collection
    - Scroll-reveal animation
    - _Requirements: 8.7, 8.8_

  - [x] 12.6 Update `src/pages/index.astro` to compose homepage sections
    - Import and render HeroSection, VerticalCards, FeaturedProperties, SocialProof, DestinationHighlights
    - Add footer with navigation links to both verticals, ≥3 destination regions, about section (≤300 chars)
    - Ensure LCP performance budget (≤2.5s on simulated 4G)
    - _Requirements: 8.9, 8.10_

- [x] 13. Implement responsive behavior and mobile polish
  - [x] 13.1 Add mobile touch handling to UnifiedMap
    - Capture touch events within map container to prevent page scroll during pan/zoom
    - Ensure single-finger pan and two-finger pinch-to-zoom work
    - Disable double-tap zoom on mobile
    - Map occupies full width and min-height 50vh on mobile
    - Cluster icons use minimum 36px diameter on mobile
    - _Requirements: 9.1, 9.3, 9.7, 10.9_

  - [x] 13.2 Add map view toggle toolbar for mobile
    - Fixed/sticky toolbar at bottom of viewport on mobile (<768px)
    - Map/list/grid toggle accessible without scrolling
    - _Requirements: 10.5_

  - [x] 13.3 Update `src/components/shared/MobileMenu.tsx` with multi-city and destination navigation
    - Add city links and destination links within hamburger menu on mobile (<768px)
    - Listed alongside existing vertical links
    - _Requirements: 10.10_

  - [x] 13.4 Ensure marker tooltips stay within viewport on mobile
    - Max tooltip width 250px
    - Reposition tooltips to remain fully within viewport on screens <768px
    - _Requirements: 10.8_

- [x] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document (Properties 1–14)
- Unit tests validate specific examples and edge cases
- The project uses TypeScript, Astro 5, React 19, react-leaflet, Tailwind CSS v4, fast-check, vitest, framer-motion, vaul, and shadcn/ui
- All new components follow existing patterns: `@/` path alias, `cn()` utility, semantic CSS tokens, functional components with hooks

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4", "4.2"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "4.1", "4.3"] },
    { "id": 4, "tasks": ["4.4", "4.5", "4.6", "5.1", "5.2"] },
    { "id": 5, "tasks": ["5.3", "5.4", "5.5", "5.6", "7.1", "8.1", "9.2"] },
    { "id": 6, "tasks": ["7.2", "7.3", "7.4", "8.2", "8.3", "9.1", "9.3"] },
    { "id": 7, "tasks": ["9.4", "10.1"] },
    { "id": 8, "tasks": ["10.2", "12.1", "12.2", "12.4", "12.5"] },
    { "id": 9, "tasks": ["12.3", "12.6", "13.1"] },
    { "id": 10, "tasks": ["13.2", "13.3", "13.4"] }
  ]
}
```
