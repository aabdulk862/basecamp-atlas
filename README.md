# Charlotte Apartment Finder

An interactive map-based apartment search tool for Charlotte, NC. Browse 37 curated apartments with filtering by rent, neighborhood, amenities, and livability scores — all visualized on a Leaflet map with color-coded markers.

## Features

- **Interactive Map** — Leaflet map centered on Charlotte with color-coded markers (green = high score, red = low). Favorited apartments get a red border ring.
- **List/Table View** — Toggle between map and a sortable table for side-by-side comparison of all apartments with color-coded scores.
- **Filter Sidebar** — Rent range slider, neighborhood checkboxes, washer/dryer select, and minimum score sliders (safety, walkability, transit, entertainment).
- **URL-Persisted Filters** — Filter state is synced to query params so you can share a filtered view (e.g., `?neighborhoods=NoDa,Elizabeth&minSafety=7`).
- **Favorites** — Heart any apartment to save it. Favorites persist in localStorage. Toggle "favorites only" mode to compare your shortlist.
- **Detail Card** — Click any marker or table row to view a detailed card with scores, notes, nearby attractions, score weighting tooltip, and a link to the listing.
- **Score Transparency** — Hover the overall score badge to see the weighting formula: Safety 30%, Walkability 30%, Transit 20%, Entertainment 20%.
- **Responsive Mobile** — Sidebar collapses into a slide-out drawer on mobile. Toolbar provides quick access to filters and view toggle.
- **Lazy-Loaded Map** — Leaflet is code-split and lazy-loaded with a loading spinner for faster initial paint.
- **Dark Theme** — Permanent deep blue slate palette.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 + CSS custom properties |
| UI Components | shadcn/ui (Radix UI + CVA + tailwind-merge) |
| Map | Leaflet + react-leaflet (lazy-loaded) |
| Routing | Wouter |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |

## Project Structure

```
src/
├── App.tsx                    # Root component, routing setup
├── main.tsx                   # Entry point
├── index.css                  # Tailwind imports, theme variables, utilities
├── components/
│   ├── ApartmentDetailCard.tsx  # Detail overlay with scores & favorites
│   ├── ApartmentListView.tsx    # Table/list view of apartments
│   ├── FilterSidebar.tsx        # Filter controls panel
│   ├── MapView.tsx              # Leaflet map with markers
│   └── ui/                      # 55 shadcn/ui components
├── data/
│   └── apartments.ts          # Static dataset + score weighting constants
├── hooks/
│   ├── use-apartment-filters.ts  # Filter state, URL sync, filtering logic
│   ├── use-favorites.ts          # localStorage-backed favorites
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts               # cn() utility (clsx + tailwind-merge)
└── pages/
    ├── Map.tsx                # Main page (thin layout shell)
    └── not-found.tsx          # 404 page
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Run Locally

```bash
# Install dependencies
npm install

# Start dev server (defaults to port 5173)
npm run dev
```

### Environment Variables (optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5173` | Dev server port |
| `BASE_PATH` | `/` | Base URL path for deployment |

### Build

```bash
npm run build
```

Output goes to `dist/`.

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

All apartment data lives in `src/data/apartments.ts` as a static array of 37 entries. Each apartment includes:

- Name, address, neighborhood, zip code
- Lat/lng coordinates for map placement
- Rent range (min/max)
- Unit types and washer/dryer availability
- Four category scores (1–10): safety, walkability, transit, entertainment
- Overall score (weighted composite)
- Nearby attractions and notes
