# Requirements Document

## Introduction

Migrate the Charlotte Apartment Finder from a React + Vite SPA to an Astro 5 static site, and integrate the solo retreat guide as a second major section. The result is a unified lifestyle discovery platform with two verticals: `/live` (apartment finder) and `/escape` (curated vacation stays). Both sections share a dark cinematic design system, navigation, and component patterns while maintaining distinct color palettes. The site deploys as a fully static build with no backend dependencies.

## Glossary

- **Platform**: The unified Astro 5 static site containing multiple discovery verticals, branded as "Basecamp Atlas"
- **Vertical**: A self-contained discovery section of the platform with its own route prefix, color palette, content collection, and navigation entry (e.g., `/live` for apartments, `/escape` for retreats)
- **Vertical_Registry**: A central configuration that lists all active verticals, driving navigation, sitemap generation, and landing page content
- **Apartment_Finder**: The existing React-based apartment discovery tool, preserved as Astro islands under the `/live` vertical
- **Retreat_Guide**: The expanded vacation stay discovery experience under the `/escape` vertical
- **Astro_Island**: A React component rendered client-side within an otherwise static Astro page using Astro's `client:*` directives
- **Content_Collection**: Astro's typed content layer using Markdown/MDX files with validated frontmatter schemas
- **Destination_Region**: A geographic area where stays are located (e.g., Asheville/Blue Ridge, Smokies, South Cumberland)
- **Origin_City**: A city from which drive times to destination regions are calculated (e.g., Charlotte, Atlanta, Nashville)
- **Stay_Type**: A category of vacation accommodation (e.g., dome, treehouse, mirror cabin, A-frame, yurt, container home, cliff house, lakefront retreat)
- **Property_Card**: A UI component displaying a single curated stay with metadata, editorial description, and booking link
- **Filter_Sidebar**: A collapsible panel with controls for narrowing displayed results by various criteria
- **Design_System**: The shared set of typography, color tokens, spacing, and component patterns used across both sections
- **Seasonal_Guide**: An editorial content page focused on a specific season and activity theme (e.g., fall foliage, winter hot tub)
- **Privacy_Level**: A 1–5 dot rating indicating how secluded a property is from other guests or neighbors
- **Drive_Time_Context**: The estimated driving duration from a specific origin city to a property or destination region

## Requirements

### Requirement 1: Astro 5 Migration

**User Story:** As a developer, I want to migrate the project from React + Vite to Astro 5, so that I gain static site generation, content collections, and file-based routing while preserving existing React components.

#### Acceptance Criteria

1. THE Platform SHALL use Astro 5 as the build framework with the `@astrojs/react` integration for rendering existing React components as islands
2. WHEN the Platform is built, THE Platform SHALL produce a fully static output directory containing only pre-rendered HTML, CSS, and JavaScript files with no SSR adapter installed and no Node.js server required to serve the output
3. THE Platform SHALL preserve the existing `@/` path alias resolving to the `src/` directory for imports within both `.astro` files and React island components
4. THE Platform SHALL use Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no `tailwind.config.js` file)
5. THE Platform SHALL preserve all existing shadcn/ui component files in `src/components/ui/` as functionally equivalent React components that render identical visual output without changes to their public API (props, exports, and class-name conventions)
6. WHEN a React component requires client-side interactivity such as event handlers, state, or browser APIs, THE Platform SHALL render it as an Astro island using the `client:load` directive for above-the-fold interactive components and `client:visible` for below-the-fold interactive components

### Requirement 2: Apartment Finder Preservation

**User Story:** As a user, I want the apartment finder to work exactly as it does today under the `/live` route, so that I don't lose any existing functionality during the migration.

#### Acceptance Criteria

1. THE Apartment_Finder SHALL be accessible at the `/live` route and SHALL render the interactive Leaflet map, list view, compare mode, and filter sidebar as React Astro_Islands using the `client:load` directive
2. THE Apartment_Finder SHALL retain favorites persistence via localStorage using the existing storage key, and SHALL retain score weight persistence via localStorage using the existing storage key, so that returning users do not lose previously saved data after migration
3. THE Apartment_Finder SHALL retain CSV export functionality that exports the currently filtered apartment list
4. WHEN filter state changes, THE Apartment_Finder SHALL sync all active filter parameters to URL query parameters under the `/live` path using the same parameter names as the current implementation (rentMin, rentMax, neighborhoods, washerDryer, minSafety, minWalkability, minTransit, minEntertainment, sort)
5. THE Apartment_Finder SHALL retain the custom scoring system with configurable weights (safety, walkability, transit, entertainment) where each weight is adjustable and the weighted score is recalculated in real time
6. THE Apartment_Finder SHALL continue to use the existing blue-slate CSS custom properties defined in the design system for its section
7. THE Apartment_Finder SHALL link every apartment to the property's own website (never aggregator sites such as Zillow, apartments.com, or Google search results)
8. WHEN a user navigates to `/live` with query parameters in the URL, THE Apartment_Finder SHALL restore filter state from those parameters on initial load

### Requirement 3: Retreat Guide Content System

**User Story:** As a content curator, I want retreat properties stored as typed Markdown files with validated frontmatter, so that I can add new properties without touching application code.

#### Acceptance Criteria

1. THE Retreat_Guide SHALL store each property as a Markdown file within an Astro content collection
2. THE Content_Collection SHALL validate frontmatter against a typed schema with the following required fields: name (max 100 characters), slug (lowercase alphanumeric with hyphens, max 60 characters), destination region, stay type, price range (minimum and maximum nightly rate in whole USD, each between 1 and 9999), drive times (an object mapping each origin city identifier to an integer number of minutes), privacy level (integer 1–5), amenities (list of at least 1 string entry), wow factor description (20–300 characters), booking URL (valid URL format), and coordinates (decimal latitude and longitude pair); and the following optional fields: seasonal tags (list of strings, max 10), and road access notes (free-text, max 500 characters)
3. IF a property Markdown file has invalid or missing required frontmatter fields, THEN THE Platform SHALL produce a build-time error identifying the invalid file and field
4. WHEN a new property is added as a Markdown file with valid frontmatter, THE Retreat_Guide SHALL display it on the browse page and its destination region page without any code changes
5. THE Content_Collection SHALL support editorial body content in Markdown including headings, lists, blockquotes, and inline images for the property description
6. THE Content_Collection SHALL include a required field for nearby hikes and activities as a list of objects within frontmatter, where each object contains a name (string, max 100 characters) and an optional distance (string, max 30 characters such as "0.5 miles" or "15 min drive"), with at least 1 and at most 20 entries

### Requirement 4: Destination-First Information Architecture

**User Story:** As a user, I want to browse stays organized by destination region, so that I can explore what's available in a specific area I want to visit.

#### Acceptance Criteria

1. THE Retreat_Guide SHALL organize properties by Destination_Region, with each region rendered as a dedicated page at `/escape/[region-slug]` serving as the primary browsing entry point for that region's properties
2. THE Platform SHALL support the following launch regions: Asheville/Blue Ridge, Smokies, South Cumberland/Sewanee, North Georgia, Shenandoah VA, New River Gorge WV, and Upstate SC
3. WHEN a user visits a destination region page, THE Retreat_Guide SHALL display all curated properties within that region and a region introduction section containing at minimum a description of the area (at least 50 characters) and a list of highlighted activities or attractions
4. THE Retreat_Guide SHALL display drive times from all supported Origin_Cities on each Property_Card, formatted as hours and minutes (e.g., "2h 30m")
5. THE Platform SHALL support the following launch origin cities: Charlotte, Atlanta, Nashville, Richmond, Charleston WV, Greenville, Raleigh, and Asheville
6. WHEN a new origin city needs to be added, THE Platform SHALL require only a new content file with city name and coordinates (no code changes)
7. WHEN a new destination region needs to be added, THE Platform SHALL require only a new content file with region name, slug, description (at least 50 characters), highlighted activities, and at least one associated property (no code changes)
8. IF a destination region has zero published properties, THEN THE Retreat_Guide SHALL hide that region from navigation and the browse page until at least one valid property is added

### Requirement 5: Browse and Filter Experience

**User Story:** As a user, I want to filter and browse all retreat properties by stay type, region, price, drive time, and amenities, so that I can find stays matching my preferences.

#### Acceptance Criteria

1. THE Retreat_Guide SHALL provide a browse page at `/escape` displaying all properties with client-side filtering, showing all properties unfiltered by default
2. THE Filter_Sidebar SHALL support filtering by: destination region (multi-select), stay type (multi-select), price range (per-night slider from $50 to $1,500 in $25 increments), maximum drive time from a selected origin city (slider from 1 hour to 6 hours in 30-minute increments), privacy level (minimum 1–5), and amenities (hot tub, fire pit, sauna, kitchen as checkboxes)
3. WHEN filters are applied, THE Retreat_Guide SHALL update the displayed properties without a page reload
4. WHEN filters are applied, THE Retreat_Guide SHALL sync only non-default filter values to URL query parameters using `history.replaceState`, omitting parameters that match default state
5. THE Retreat_Guide SHALL support browsing by Stay_Type as a filter preset accessible via defined routes (e.g., `/escape?stayType=treehouse`) that pre-applies the stay type filter on the browse page
6. WHEN filters are active, THE Retreat_Guide SHALL display a count of matching properties in the format "{count} properties" in the filter sidebar footer
7. IF no properties match the active filters, THEN THE Retreat_Guide SHALL display an empty state message indicating no results were found and a button to reset all filters
8. WHEN the user activates the reset control, THE Retreat_Guide SHALL clear all filters to their default values, remove all filter-related query parameters from the URL, and display all properties

### Requirement 6: Shared Design System

**User Story:** As a user, I want both sections to feel like one cohesive site with consistent typography and component patterns, so that navigation between them feels seamless.

#### Acceptance Criteria

1. THE Design_System SHALL define shared typography using Playfair Display (weights 400, 700, 900, and italic variants) for all heading elements (h1–h6) and Jost (weights 200, 300, 400) for body text across both sections
2. THE Design_System SHALL maintain the Apartment_Finder's blue-slate palette (existing CSS custom properties) for the `/live` section
3. THE Design_System SHALL maintain the Retreat_Guide's warm amber/moss/rust palette for the `/escape` section
4. THE Design_System SHALL provide shared component patterns for cards, filter sidebar, scoring/rating indicators, and map views, where each shared component accepts the active vertical's color palette via CSS custom properties and renders with identical layout structure across both sections
5. WHILE the active route is within a vertical's route prefix, THE Platform SHALL apply that vertical's color palette by setting the corresponding CSS custom properties on the nearest layout ancestor element
6. THE Design_System SHALL use a background lightness value no greater than 11% (HSL) across both sections to preserve the cinematic dark aesthetic
7. THE Design_System SHALL include the film grain overlay, custom cursor, and scroll-reveal animations from the retreat guide as CSS utility classes that are inactive by default and activated by adding the corresponding class to a page or component element

### Requirement 7: Expanded Stay Types

**User Story:** As a user, I want to discover diverse vacation accommodation types beyond luxury nature retreats, so that I can find unique stays matching different trip moods.

#### Acceptance Criteria

1. THE Retreat_Guide SHALL support the following stay types: geodesic domes, treehouses, mirror cabins, A-frames, yurts, container homes, cliff houses, and lakefront retreats
2. THE Retreat_Guide SHALL allow additional stay types to be added by including them in a property's frontmatter without code changes, where each stay type value is between 1 and 50 characters
3. WHEN a user browses by stay type, THE Retreat_Guide SHALL display all properties of that type across all destination regions using case-insensitive matching on the stay type value
4. IF a user browses by a stay type that has no matching properties, THEN THE Retreat_Guide SHALL display an empty state message indicating no properties are available for that type
5. THE Retreat_Guide SHALL assign exactly one stay type per property in the content collection frontmatter
6. THE Retreat_Guide SHALL not restrict properties to luxury nature stays — any vacation accommodation meeting the curation standards defined in Requirement 8 is eligible

### Requirement 8: Curation Standards Enforcement

**User Story:** As a content curator, I want clear curation standards enforced through the content schema, so that every listed property meets the editorial quality bar.

#### Acceptance Criteria

1. THE Content_Collection schema SHALL require a privacy level of at least 3 out of 5 for any listed property
2. THE Content_Collection schema SHALL require a hot tub or soaking tub listed in amenities for any listed property
3. THE Content_Collection schema SHALL require a road access field with one of the following values: "sedan-friendly" (paved or well-maintained gravel, no steep grades), "high-clearance recommended" (rough gravel or steep sections), or "AWD required" (unmaintained roads or extreme grades) — and SHALL reject any property whose road access value is not "sedan-friendly"
4. THE Content_Collection schema SHALL require a wow factor description between 20 and 300 characters in length
5. THE Content_Collection schema SHALL require a direct booking URL that points to the property's own domain or a platform-specific listing page for that property (e.g., an individual Airbnb or VRBO listing) — and SHALL reject URLs pointing to search results pages, aggregator homepages, or generic directory listings
6. IF a property does not meet curation standards, THEN THE Platform SHALL reject it at build time with a validation error that identifies the failing file name, the failing field, and the reason for rejection

### Requirement 9: Seasonal Guides

**User Story:** As a user, I want seasonal editorial guides that recommend the best stays for specific times of year, so that I can plan trips around seasonal experiences.

#### Acceptance Criteria

1. THE Retreat_Guide SHALL support Seasonal_Guide pages as a content collection with typed frontmatter including: season (one of spring, summer, fall, winter), theme title, a list of 3 to 10 featured property slugs, and an editorial Markdown body
2. WHEN a seasonal guide references properties by slug, THE Platform SHALL resolve and display those property cards inline within the guide content
3. IF a seasonal guide references a property slug that does not match any existing property in the collection, THEN THE Platform SHALL produce a build-time error identifying the guide file and the unresolved slug
4. THE Retreat_Guide SHALL support at minimum three seasonal themes at launch: fall foliage, winter hot tub retreats, and summer waterfall access
5. WHEN a new seasonal guide is added as a Markdown file with valid frontmatter, THE Retreat_Guide SHALL display it at `/escape/seasonal/[guide-slug]` without code changes
6. IF a seasonal guide Markdown file has invalid or missing required frontmatter fields, THEN THE Platform SHALL produce a build-time error identifying the invalid file and field

### Requirement 10: Shared Navigation

**User Story:** As a user, I want a persistent navigation bar connecting both sections of the site, so that I can move between apartment finding and retreat discovery seamlessly.

#### Acceptance Criteria

1. THE Platform SHALL display a fixed-position navigation bar on all pages with links to `/live` (apartment finder) and `/escape` (retreat guide), with link labels and routes derived from the Vertical_Registry
2. THE Platform SHALL visually indicate the currently active section in the navigation by applying the active vertical's color palette to the corresponding navigation link, determined by matching the current URL path prefix to a vertical's route prefix
3. THE Platform SHALL include a home/landing page at `/` that introduces both sections and links to each
4. WHEN the viewport width is 768px or below, THE Platform SHALL collapse the navigation into a mobile menu activated by a toggle button with `aria-expanded` state, where the menu is keyboard-navigable via Tab and Escape keys, traps focus within the menu while open, and returns focus to the toggle button on close
5. WHEN a user navigates to a new page, THE Platform SHALL render the navigation bar within 1 frame of page load (no layout shift) and maintain scroll position of the page content beneath it

### Requirement 11: Static Deployment

**User Story:** As a developer, I want the site to deploy as a static build to Vercel or Cloudflare Pages, so that hosting is simple, fast, and free-tier compatible.

#### Acceptance Criteria

1. WHEN the Platform is built, THE Platform SHALL produce a static output directory containing only pre-rendered HTML, CSS, JavaScript, and asset files with no server-side runtime dependencies
2. THE Platform SHALL generate a pre-rendered HTML file for every content route (property pages, region pages, seasonal guides, apartment finder, and landing page) such that each HTML file contains the page's rendered content without requiring client-side JavaScript to display it
3. THE Platform SHALL generate a valid sitemap.xml at the site root that includes URLs for all property pages, region pages, seasonal guides, the apartment finder, and the landing page
4. THE Platform SHALL include on every page at minimum the following meta tags: title, meta description, og:title, og:description, og:type, and og:url, populated with page-specific content
5. IF a content page references an image, THEN THE Platform SHALL optimize that image at build time using Astro's image optimization and output it in a modern format (WebP or AVIF) with appropriate width and quality settings
6. WHEN the Platform is built, THE Platform SHALL complete the static build in under 120 seconds for up to 200 content pages

### Requirement 12: Project Rebrand

**User Story:** As a developer, I want the project rebranded from "charlotte-apartments" to "basecamp-atlas", so that the name reflects the expanded scope of the unified platform.

#### Acceptance Criteria

1. THE Platform SHALL use "basecamp-atlas" as the project name in the package.json `name` field, the manifest.json `name` and `short_name` fields, and the README title
2. THE Platform SHALL use "Basecamp Atlas" as the display brand name in the HTML document title, navigation elements, and the landing page heading
3. THE Platform SHALL use "Basecamp Atlas" as the brand name in the HTML `<title>` tag, Open Graph `og:title` meta tag, and the manifest.json `name` field
4. THE Platform SHALL not reference "charlotte-apartments" or "Charlotte Apartment Finder" in any user-facing content, metadata files, or generated artifacts such as exported file names

### Requirement 13: Property Detail Pages

**User Story:** As a user, I want a dedicated detail page for each retreat property with full editorial content, so that I can read the complete review before deciding to book.

#### Acceptance Criteria

1. THE Retreat_Guide SHALL generate a static detail page for each property at `/escape/[region-slug]/[property-slug]`
2. THE Property detail page SHALL display: property name, stay type badge, destination region, editorial description (Markdown body), amenity pills, privacy level dots (1–5 scale), price range, drive times from all origin cities sorted by shortest drive time first, nearby hikes/activities list, road access notes, wow factor callout, and booking CTA link that opens in a new tab
3. THE Property detail page SHALL use a two-column layout with main editorial content on the left and a metadata sidebar (price block, privacy level, road access, drive times, and booking CTA) on the right, collapsing to a single stacked column at viewport widths below 900px
4. THE Property detail page SHALL include scroll-reveal fade-up animations on content sections, the film grain overlay, and the custom cursor consistent with the Retreat_Guide browse pages
5. IF a property's frontmatter contains an empty or absent optional field (seasonal tags, coordinates, or nearby hikes list), THEN THE Property detail page SHALL omit that section from the rendered layout without displaying empty containers or placeholder text
6. THE Property detail page SHALL display a breadcrumb navigation showing the path: Escape → [Region Name] → [Property Name], with each ancestor segment linked to its corresponding page

### Requirement 14: Extensible Vertical System

**User Story:** As a developer, I want the platform built as an extensible system of verticals, so that I can add new discovery sections (e.g., restaurants, coworking, transit) without restructuring the codebase.

#### Acceptance Criteria

1. THE Platform SHALL define each section (e.g., `/live`, `/escape`) as a "vertical" with its own configuration containing: route prefix, color palette (as CSS custom property overrides), content collection schema, and navigation label (maximum 20 characters)
2. WHEN a new vertical is added, THE Platform SHALL require only a configuration file (specifying route prefix, color palette, and navigation label), a content collection schema, and page templates — with no modifications to shared infrastructure code (navigation, layout, sitemap generation, or landing page)
3. THE Platform SHALL support vertical-specific color palettes that override shared design tokens by applying CSS custom properties scoped to the active route prefix
4. THE Platform SHALL support vertical-specific content collection schemas independent of other verticals, with no required shared frontmatter fields between verticals
5. WHEN a vertical configuration file is present at build time, THE Platform SHALL register that vertical in the shared navigation and include it in sitemap generation without manual registration steps
6. THE Platform SHALL support shared components (cards, filter sidebar, map, scoring indicators) that accept vertical-specific theming via props or CSS custom properties
7. THE Platform SHALL maintain a central registry of verticals (the Vertical_Registry) that drives navigation ordering, sitemap generation, and landing page preview cards
8. IF a vertical configuration file is present but contains invalid or missing required fields (route prefix, color palette, or navigation label), THEN THE Platform SHALL produce a build-time error identifying the invalid file and the missing or malformed field
9. IF two vertical configuration files specify the same route prefix, THEN THE Platform SHALL produce a build-time error identifying the conflicting verticals and the duplicated route prefix

### Requirement 15: Landing Page and SEO Onboarding

**User Story:** As a user arriving from search, I want a landing page that clearly communicates what Basecamp Atlas offers and guides me to the right section, so that I understand the value and stay on the site.

#### Acceptance Criteria

1. THE Platform SHALL display a landing page at `/` with the "Basecamp Atlas" brand identity
2. THE Landing page SHALL display an entry point for each registered vertical from the Vertical_Registry, including the vertical's name, a one-sentence description, its color palette accent, and a link to its route prefix
3. THE Landing page SHALL use the cinematic dark aesthetic with the shared typography system
4. THE Landing page SHALL be a static Astro page (no React islands required)
5. THE Landing page SHALL include structured data (JSON-LD) using the schema.org `WebSite` type with `name`, `url`, `description`, and `potentialAction` (SearchAction) fields describing the site as a local business discovery platform
6. THE Landing page SHALL include a value proposition headline (maximum 80 characters) and a subtext paragraph (maximum 200 characters) that names the platform's verticals and geographic focus
7. THE Landing page SHALL feature at least 3 preview cards from each registered vertical, populated from that vertical's content collection, each linking to its detail page
8. THE Landing page SHALL include internal links to all destination region pages and all neighborhood guide pages for SEO crawlability
9. THE Platform SHALL generate a `<link rel="canonical">` element with the page's absolute URL on every page to prevent duplicate content issues
