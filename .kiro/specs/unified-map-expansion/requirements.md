# Requirements Document

## Introduction

The Unified Map Expansion feature extracts and generalizes the existing `/live` map component into a shared, configurable map system that both the `/live` and `/escape` verticals can use. It also future-proofs the project by introducing multi-city support for `/live`, international destination support for `/escape`, and expanded vacation categories beyond retreat properties.

## Glossary

- **Unified_Map**: A shared React map component built on react-leaflet that renders geographic markers for any vertical, configured via props for center coordinates, zoom level, tile style, marker rendering, and clustering behavior.
- **Map_Adapter**: A vertical-specific wrapper that transforms vertical data (apartments or properties) into the generic marker format consumed by the Unified_Map.
- **Marker_Descriptor**: A data structure containing coordinates, display label, category, visual style, and metadata payload that the Unified_Map uses to render a single map pin.
- **City_Config**: A data structure defining a city's name, slug, center coordinates, default zoom level, and associated data source for the `/live` vertical.
- **Destination_Config**: A data structure defining a country or region's name, slug, center coordinates, default zoom level, and geographic scope (US or international) for the `/escape` vertical.
- **Vacation_Category**: A classification for `/escape` properties (e.g., retreat, cruise, resort, villa, glamping, adventure, wellness) that determines filtering, iconography, and card presentation.
- **Vertical_Registry**: The existing JSON config system in `src/verticals/` that drives navigation, routing, and palette switching.
- **Content_Collection**: Astro's file-based data system using Markdown/JSON files with Zod-validated frontmatter schemas.

## Requirements

### Requirement 1: Unified Map Component Extraction

**User Story:** As a developer, I want a single reusable map component that both verticals can consume, so that map logic is not duplicated and visual consistency is maintained.

#### Acceptance Criteria

1. THE Unified_Map SHALL render a react-leaflet MapContainer configured via props for center coordinates (latitude between -90 and 90, longitude between -180 and 180), zoom level (integer between 1 and 18), and tile layer URL.
2. THE Unified_Map SHALL accept an array of Marker_Descriptor objects — each containing at minimum a unique string identifier, a latitude/longitude position, and an arbitrary metadata record — and render each as a positioned marker on the map.
3. IF the number of Marker_Descriptor objects exceeds the clustering threshold prop (default: 10), THEN THE Unified_Map SHALL group proximate markers into clusters via react-leaflet-cluster.
4. THE Unified_Map SHALL accept an optional custom marker renderer function prop that receives a Marker_Descriptor and returns a Leaflet icon instance controlling the visual appearance of that marker.
5. IF no custom marker renderer function prop is provided, THEN THE Unified_Map SHALL render markers using the Leaflet default icon.
6. WHEN a user clicks a marker, THE Unified_Map SHALL invoke the selection callback prop with the full Marker_Descriptor object associated with that marker.
7. WHEN no markers are provided (empty array or undefined), THE Unified_Map SHALL render the base map tiles without markers and display no error state.
8. THE Unified_Map SHALL support optional overlay layers (polygons, polylines) passed as children via React composition.

### Requirement 2: Live Vertical Map Adapter

**User Story:** As a developer, I want the `/live` vertical to consume the Unified_Map through an adapter, so that apartment-specific rendering (score-colored pins, favorites, light rail) is preserved without coupling to the shared component.

#### Acceptance Criteria

1. THE Map_Adapter for the live vertical SHALL transform each Apartment object into a Marker_Descriptor containing latitude, longitude, display label set to the apartment name, category set to "apartment", and a metadata payload containing the overallScore, neighborhood, and the source Apartment object.
2. THE Map_Adapter for the live vertical SHALL apply score-based color coding to marker icons using the apartment's overallScore and the existing color scale (green for scores ≥ 8, lime for scores ≥ 7, yellow for scores ≥ 6, orange for scores ≥ 5, red for scores < 5).
3. THE Map_Adapter for the live vertical SHALL render a heart indicator on markers whose apartment name is present in the current favorites list.
4. THE Map_Adapter for the live vertical SHALL pass light rail station markers and neighborhood polygon overlays to the Unified_Map as non-clustered overlay layers rendered outside the marker cluster group.
5. WHEN the user selects an apartment marker, THE Map_Adapter SHALL invoke the existing apartment detail card flow with the Apartment object from the selected Marker_Descriptor's metadata payload.
6. IF an Apartment object has missing or invalid coordinates (latitude outside -90 to 90 or longitude outside -180 to 180), THEN THE Map_Adapter SHALL exclude that apartment from the Marker_Descriptor array without rendering an error to the user.

### Requirement 3: Escape Vertical Map Integration

**User Story:** As a user browsing vacation properties, I want to see retreat locations on a map, so that I can understand geographic relationships and discover properties by location.

#### Acceptance Criteria

1. THE Map_Adapter for the escape vertical SHALL transform each property from the Content_Collection into a Marker_Descriptor containing coordinates, name, region, stay type, and price range.
2. THE Map_Adapter for the escape vertical SHALL assign each Vacation_Category a unique marker icon shape or color that is distinct from all other categories, so that no two categories share the same icon appearance.
3. WHEN the user selects a property marker on the escape map, THE Map_Adapter SHALL display a property summary card showing name, region, price range (formatted as "$min–$max/night"), wow factor (truncated to 120 characters with ellipsis if longer), and a link to the property detail page at `/escape/[region]/[slug]`.
4. WHEN the user selects a different property marker while a summary card is displayed, THE Map_Adapter SHALL replace the current summary card with the newly selected property's summary card.
5. WHEN the user clicks outside the summary card or clicks a close control on the card, THE Map_Adapter SHALL dismiss the summary card.
6. THE escape map page SHALL integrate with the existing RetreatFilterSidebar, passing the same filter state (regions, stay types, price range, max drive time, selected origin, min privacy, amenities) so that filter changes update the visible markers on the map.
7. WHEN filters are active, THE escape map SHALL display only markers for properties matching the current filter criteria.
8. IF the active filters match zero properties, THEN THE escape map SHALL display no markers and show a visible indication that no properties match the current filters.

### Requirement 4: Multi-City Support for Live Vertical

**User Story:** As a user, I want to browse apartments in different cities, so that I can use the finder tool when considering relocation to cities other than Charlotte.

#### Acceptance Criteria

1. THE live vertical SHALL support multiple City_Config entries, each defining a city name, slug (lowercase alphanumeric with hyphens, matching the pattern `^[a-z0-9-]+$`), center coordinates (lat/lng), default zoom level (integer between 10 and 15), and data source reference.
2. WHEN the user navigates to `/live/[city-slug]` and the slug matches a defined City_Config entry, THE live vertical SHALL load apartment data for the specified city and center the Unified_Map on that city's coordinates at the configured default zoom level.
3. IF the user navigates to `/live/[city-slug]` with a slug that does not match any defined City_Config entry, THEN THE live vertical SHALL display a not-found page indicating the city is unavailable and provide navigation back to the city selector.
4. THE live vertical SHALL provide a city selector UI element that lists all available cities in alphabetical order by city name and navigates to the selected city's map page when a city is selected.
5. WHEN no city slug is provided in the URL (i.e., the user navigates to `/live`), THE live vertical SHALL default to the Charlotte city configuration.
6. THE City_Config SHALL be defined as a content collection data file so that adding a new city requires no code changes beyond adding a config file and corresponding apartment data.

### Requirement 5: International Destination Support for Escape Vertical

**User Story:** As a user, I want to browse vacation properties in international destinations as well as US locations, so that I can plan trips abroad.

#### Acceptance Criteria

1. THE Destination_Config SHALL include a geographic scope field with values "us" or "international" to classify each destination.
2. THE escape vertical SHALL support Destination_Config entries for both US regions and international countries or regions.
3. WHEN the user navigates to `/escape/destinations/[destination-slug]`, THE escape vertical SHALL display all properties associated with that destination on the Unified_Map centered at the destination's configured coordinates and default zoom level.
4. IF a destination has zero associated properties, THEN THE escape vertical SHALL display the destination map at its configured coordinates with a message indicating no properties are currently available.
5. THE escape vertical SHALL provide a destination browser UI that groups destinations by geographic scope (US and International), with destinations listed alphabetically by name within each group.
6. WHEN an international destination is selected, THE Unified_Map SHALL use the destination's configured default zoom level (between 3 and 12) and a terrain or standard tile layer to display the destination's geographic area.
7. THE Destination_Config SHALL be defined as a content collection so that adding a new destination requires only a new data file containing name, slug, description (minimum 50 characters), geographic scope, center coordinates, and default zoom level, along with associated property entries.
8. WHEN the user navigates to a destination-slug that does not match any Destination_Config entry, THE escape vertical SHALL display a 404 page.

### Requirement 6: Expanded Vacation Categories

**User Story:** As a user, I want to browse different types of vacation experiences (cruises, resorts, villas, glamping) beyond retreat cabins, so that I can find the right type of getaway.

#### Acceptance Criteria

1. THE Content_Collection schema for properties SHALL support a Vacation_Category field as a validated enum with at minimum the values: retreat, cruise, resort, villa, glamping, adventure, and wellness, and a maximum of 20 total category values.
2. THE escape vertical filter sidebar SHALL include a category filter that allows users to select one or more Vacation_Category values using checkbox controls with a minimum tap target of 44x44 CSS pixels.
3. WHEN a category filter is applied, THE escape vertical SHALL display only properties matching the selected categories in both the grid view and the map view.
4. WHEN no category filter values are selected, THE escape vertical SHALL display properties of all categories (unfiltered default).
5. THE Vacation_Category SHALL determine the marker icon style on the Unified_Map such that each category uses a unique icon shape or symbol that is distinguishable from all other category icons at the map's default zoom level.
6. THE property card component SHALL display the Vacation_Category as a visible badge or label positioned in the card header area.
7. WHEN a new Vacation_Category value is added to the schema enum, THE escape vertical SHALL display properties of that category without requiring component code changes beyond adding the value to the schema enum and providing a corresponding icon mapping entry.

### Requirement 7: Shared Map Configuration and Theming

**User Story:** As a developer, I want the map to respect each vertical's design palette, so that the map feels visually integrated regardless of which vertical it appears in.

#### Acceptance Criteria

1. THE Unified_Map SHALL accept a theme configuration prop containing: a tile layer URL template, a cluster icon background color token, a cluster icon border color token, and a cluster icon text color token sourced from the active vertical's CSS custom properties.
2. WHILE the map is rendered within the live vertical, THE Unified_Map SHALL apply the `--palette-accent-primary` token as the cluster icon background color and `--palette-surface-base` token for UI overlay backgrounds (zoom control container and marker tooltip background).
3. WHILE the map is rendered within the escape vertical, THE Unified_Map SHALL apply the `--palette-accent-primary` token as the cluster icon background color and `--palette-surface-base` token for UI overlay backgrounds (zoom control container and marker tooltip background).
4. THE Unified_Map SHALL render a zoom control positioned at bottom-right of the map container, consistent with the existing MapView behavior.
5. THE Unified_Map SHALL use the Google satellite hybrid tile layer (`lyrs=y`) as the default for the live vertical and the OpenStreetMap standard tile layer as the default for the escape vertical.
6. IF the theme configuration prop is not provided, THEN THE Unified_Map SHALL fall back to the root-level CSS custom property values defined in `:root` for cluster icon and overlay styling.

### Requirement 8: Premium Homepage Experience

**User Story:** As a visitor landing on the site for the first time, I want the homepage to feel polished and premium, so that I trust the platform and want to explore further.

#### Acceptance Criteria

1. THE homepage SHALL display a hero section with a minimum height of 100vh, a dark gradient or ambient background with a maximum background lightness of 11% HSL, consistent with the brand's cinematic dark aesthetic defined in the project's design tokens.
2. THE homepage hero SHALL include a tagline of no more than 60 characters, a value proposition of no more than 200 characters, and two call-to-action buttons linking to the `/live` and `/escape` verticals, each rendered with a minimum tap target of 44×44 pixels.
3. THE homepage SHALL display vertical entry cards for Live and Escape experiences, each with a distinct accent color matching its vertical palette, an icon distinguishing the vertical, and a scale or glow transition on hover completing within 200ms.
4. THE homepage SHALL include a featured properties section displaying between 3 and 6 preview cards, each showing a property image placeholder, pricing range, location label, and a score or wow-factor highlight.
5. WHILE the viewport width is below 768px, THE homepage featured section SHALL use a horizontal scroll or carousel pattern. WHILE the viewport width is 768px or above, THE homepage featured section SHALL use a grid layout of 2–3 columns.
6. THE homepage SHALL include a social-proof section displaying at least 3 numeric metrics (such as number of cities, number of properties, and number of destinations) with an animated count-up that triggers when the section enters the viewport and completes within 2 seconds.
7. THE homepage SHALL include a destination highlights section showing a geographic visualization or region list that communicates multi-city and multi-destination coverage, displaying all regions available in the content collection.
8. WHEN a homepage section enters the viewport, THE homepage SHALL apply a scroll-reveal animation (fade-in or slide-up) using framer-motion with a duration between 300ms and 600ms and a stagger delay of no more than 150ms between sibling elements.
9. THE homepage SHALL maintain a loading performance budget where the Largest Contentful Paint occurs within 2.5 seconds on a simulated 4G connection (1.6 Mbps download, 150ms RTT) as measured by Lighthouse.
10. THE homepage footer SHALL include navigation links to both verticals (`/live` and `/escape`), links to at least 3 destination regions, and an about section of no more than 300 characters.
11. IF the featured properties content collection returns zero results, THEN THE homepage SHALL hide the featured properties section entirely rather than displaying an empty container.

### Requirement 9: Responsive Map Behavior

**User Story:** As a mobile user, I want the map to be usable on small screens, so that I can browse locations on my phone.

#### Acceptance Criteria

1. WHILE the viewport width is below the mobile breakpoint (768px), THE Unified_Map SHALL occupy the full available width (100% of its parent container) and a minimum height of 50vh.
2. WHILE the viewport width is below the mobile breakpoint (768px), WHEN a marker is selected, THE Unified_Map SHALL display the marker detail content in a bottom sheet (via vaul Drawer) with a maximum height of 85dvh, rather than a desktop overlay card.
3. WHILE the viewport width is below the mobile breakpoint (768px), THE Unified_Map SHALL enable touch gestures for single-finger pan and two-finger pinch-to-zoom, and SHALL disable map zoom on double-tap to prevent conflict with the browser's native double-tap-to-zoom behavior.
4. WHILE on mobile within the escape vertical, THE filter sidebar SHALL be accessible via a slide-out drawer (max width 85vw, capped at 24rem) triggered by a filter button, matching the live vertical's existing left-edge slide-out drawer pattern.
5. WHILE on mobile, THE city selector UI in the live vertical SHALL render as a full-width dropdown or bottom sheet rather than a sidebar element.
6. WHILE on mobile, THE destination browser UI in the escape vertical SHALL render as a scrollable vertical list or bottom sheet rather than a multi-column grid.
7. WHILE the viewport width is below the mobile breakpoint (768px), THE Unified_Map SHALL capture touch events within its container to prevent page scroll while the user is panning or zooming the map.

### Requirement 10: Mobile-Responsive Audit for All New UI Surfaces

**User Story:** As a user on any device, I want every new screen and component introduced by this feature to be fully usable on mobile, tablet, and desktop, so that no functionality is lost on smaller viewports.

#### Acceptance Criteria

1. THE city selector page SHALL use a responsive layout that stacks city cards in a single column on mobile (below 768px) and displays them in a grid of at least 2 columns on tablet (768px–1023px) and at least 3 columns on desktop (≥1024px).
2. THE destination browser page SHALL use a responsive layout that stacks destination groups in a single column on mobile (below 768px) and displays them in at least 2 columns on desktop (≥1024px).
3. THE vacation category filter controls SHALL be touch-friendly with a minimum tap target size of 44x44 CSS pixels on viewports below 1024px.
4. THE property summary card displayed on marker selection SHALL be readable without horizontal scrolling on viewports as narrow as 320px, with a maximum width of 100vw minus 16px horizontal padding on each side.
5. WHILE on mobile (below 768px), THE map view toggle (map/list/grid) SHALL remain accessible in a fixed or sticky toolbar positioned at the bottom of the viewport so the user can switch views without scrolling.
6. THE escape map page layout SHALL use a responsive split-pane pattern: side-by-side filter panel and map on desktop (≥1024px), and stacked layout with a collapsible filter drawer on mobile and tablet (below 1024px), where the drawer is triggered by a visible filter button and defaults to collapsed.
7. WHILE on tablet (768px–1023px), THE Unified_Map SHALL occupy at least 60% of the viewport width when displayed alongside a filter panel.
8. THE Unified_Map marker tooltips SHALL have a maximum width of 250px and SHALL be repositioned to remain fully within the viewport boundaries on viewports below 768px, with no content clipped or extending beyond the screen edge.
9. WHILE on mobile (below 768px), THE map cluster icons SHALL use a minimum size of 36px diameter to ensure they meet the 36px minimum tap target.
10. THE navigation elements introduced by multi-city and multi-destination support SHALL appear as navigation links within the existing MobileMenu component, accessible via the hamburger menu on viewports below 768px, and listed alongside the existing vertical links.
