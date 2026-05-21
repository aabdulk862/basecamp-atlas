# Charlotte Apartment Finder

An interactive map-based apartment search tool for Charlotte, NC. Browse 50 curated apartments with filtering by rent, neighborhood, amenities, and livability scores — all visualized on a Leaflet map with color-coded markers.

## Features

- **Interactive Map** — Leaflet map centered on Charlotte with color-coded markers (green = high score, red = low). Favorited apartments get a red border ring.
- **List View** — Toggle between map and a card/table view. Mobile shows a scrollable card layout; desktop shows a full table with color-coded scores.
- **Compare Mode** — Select 2+ favorites and compare them side-by-side across all scoring dimensions.
- **Filter Sidebar** — Rent range slider, neighborhood checkboxes, washer/dryer select, and minimum score sliders (safety, walkability, transit, entertainment).
- **URL-Persisted Filters** — Filter state is synced to query params so you can share a filtered view (e.g., `?neighborhoods=NoDa,Elizabeth&minSafety=7`).
- **Favorites** — Heart any apartment to save it. Favorites persist in localStorage. Toggle "favorites only" mode to compare your shortlist.
- **Detail Card** — Click any marker or list row to view a detailed card with scores, notes, nearby attractions, score weighting tooltip, and a link to the listing.
- **Score Transparency** — Hover the overall score badge to see the weighting formula: Safety 30%, Walkability 30%, Transit 20%, Entertainment 20%.
- **CSV Export** — Download all displayed apartments as a CSV from the list view.
- **Responsive Mobile** — Sidebar collapses into a slide-out drawer on mobile. Cards use native scroll for smooth touch interaction. Toolbar provides quick access to filters and view toggle.
- **Lazy-Loaded Map** — Leaflet is code-split and lazy-loaded with a loading spinner for faster initial paint.
- **Dark Theme** — Permanent deep blue slate palette with Inter font.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript (strict mode) |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| UI Components | shadcn/ui (Radix UI + CVA + tailwind-merge) |
| Map | Leaflet + react-leaflet (lazy-loaded) |
| Routing | Wouter |
| Icons | Lucide React |
| Animations | Framer Motion (available) |
| Font | Inter (Google Fonts) |

## Project Structure

```
src/
├── App.tsx                    # Root component, routing setup
├── main.tsx                   # Entry point
├── index.css                  # Tailwind imports, theme variables, utilities
├── components/
│   ├── ApartmentDetailCard.tsx  # Detail overlay with scores & favorites
│   ├── ApartmentListView.tsx    # Card (mobile) / table (desktop) list view
│   ├── CompareView.tsx          # Side-by-side comparison of favorited apartments
│   ├── FilterSidebar.tsx        # Filter controls panel
│   ├── MapView.tsx              # Leaflet map with markers
│   └── ui/                      # 55 shadcn/ui components
├── data/
│   └── apartments.ts          # Static dataset (50 apartments) + score weighting constants
├── hooks/
│   ├── use-apartment-filters.ts  # Filter state, URL sync, filtering logic
│   ├── use-favorites.ts          # localStorage-backed favorites
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts               # cn() utility (clsx + tailwind-merge)
└── pages/
    ├── Map.tsx                # Main page (layout shell composing feature components)
    └── not-found.tsx          # 404 page
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Run Locally

```bash
# Install dependencies
npm install

# Start dev server (defaults to port 5173)
npm run dev
```

### Build

```bash
# Production build (output: dist/)
npm run build

# Preview production build
npm run preview
```

### Type Check

```bash
npm run typecheck
```

## Score Weighting

The overall score for each apartment is calculated as:

```
overallScore = (safety × 0.3) + (walkability × 0.3) + (transit × 0.2) + (entertainment × 0.2)
```

Each individual score is rated 1–10 based on neighborhood data. The weighting reflects that safety and walkability are prioritized over transit and entertainment access.

## Data

All apartment data lives in `src/data/apartments.ts` as a static typed array of 50 entries. Each apartment includes:

- Name, address, neighborhood, zip code
- Lat/lng coordinates for map placement
- Rent range (min/max)
- Unit types and washer/dryer availability
- Four category scores (1–10): safety, walkability, transit, entertainment
- Overall score (weighted composite)
- Google rating (where available)
- Nearby attractions and notes
- Direct URL to the property's own website

## Scripts

| Script | Description |
|--------|-------------|
| `generate-kml.js` | Generates `apartments.kml` for Google Earth/Maps import |
| `scripts/fetch-google-ratings.py` | Fetches Google ratings for apartments |

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the business and technical roadmap.
