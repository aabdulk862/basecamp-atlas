# Charlotte Apartment Finder — Business & Technical Roadmap

## Where You Are Today (v1.0)

- Static React SPA with 37 hand-curated Charlotte apartments
- Interactive Leaflet map + list view + compare mode
- Custom scoring system (safety, walkability, transit, entertainment)
- Filter sidebar, favorites (localStorage), CSV export
- No backend, no auth, no revenue

---

## Phase 1: Monetize What Exists (Weeks 1–4)

**Goal:** Start earning with minimal technical changes.

### Business

- [ ] Sign up for apartment referral programs (RentReporter, direct property partnerships)
- [ ] Replace static `url` links with tracked affiliate/referral links
- [ ] Add a small "Featured" badge for properties willing to pay for placement ($50–100/mo)
- [ ] Deploy to a custom domain (e.g. `charlotteapartmentfinder.com`)
- [ ] Set up Google Analytics / Plausible for traffic tracking
- [ ] Submit sitemap to Google Search Console

### Technical

- [ ] Add `affiliateUrl` field to the `Apartment` interface (keep `url` as fallback)
- [ ] Add UTM parameters to outbound links for conversion tracking
- [ ] Add basic SEO: meta tags, Open Graph, structured data (JSON-LD `ApartmentComplex`)
- [ ] Pre-render or SSG the page (switch to Astro or Vite SSG plugin) for search indexing
- [ ] Add a "Sponsored" indicator component for paid placements

### Revenue potential: $200–$1,000/mo with 5–10 lease referrals

---

## Phase 2: Content & SEO Moat (Weeks 5–12)

**Goal:** Drive organic traffic through high-intent search content.

### Business

- [ ] Write neighborhood guides (South End, NoDa, Plaza Midwood, etc.)
- [ ] Create "Best apartments for [persona]" pages (remote workers, young professionals, families)
- [ ] Add a Charlotte relocation checklist / moving guide
- [ ] Start an email list ("Get notified when new apartments are added")
- [ ] Reach out to Charlotte relocation Facebook groups, Reddit r/Charlotte

### Technical

- [ ] Migrate to Astro (keep React components, gain static pages + content collections)
- [ ] Add a `/neighborhoods/[slug]` route with markdown-driven content
- [ ] Add a blog/guides section with MDX
- [ ] Implement a simple CMS (Keystatic, Tina, or just markdown files in the repo)
- [ ] Add image optimization (apartment photos, neighborhood hero images)
- [ ] Implement proper sitemap generation and RSS feed

### Revenue potential: $500–$2,000/mo (affiliate + display ads at ~5K monthly visitors)

---

## Phase 3: Dynamic Data & User Accounts (Months 3–6)

**Goal:** Solve the stale data problem and increase stickiness.

### Business

- [ ] Offer a "Claim your listing" flow for property managers (free tier + paid upgrades)
- [ ] Charge properties for enhanced listings ($100–$300/mo): photos, virtual tours, special offers
- [ ] Add user reviews/ratings to build community trust
- [ ] Partner with 1–2 Charlotte relocation companies for lead referrals

### Technical

- [ ] Add a backend (Supabase or PlanetScale + tRPC / Hono)
- [ ] Move apartment data from static TS file → database
- [ ] Build an admin dashboard for updating listings (pricing, availability)
- [ ] Add user auth (Clerk or Supabase Auth) for saved searches, favorites sync, reviews
- [ ] Implement a price scraper/updater (cron job that checks property websites weekly)
- [ ] Add real-time availability indicators (API integrations where available)
- [ ] Set up email notifications: "Price dropped on your favorited apartment"

### Revenue potential: $2,000–$5,000/mo (enhanced listings + referrals + growing traffic)

---

## Phase 4: Scale to Multi-City (Months 6–12)

**Goal:** Templatize and expand to other mid-size cities.

### Business

- [ ] Identify 3–5 target cities (Raleigh, Nashville, Austin, Denver, Tampa)
- [ ] Validate demand: check search volume for "[city] apartments" long-tail keywords
- [ ] Hire part-time researchers to curate initial apartment data per city
- [ ] Build city-specific landing pages for SEO
- [ ] Explore a "City Partner" model — local real estate agents manage their city's data for rev share

### Technical

- [ ] Abstract the data model to be multi-tenant (add `city` / `market` field)
- [ ] Build a city selector and city-specific routes (`/charlotte`, `/raleigh`, etc.)
- [ ] Create a data ingestion pipeline (CSV upload → validation → database)
- [ ] Add a scoring calibration system (different cities have different baselines)
- [ ] Implement CDN-based edge caching per city for performance
- [ ] Consider a mobile app (React Native or PWA with offline support)

### Revenue potential: $5,000–$15,000/mo across multiple cities

---

## Phase 5: Platform Play (Year 2+)

**Goal:** Become the go-to tool for apartment hunting in mid-size cities.

### Business

- [ ] Offer a SaaS tier for property management companies (bulk listing management)
- [ ] Add a "Roommate Finder" or "Neighborhood Match Quiz" for viral growth
- [ ] Explore partnerships with moving companies, furniture rental, utilities setup
- [ ] Consider raising a small angel round if unit economics prove out

### Technical

- [ ] Build a public API for property data (freemium model)
- [ ] Add AI-powered recommendations ("Based on your preferences, try these 5")
- [ ] Implement a commute time calculator (integrate with Google Maps / OSRM)
- [ ] Add 3D neighborhood exploration or street view integration
- [ ] Build a Chrome extension that overlays your scores on Zillow/Apartments.com

---

## Key Metrics to Track

| Phase | North Star Metric | Target |
|-------|------------------|--------|
| 1 | Monthly lease referrals | 5–10 |
| 2 | Monthly organic visitors | 5,000 |
| 3 | Registered users | 1,000 |
| 4 | Cities live | 5 |
| 5 | MRR | $10,000+ |

---

## Technical Debt to Address Along the Way

- [ ] Add testing (Vitest + React Testing Library) before Phase 3
- [ ] Set up CI/CD (GitHub Actions → Vercel/Cloudflare Pages)
- [ ] Add error monitoring (Sentry)
- [ ] Implement proper logging and analytics events
- [ ] Accessibility audit (WCAG 2.1 AA compliance)
- [ ] Performance budget (Core Web Vitals targets)

---

## Competitive Advantage

Your edge isn't the listings — it's the **opinionated scoring and curation**. Zillow and Apartments.com are neutral marketplaces. You're a trusted guide that says "this neighborhood is actually safe" and "this place has great transit access." That editorial voice is what builds loyalty and what aggregators can't replicate at scale.

Protect that by:
1. Keeping scores honest (never inflate for paying properties)
2. Adding real resident reviews over time
3. Going deep on Charlotte knowledge before going wide on cities
