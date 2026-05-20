# Charlotte Apartment Finder

An interactive map-based apartment search tool for Charlotte, NC. Browse 37 curated apartments with filtering by rent, neighborhood, amenities, and livability scores — all visualized on a Leaflet map with color-coded markers.

## Features

- Interactive Leaflet map centered on Charlotte with color-coded markers (green = high score, red = low)
- Sidebar filter panel with rent range slider, neighborhood checkboxes, washer/dryer select, and minimum score sliders (safety, walkability, transit, entertainment)
- Sort results by overall score, rent, or individual category scores
- Click any marker to view a detailed apartment card with scores, notes, nearby attractions, and a link to the listing
- Dark-themed UI with a deep blue slate palette
- Responsive layout (sidebar collapses on mobile)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 + CSS custom properties |
| UI Components | shadcn/ui (Radix UI + CVA + tailwind-merge) |
| Map | Leaflet + react-leaflet |
| Routing | Wouter |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |

## Project Structure

```
src/
├── App.tsx              # Root component, routing setup
├── main.tsx             # Entry point
├── index.css            # Tailwind imports, theme variables, utilities
├── components/ui/       # 55 shadcn/ui components
├── data/
│   └── apartments.ts    # Static dataset of 37 apartments
├── hooks/               # Custom hooks (use-mobile, use-toast)
├── lib/
│   └── utils.ts         # cn() utility (clsx + tailwind-merge)
└── pages/
    ├── Map.tsx          # Main map page with filters and detail overlay
    └── not-found.tsx    # 404 page
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Dev server port (required) |
| `BASE_PATH` | Base URL path for the app (required) |

### Run Locally

```bash
# Install dependencies
npm install

# Start dev server
PORT=5173 BASE_PATH="/" npm run dev
```

### Build

```bash
PORT=5173 BASE_PATH="/" npm run build
```

Output goes to `dist/public/`.

### Type Check

```bash
npm run typecheck
```

## Data

All apartment data lives in `src/data/apartments.ts` as a static array. Each apartment includes:

- Name, address, neighborhood, zip code
- Lat/lng coordinates for map placement
- Rent range (min/max)
- Unit types and washer/dryer availability
- Four category scores (1–10): safety, walkability, transit, entertainment
- Overall score (weighted composite)
- Nearby attractions and notes

## Notes

- This project was originally part of a Replit monorepo workspace. The `tsconfig.json` extends a parent config and references a shared API client library that aren't present in this standalone checkout. These references can be safely removed if running independently.
- No backend or API — all data is client-side and static.
- The theme is permanently dark (light and dark CSS variables use the same palette).
