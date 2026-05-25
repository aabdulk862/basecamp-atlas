# Implementation Plan: Retreat Property Expansion

## Overview

Expand the /escape retreat catalog by adding 1–2 new geographic regions and 5–8 verified properties. All new content is added as Markdown files conforming to the existing Zod schema — no code changes required. Property-based tests validate content integrity using vitest + fast-check.

## Tasks

- [x] 1. Create new region files
  - [x] 1.1 Create Hocking Hills OH region file
    - Create `src/content/regions/hocking-hills-oh.md` with frontmatter: name, slug, description (≥ 50 chars), highlights (≥ 1 item), coordinates (lat/lng for southeastern Ohio)
    - Include editorial body content describing the region's landscape, attractions, and appeal
    - _Requirements: 2.1, 2.3, 2.5, 10.5_

  - [x] 1.2 Create Finger Lakes NY region file
    - Create `src/content/regions/finger-lakes-ny.md` with frontmatter: name, slug, description (≥ 50 chars), highlights (≥ 1 item), coordinates (lat/lng for central New York lake region)
    - Include editorial body content describing the region's wine country, gorges, and lake scenery
    - _Requirements: 2.1, 2.3, 2.5, 10.5_

- [x] 2. Research, verify, and create new property files for Hocking Hills OH
  - [x] 2.1 Create first Hocking Hills property (cabin, mid-range)
    - Research a real, bookable cabin property in the Hocking Hills area with hot tub, privacy ≥ 3, sedan-friendly access
    - Verify booking URL resolves (HTTP 200–399), amenities match listing, coordinates within 100 km of region center
    - Create `src/content/properties/{slug}.md` with complete frontmatter (all required fields including driveTimes for all 8 origin cities) and 150+ word editorial body with ≥ 2 headed sections
    - Calculate drive times from all 8 origin cities using mapping service
    - Score candidate using prioritization algorithm (sauna +30, views +25, activities +20, hiking +25, rare stayType +10)
    - _Requirements: 1.1, 1.2, 1.5, 2.4, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 7.1–7.6, 8.1, 8.5, 9.1, 9.2, 10.1, 10.2, 10.3_

  - [x] 2.2 Create second Hocking Hills property (treehouse or A-frame, budget or premium)
    - Research a real, bookable treehouse or A-frame property in the Hocking Hills area with hot tub, privacy ≥ 3, sedan-friendly access
    - Verify booking URL resolves, amenities match listing, coordinates within 100 km of region center
    - Create `src/content/properties/{slug}.md` with complete frontmatter and 150+ word editorial body with ≥ 2 headed sections
    - Ensure distinct stayType and price bracket from 2.1 for catalog diversity
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.4, 2.6, 3.1–3.5, 4.1, 4.2, 5.1–5.6, 6.1–6.4, 7.1–7.6, 8.1, 8.5, 9.1, 9.2, 10.1, 10.2, 10.3_

  - [x] 2.3 Create third Hocking Hills property (yurt or dome, varied price bracket)
    - Research a real, bookable yurt or dome property in the Hocking Hills area with hot tub, privacy ≥ 3, sedan-friendly access
    - Verify booking URL resolves, amenities match listing, coordinates within 100 km of region center
    - Create `src/content/properties/{slug}.md` with complete frontmatter and 150+ word editorial body with ≥ 2 headed sections
    - Ensure distinct stayType from 2.1 and 2.2 for catalog diversity
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.4, 2.6, 3.1–3.5, 4.1, 4.2, 5.1–5.6, 6.1–6.4, 7.1–7.6, 8.1, 8.5, 9.1, 9.2, 10.1, 10.2, 10.3_

- [x] 3. Checkpoint - Validate Hocking Hills content
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Research, verify, and create new property files for Finger Lakes NY
  - [x] 4.1 Create first Finger Lakes property (cabin or A-frame, mid-range or premium)
    - Research a real, bookable property in the Finger Lakes area with hot tub, privacy ≥ 3, sedan-friendly access
    - Verify booking URL resolves, amenities match listing, coordinates within 100 km of region center
    - Create `src/content/properties/{slug}.md` with complete frontmatter and 150+ word editorial body with ≥ 2 headed sections
    - Calculate drive times from all 8 origin cities
    - _Requirements: 1.1, 1.2, 1.5, 2.4, 2.6, 3.1–3.5, 4.1, 4.2, 5.1–5.6, 6.1–6.4, 7.1–7.6, 8.1, 8.5, 9.1, 9.2, 10.1, 10.2, 10.3_

  - [x] 4.2 Create second Finger Lakes property (container or mirror cabin, varied price bracket)
    - Research a real, bookable unique-stayType property in the Finger Lakes area with hot tub, privacy ≥ 3, sedan-friendly access
    - Verify booking URL resolves, amenities match listing, coordinates within 100 km of region center
    - Create `src/content/properties/{slug}.md` with complete frontmatter and 150+ word editorial body with ≥ 2 headed sections
    - Ensure distinct stayType and price bracket from 4.1
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.4, 2.6, 3.1–3.5, 4.1, 4.2, 5.1–5.6, 6.1–6.4, 7.1–7.6, 8.1, 8.5, 9.1, 9.2, 10.1, 10.2, 10.3_

- [x] 5. Create additional properties for geographic and catalog diversity
  - [x] 5.1 Create property in existing region with underrepresented stayType
    - Research a real, bookable property in one of the existing 7 regions with a stayType not well-represented (container, yurt, A-frame)
    - Verify booking URL resolves, amenities match listing, coordinates correct
    - Create `src/content/properties/{slug}.md` with complete frontmatter and 150+ word editorial body
    - Ensure this property fills a gap in stayType or price bracket diversity
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1–3.5, 4.1, 4.2, 5.1–5.6, 6.1–6.4, 7.5, 8.1, 8.5, 9.1, 9.2, 10.1, 10.2, 10.3_

  - [x] 5.2 Create property in existing region with high prioritization score
    - Research a real, bookable property targeting maximum prioritization score (sauna + views + activities + hiking)
    - Verify booking URL resolves, amenities match listing, coordinates correct
    - Create `src/content/properties/{slug}.md` with complete frontmatter and 150+ word editorial body
    - Document the prioritization score breakdown in a comment
    - _Requirements: 1.1, 1.2, 1.5, 3.1–3.5, 4.1, 4.2, 5.1–5.6, 6.1–6.4, 7.1–7.6, 8.1, 8.5, 9.1, 9.2, 10.1, 10.2, 10.3_

  - [x] 5.3 Create additional property to reach minimum catalog target (27 total)
    - Research a real, bookable property that fills remaining gaps in stayType or price bracket diversity
    - Verify booking URL resolves, amenities match listing, coordinates correct
    - Create `src/content/properties/{slug}.md` with complete frontmatter and 150+ word editorial body
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1–3.5, 4.1, 4.2, 5.1–5.6, 6.1–6.4, 8.1, 8.5, 9.1, 9.2, 10.1, 10.2, 10.3_

- [x] 6. Checkpoint - Validate all new content files
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Run Astro build to validate content integration
  - [x] 7.1 Run `npm run build` and verify exit code 0
    - Execute the Astro build to confirm all new property and region files pass Zod schema validation
    - Verify no validation errors for any new content files
    - Confirm new properties appear in the build output (static pages generated)
    - Confirm new region pages are generated at `/escape/{region-slug}`
    - _Requirements: 8.2, 8.3, 8.4, 8.6_

  - [x] 7.2 Verify data integrity across all content files
    - Confirm total property count matches number of .md files in `src/content/properties/`
    - Verify all property region fields reference existing region file slugs
    - Verify all property filenames match their slug frontmatter field
    - Verify all slugs are unique across the collection
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6_

- [ ] 8. Write property-based tests for content validation
  - [ ]* 8.1 Write property test: Schema acceptance of valid property data
    - **Property 1: Schema Acceptance of Valid Property Data**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 6.2, 6.3**
    - Create `src/test/content-validation.test.ts`
    - Use fast-check to generate arbitrary valid property frontmatter objects (privacy 3–5, amenities with hot tub, roadAccess sedan-friendly, wowFactor 20–300 chars, valid URL, valid coordinates, 1–20 nearbyHikes)
    - Assert the Zod property schema accepts all generated valid inputs

  - [ ]* 8.2 Write property test: Schema rejection of invalid property data
    - **Property 2: Schema Rejection of Invalid Property Data**
    - **Validates: Requirements 3.6**
    - In `src/test/content-validation.test.ts`
    - Use fast-check to generate property frontmatter with at least one curation violation (privacy < 3, missing hot tub, invalid roadAccess, wowFactor outside bounds, nearbyHikes outside 1–20)
    - Assert the Zod property schema rejects all generated invalid inputs with descriptive errors

  - [ ]* 8.3 Write property test: Booking URL classification
    - **Property 3: Booking URL Classification**
    - **Validates: Requirements 5.2, 9.2, 9.3**
    - In `src/test/content-validation.test.ts`
    - Use fast-check to generate URLs and classify as direct property links vs aggregator homepages
    - Assert aggregator homepages (airbnb.com root, vrbo.com root) are correctly identified and rejected
    - Assert specific listing URLs (with room/listing IDs) are correctly accepted

  - [ ]* 8.4 Write property test: Drive time completeness
    - **Property 4: Drive Time Completeness**
    - **Validates: Requirements 4.1, 4.2**
    - In `src/test/content-validation.test.ts`
    - Use fast-check to verify all property files have driveTimes entries for all 8 required origin cities
    - Assert all drive time values are positive integers between 1 and 720

  - [ ]* 8.5 Write property test: Coordinate bounds validation
    - **Property 5: Coordinate Bounds Validation**
    - **Validates: Requirements 5.4, 6.3**
    - In `src/test/content-validation.test.ts`
    - Use fast-check to generate coordinates and verify continental US bounds (lat 24–50, lng -125 to -66)
    - Assert all property coordinates fall within valid bounds

  - [ ]* 8.6 Write property test: Property-region referential integrity
    - **Property 6: Property-Region Referential Integrity**
    - **Validates: Requirements 10.3**
    - In `src/test/content-validation.test.ts`
    - Read all property files and region files from the content directories
    - Assert every property's region field matches an existing region file slug

  - [ ]* 8.7 Write property test: Region coverage
    - **Property 7: Region Coverage**
    - **Validates: Requirements 2.4**
    - In `src/test/content-validation.test.ts`
    - Read all region files and property files
    - Assert every region has at least one property referencing it

  - [ ]* 8.8 Write property test: Slug uniqueness
    - **Property 8: Slug Uniqueness**
    - **Validates: Requirements 10.1, 10.5**
    - In `src/test/content-validation.test.ts`
    - Read all property files and extract slugs from filenames
    - Assert no duplicate slugs exist across properties or regions

  - [ ]* 8.9 Write property test: Filename-slug consistency
    - **Property 9: Filename-Slug Consistency**
    - **Validates: Requirements 8.5, 10.2**
    - In `src/test/content-validation.test.ts`
    - Read all property files, parse frontmatter, extract slug field
    - Assert filename (without .md) matches the slug frontmatter field for every property

  - [ ]* 8.10 Write property test: Prioritization score monotonicity
    - **Property 10: Prioritization Score Monotonicity**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
    - In `src/test/content-validation.test.ts`
    - Implement the `scorePropertyCandidate` function from the design
    - Use fast-check to generate pairs of property candidates differing by one feature (sauna, views, activities, hiking, rare stayType)
    - Assert the candidate with the feature always scores higher than the one without

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- No code changes to `src/content/config.ts`, page templates, or components are required
- All new content integrates automatically via Astro content collections
- Drive times should be calculated using Google Maps or equivalent for weekday non-rush-hour estimates
- The minimum target is 5 new properties (reaching 27 total); tasks 5.1–5.3 can be extended to reach 8 new properties (30 total) if suitable candidates are found

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "4.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "4.2"] },
    { "id": 3, "tasks": ["5.1", "5.2", "5.3"] },
    { "id": 4, "tasks": ["7.1", "7.2"] },
    { "id": 5, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7", "8.8", "8.9", "8.10"] }
  ]
}
```
