# Basecamp Atlas

A unified lifestyle discovery platform for the Southeast U.S. — curated apartments and vacation retreats, organized by destination, with an opinionated editorial voice.

## Verticals

### `/live` — Apartment Finder
Interactive map-based apartment search for Charlotte, NC. Browse 37 curated apartments with filtering by rent, neighborhood, amenities, and livability scores — visualized on a Leaflet map with color-coded markers.

### `/escape` — Retreat Guide
Curated luxury nature retreats within driving distance of major Southeast cities. Geodesic domes, treehouses, mirror cabins, A-frames, and more — organized by destination region with editorial reviews, privacy ratings, and drive time context.

## Features

### Apartment Finder (`/live`)
- **Interactive Map** — Leaflet map with color-coded markers (green = high score, red = low)
- **List View** — Toggle between map and card/table view
- **Compare Mode** — Select 2+ favorites and compare side-by-side
- **Filter Sidebar** — Rent range, neighborhood, washer/dryer, minimum score sliders
- **URL-Persisted Filters** — Share filtered views via query params
- **Favorites** — localStorage-persisted shortlist
- **Score Transparency** — Weighted formula: Safety 30%, Walkability 30%, Transit 20%, Entertainment 20%
- **CSV Export** — Download filtered apartments as CSV

### Retreat Guide (`/escape`)
- **Destination Regions** — Asheville/Blue Ridge, Smokies, South Cumberland, North Georgia, Shenandoah VA, New River Gorge WV, Upstate SC
- **Browse & Filter** — Region, stay type, price range, drive time, privacy level, amenities
- **Property Detail Pages** — Full editorial reviews with two-column cinematic layout
- **Drive Time Context** — Times from 8 origin cities (Charlotte, Atlanta, Nashville, Richmond, Charleston WV, Greenville, Raleigh, Asheville)
- **Seasonal Guides** — Fall foliage, winter hot tub, summer waterfall editorial collections
- **Curation Standards** — Every property: private (≥3/5), hot tub required, sedan-accessible, wow factor

### Shared
- **Dark Cinematic Design** — Deep dark backgrounds, Playfair Display + Jost typography
- **Vertical-Specific Palettes** — Blue-slate (apartments) and amber/moss (retreats)
- **Shared Navigation** — Fixed nav connecting both sections with active state indicators
- **Cinematic Effects** — Film grain overlay, custom cursor, scroll-reveal animations (opt-in)
- **Static Deployment** — Pre-rendered HTML, optimized images, sitemap, SEO meta tags
- **Extensible Vertical System** — Add new discovery sections via config files

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5 (static output) |
| UI Components | React 19 (as Astro islands) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + CSS custom properties |
| UI Primitives | shadcn/ui (Radix UI + CVA + tailwind-merge) |
| Map | Leaflet + react-leaflet (lazy-loaded) |
| Content | Astro Content Collections (Markdown + Zod) |
| Icons | Lucide React |
| Typography | Playfair Display + Jost (self-hosted) |
| Testing | Vitest + fast-check (property-based) |
| Deployment | Vercel / Cloudflare Pages (static) |

## Project Structure

```
src/
├── content/                     # Astro content collections
│   ├── config.ts                # Zod schemas for all collections
│   ├── properties/              # Retreat property .md files
│   ├── regions/                 # Destination region .md files
│   ├── origin-cities/           # Origin city data files
│   └── seasonal-guides/         # Seasonal editorial .md files
├── verticals/                   # Vertical registry configs
│   ├── live.json                # Apartment finder config
│   └── escape.json              # Retreat guide config
├── layouts/
│   ├── BaseLayout.astro         # HTML shell, meta, fonts
│   ├── VerticalLayout.astro     # Palette injection, nav
│   └── PropertyLayout.astro     # Two-column detail layout
├── pages/
│   ├── index.astro              # Landing page (/)
│   ├── live/index.astro         # Apartment finder (/live)
│   └── escape/
│       ├── index.astro          # Retreat browse (/escape)
│       ├── [region].astro       # Region pages
│       ├── [region]/[property].astro  # Property detail
│       └── seasonal/[guide].astro     # Seasonal guides
├── components/
│   ├── ApartmentFinder.tsx      # Apartment island wrapper
│   ├── FilterSidebar.tsx        # Apartment filter controls
│   ├── MapView.tsx              # Leaflet map
│   ├── ApartmentListView.tsx    # List/table view
│   ├── CompareView.tsx          # Side-by-side comparison
│   ├── retreat/                 # Retreat-specific components
│   │   ├── RetreatBrowse.tsx    # Browse + filter island
│   │   ├── RetreatFilterSidebar.tsx
│   │   └── PropertyCard.tsx
│   ├── shared/                  # Cross-vertical components
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   └── ui/                      # 55 shadcn/ui components (unchanged)
├── data/
│   └── apartments.ts            # Static apartment array (37 entries)
├── hooks/
│   ├── use-apartment-filters.ts # Apartment filter state + URL sync
│   ├── use-retreat-filters.ts   # Retreat filter state + URL sync
│   ├── use-favorites.ts         # localStorage favorites
│   └── use-score-weights.ts     # Configurable score weights
├── lib/
│   ├── utils.ts                 # cn() utility
│   ├── verticals.ts             # Vertical registry loader
│   └── drive-time.ts            # Drive time formatting
└── styles/
    ├── global.css               # Tailwind imports + shared tokens
    ├── palettes/
    │   ├── live.css             # Blue-slate palette
    │   └── escape.css           # Amber/moss palette
    └── effects.css              # Film grain, cursor, scroll-reveal
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Run Locally

```bash
npm install
npm run dev
```

### Build

```bash
# Production build (static output to dist/)
npm run build

# Preview production build
npm run preview
```

### Type Check

```bash
npm run typecheck
```

### Test

```bash
npm run test
```

## Adding Content

### New Retreat Property

Create a Markdown file in `src/content/properties/` with frontmatter:

```yaml
---
name: "Property Name"
slug: "property-name"
region: "asheville-blue-ridge"
stayType: "geodesic dome"
priceRange:
  min: 275
  max: 330
driveTimes:
  charlotte: 150
  atlanta: 210
privacyLevel: 4
amenities: ["hot tub", "fire pit", "king bed"]
wowFactor: "A compelling 20-300 character description of what makes this special."
bookingUrl: "https://property-website.com/book"
coordinates: { lat: 35.5, lng: -82.9 }
nearbyHikes:
  - { name: "Trail Name", distance: "15 min drive" }
roadAccess: "sedan-friendly"
---

Editorial description in Markdown...
```

### New Destination Region

Create a Markdown file in `src/content/regions/` with name, slug, description (≥ 50 chars), highlights list, and coordinates.

### New Origin City

Create a data file in `src/content/origin-cities/` with name, slug, and coordinates.

## Score Weighting (Apartments)

```
overallScore = (safety × 0.3) + (walkability × 0.3) + (transit × 0.2) + (entertainment × 0.2)
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the business and technical roadmap.

## Spec

See [.kiro/specs/astro-retreat-integration/](/.kiro/specs/astro-retreat-integration/) for the full requirements, design, and implementation plan.
