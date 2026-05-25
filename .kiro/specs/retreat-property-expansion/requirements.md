# Requirements Document

## Introduction

This document defines the requirements for expanding the /escape retreat property catalog. The current collection contains 22 curated properties across 7 Southeast Appalachian regions. This expansion adds 5–8 new verified properties and 1–2 new geographic regions beyond the existing Appalachian cluster, while maintaining strict curation standards enforced by the Zod schema at build time.

## Glossary

- **Property**: A curated vacation retreat listing stored as a Markdown file with Zod-validated frontmatter in `src/content/properties/`
- **Region**: A geographic area that groups properties, stored as a Markdown file in `src/content/regions/`
- **Curation_Standards**: The set of quality gates every property must pass — privacy ≥ 3, hot tub or soaking tub, sedan-friendly access, direct booking URL, wow factor 20–300 characters
- **Origin_City**: One of the 8 reference cities used for drive time calculations (Charlotte, Atlanta, Nashville, Richmond, Charleston WV, Greenville, Raleigh, Asheville)
- **Drive_Times**: A record mapping each of the 8 origin cities to an integer number of minutes for one-way driving
- **Verification_Pipeline**: The manual process confirming a property is real, bookable, and accurately described before inclusion
- **Booking_URL**: A direct link to a property's own website or a specific listing page on Airbnb/VRBO — never an aggregator homepage
- **Privacy_Level**: An integer rating from 3 to 5 indicating the degree of seclusion a property offers
- **Stay_Type**: A short descriptor for the accommodation style (cabin, treehouse, A-frame, dome, yurt, container, mirror cabin, etc.)
- **Content_Schema**: The Zod validation schema defined in `src/content/config.ts` that enforces frontmatter structure at build time
- **Astro_Build**: The static site generation process (`npm run build`) that validates content and produces HTML output

## Requirements

### Requirement 1: Property Catalog Expansion

**User Story:** As a retreat seeker, I want access to more curated property options, so that I can find a retreat that fits my preferences and travel constraints.

#### Acceptance Criteria

1. WHEN the expansion is complete, THE Property catalog SHALL contain between 27 and 30 total properties (5–8 new additions beyond the current 22)
2. THE new properties SHALL each represent a verified, real accommodation confirmed via official website or listing platform
3. WHEN new properties are added, THE catalog SHALL include variation in Stay_Type across the new additions (at least 3 distinct stay types among the 5–8 new properties)
4. WHEN new properties are added, THE catalog SHALL include at least 2 distinct price brackets among the new additions, where brackets are defined as: budget ($100–$249/night min), mid-range ($250–$399/night min), and premium ($400+/night min)
5. WHEN new properties are added, THE new Property files SHALL each pass the existing Zod schema validation in `src/content/config.ts` and meet all Curation_Standards without requiring schema modifications

### Requirement 2: Geographic Expansion

**User Story:** As a retreat seeker outside the Southeast Appalachian corridor, I want properties in new geographic regions, so that I can find retreats closer to where I live or in landscapes I want to explore.

#### Acceptance Criteria

1. WHEN the expansion is complete, THE Region collection SHALL contain 1–2 new regions beyond the current 7 Southeast Appalachian regions
2. THE new regions SHALL each have a mean drive time of no more than 480 minutes (8 hours) when averaged across all 8 Origin_City locations, with no single origin city exceeding 600 minutes
3. WHEN a new region is added, THE Region Markdown file SHALL include frontmatter with a name, description of at least 50 characters, highlights array with at least 1 item, and coordinates (lat/lng), and the filename (without extension) SHALL serve as the region slug
4. WHEN a new region is added, THE Region SHALL have at least one Property Markdown file whose region frontmatter field matches the region's filename-derived slug, and that property SHALL meet all existing curation standards (privacy level ≥ 3, hot tub or soaking tub in amenities, sedan-friendly road access, wow factor 20–300 characters, valid booking URL)
5. THE new regions SHALL be located in a state not already represented by the current 7 regions (Georgia, North Carolina, South Carolina, Tennessee, Virginia, West Virginia) OR feature a primary landscape type (e.g., coastal, desert, lake, prairie) not present in the current Appalachian mountain/forest cluster
6. WHEN a property is added in a new region, THE property frontmatter SHALL include driveTimes entries for all 8 origin city slugs (charlotte, atlanta, nashville, richmond, charleston-wv, greenville, raleigh, asheville) with integer values representing one-way drive time in minutes

### Requirement 3: Curation Standards Compliance

**User Story:** As a retreat seeker, I want every listed property to meet consistent quality standards, so that I can trust any property on the platform will deliver a private, comfortable experience.

#### Acceptance Criteria

1. THE Content_Schema SHALL enforce that every Property has a Privacy_Level integer between 3 and 5 inclusive
2. THE Content_Schema SHALL enforce that every Property includes at least one amenity containing "hot tub" or "soaking tub" (case-insensitive match) in its amenities array
3. THE Content_Schema SHALL enforce that every Property has roadAccess set to "sedan-friendly"
4. THE Content_Schema SHALL enforce that every Property has a wowFactor description between 20 and 300 characters inclusive
5. THE Content_Schema SHALL enforce that every Property has a syntactically valid Booking_URL conforming to standard URL format with HTTPS protocol
6. IF any Property does not meet all Curation_Standards, THEN THE Astro_Build SHALL fail and output a Zod validation error that identifies the failing property file, the specific field name, and the constraint that was violated
7. WHEN a Property amenities array is validated, THE Content_Schema SHALL require at least 1 entry in the array

### Requirement 4: Drive Time Completeness

**User Story:** As a retreat seeker filtering by drive time from my city, I want every property to have accurate drive times for all origin cities, so that filtering produces correct results.

#### Acceptance Criteria

1. THE Property frontmatter SHALL include a drive time entry for each of the 8 Origin_City slugs (charlotte, atlanta, nashville, richmond, charleston-wv, greenville, raleigh, asheville), with no keys omitted
2. THE drive time values SHALL each be a positive integer between 1 and 720 representing one-way minutes based on a standard mapping service (Google Maps or equivalent) using weekday non-rush-hour departure estimates
3. IF a Property is missing a drive time entry for any Origin_City, THEN THE Astro_Build SHALL fail with a validation error identifying the Property and the missing Origin_City key
4. IF a Property has a drive time value that is not a positive integer between 1 and 720, THEN THE Astro_Build SHALL fail with a validation error identifying the Property and the invalid value

### Requirement 5: Property Verification

**User Story:** As a retreat seeker, I want confidence that every listed property actually exists and is bookable, so that I do not waste time on phantom listings.

#### Acceptance Criteria

1. WHEN a new Property is added, THE Verification_Pipeline SHALL confirm the Booking_URL resolves to a live page (HTTP status 200–399) within 10 seconds and following no more than 5 redirects
2. WHEN a new Property is added, THE Verification_Pipeline SHALL confirm the Booking_URL points to either the property's own domain or a specific listing page on Airbnb/VRBO containing a room or listing ID in the URL path, and not an aggregator homepage or search results page
3. WHEN a new Property is added, THE Verification_Pipeline SHALL confirm that every amenity listed in the Property frontmatter is visibly advertised on the property's official listing page or website
4. WHEN a new Property is added, THE Verification_Pipeline SHALL confirm the coordinates place the property within 100 km of the associated Region's center coordinates
5. WHEN a new Property is added, THE Verification_Pipeline SHALL confirm the route from the nearest paved public road to the property entrance uses paved or maintained gravel roads passable by a standard sedan without requiring 4WD or high clearance
6. WHEN verification is performed, THE Property frontmatter SHALL include a lastVerified date in ISO 8601 format (YYYY-MM-DD) recording the date the check occurred
7. IF the Booking_URL returns an HTTP status outside 200–399 or does not respond within 10 seconds, THEN THE Verification_Pipeline SHALL reject the Property from inclusion until a valid Booking_URL is provided

### Requirement 6: Property Content Quality

**User Story:** As a retreat seeker browsing properties, I want rich editorial content for each listing, so that I can understand the experience before booking.

#### Acceptance Criteria

1. THE Property Markdown body SHALL contain at least 150 words of editorial content and SHALL include at least two headed sections (## level) covering the experience and the space
2. THE Property frontmatter SHALL include a nearbyHikes array with 1–20 entries, each containing a trail name (maximum 100 characters) and an optional distance descriptor (maximum 30 characters)
3. THE Property frontmatter SHALL include valid coordinates (latitude and longitude within continental US bounds: lat 24–50, lng -125 to -66)
4. THE Property wowFactor SHALL be between 20 and 300 characters and SHALL describe a specific distinguishing attribute of the property (architectural feature, location characteristic, or amenity) rather than generic praise
5. IF a Property Markdown body contains fewer than 150 words or lacks the required headed sections, THEN THE content review process SHALL flag the property as incomplete before publication

### Requirement 7: Property Prioritization

**User Story:** As a content curator, I want to prioritize properties with the most desirable features, so that the expansion adds maximum value to the collection.

#### Acceptance Criteria

1. WHEN selecting properties for inclusion, THE expansion SHALL assign a score of 30 points to properties that have saunas (barrel, infrared, or traditional) listed in their amenities array
2. WHEN selecting properties for inclusion, THE expansion SHALL assign a score of 25 points to properties with strong views (mountain, lake, valley, or panoramic) documented in the amenities array or wowFactor field
3. WHEN selecting properties for inclusion, THE expansion SHALL assign a score of 20 points to properties with proximity to activities (restaurants, breweries, outfitters, or waterfalls within 30 minutes drive) documented in the body content
4. WHEN selecting properties for inclusion, THE expansion SHALL assign a score of 25 points to properties with quality hiking access (3 or more trails within 30 minutes drive listed in nearbyHikes)
5. WHERE a property has an underrepresented Stay_Type (container, mirror cabin, A-frame, yurt), THE expansion SHALL assign an additional 10 points for catalog diversity
6. WHEN ranking candidate properties, THE expansion SHALL select properties with higher total scores first, with a maximum possible score of 110 points

### Requirement 8: Schema and Build Integration

**User Story:** As a developer, I want new properties to integrate seamlessly with the existing build pipeline, so that no code changes are required to display new content.

#### Acceptance Criteria

1. THE new Property files SHALL conform to the existing Zod schema in `src/content/config.ts` without requiring schema modifications, including all required fields (name, region, stayType, priceRange, driveTimes, privacyLevel, amenities, wowFactor, bookingUrl, coordinates, nearbyHikes, roadAccess) and the curation refinement (hot tub or soaking tub in amenities)
2. WHEN new Property files are added, THE Astro_Build (`npm run build`) SHALL complete with exit code 0 and generate static pages for each new property without errors
3. WHEN new Property files are added, THE browse page at /escape SHALL include the new properties in the rendered property list without any code changes to `src/pages/escape/index.astro` or `src/components/retreat/RetreatBrowse.tsx`
4. WHEN a new Region file is added and at least one Property references that region's slug in its region field, THE Astro_Build SHALL generate a region page at /escape/{region-slug} automatically via the existing dynamic route
5. THE Property file naming convention SHALL use lowercase kebab-case as the filename (e.g., `{slug}.md`) where the filename without extension matches the value used as `entry.id` by the Astro content collection loader
6. IF a new Property file contains frontmatter that violates the Zod schema, THEN THE Astro_Build SHALL fail with a validation error identifying the file and the specific constraint that was violated
7. WHEN a new Region file is added but no Property references its slug, THEN THE Astro_Build SHALL NOT generate a region page for that region (consistent with the existing `getStaticPaths` filter logic)

### Requirement 9: Booking URL Integrity

**User Story:** As a retreat seeker clicking through to book, I want the booking link to take me directly to the property's booking page, so that I can reserve without searching.

#### Acceptance Criteria

1. THE Booking_URL SHALL use HTTPS protocol
2. THE Booking_URL SHALL point to the property's own domain or a specific listing page on Airbnb or VRBO (containing a numeric room or listing ID in the URL path)
3. IF the Booking_URL points to an aggregator homepage (airbnb.com, vrbo.com, booking.com, or expedia.com root or search pages without a specific listing path), THEN THE Verification_Pipeline SHALL reject the property
4. IF a previously verified Booking_URL returns HTTP 404 or fails to respond within 30 seconds, THEN THE Property SHALL be marked with a lastVerified date older than the current check date and either have its Booking_URL updated to a valid link or be removed from the collection within 7 days
5. WHEN a Booking_URL is verified, THE Verification_Pipeline SHALL confirm the URL returns HTTP status 200–399 after following a maximum of 5 redirects

### Requirement 10: Data Integrity and Uniqueness

**User Story:** As a developer, I want content files to maintain referential integrity, so that the site builds correctly and no data is silently lost.

#### Acceptance Criteria

1. THE Property slug frontmatter field SHALL be unique across all property files in the collection and SHALL contain only lowercase alphanumeric characters and hyphens, between 3 and 80 characters in length
2. THE Property filename (without the .md extension) SHALL exactly match the slug field in its frontmatter
3. THE Property region field SHALL reference the filename stem (without .md extension) of an existing Region file in `src/content/regions/`
4. IF two Property files contain the same slug value, THEN THE Astro content collection loader SHALL overwrite one entry silently, and THE developer SHALL detect this by verifying the total property count in the built output matches the number of property files in `src/content/properties/`
5. THE Region filename stem (without .md extension) SHALL be unique across all region files in the collection and SHALL contain only lowercase alphanumeric characters and hyphens, between 3 and 80 characters in length
6. IF a Property region field references a region filename stem that does not exist in `src/content/regions/`, THEN THE Astro_Build SHALL produce a page with a broken or missing region link, and THE developer SHALL detect this by verifying all property region values match an existing region file
