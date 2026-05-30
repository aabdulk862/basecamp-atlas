import { useMemo } from 'react';
import { useRetreatFilters } from '@/hooks/use-retreat-filters';
import { RetreatFilterSidebar } from '@/components/retreat/RetreatFilterSidebar';
import { PropertyCard } from '@/components/retreat/PropertyCard';
import type { PropertyCardProperty } from '@/components/retreat/PropertyCard';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export interface SerializedProperty {
  slug: string;
  name: string;
  region: string;
  stayType: string;
  priceRange: { min: number; max: number };
  driveTimes: Record<string, number>;
  privacyLevel: number;
  amenities: string[];
  wowFactor: string;
  coordinates: { lat: number; lng: number };
  nearbyHikes: { name: string; distance?: string }[];
  bookingUrl: string;
  [key: string]: unknown;
}

export interface SerializedRegion {
  slug: string;
  name: string;
}

export interface SerializedOriginCity {
  slug: string;
  name: string;
}

interface RetreatBrowseProps {
  properties: SerializedProperty[];
  regions: SerializedRegion[];
  originCities: SerializedOriginCity[];
}

export function RetreatBrowse({ properties, regions, originCities }: RetreatBrowseProps) {
  const {
    regions: selectedRegions,
    stayTypes,
    categories,
    priceRange,
    maxDriveTime,
    selectedOrigin,
    minPrivacy,
    amenities,
    setRegions,
    setStayTypes,
    setCategories,
    setPriceRange,
    setMaxDriveTime,
    setSelectedOrigin,
    setMinPrivacy,
    setAmenities,
    resetFilters,
    filteredProperties,
    activeFilterCount,
  } = useRetreatFilters(properties);

  // Derive available stay types from all properties (unique, sorted)
  const availableStayTypes = useMemo(() => {
    const types = new Set(properties.map((p) => p.stayType));
    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [properties]);

  // Create a region name lookup map
  const regionNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const region of regions) {
      map[region.slug] = region.name;
    }
    return map;
  }, [regions]);

  const matchCount = filteredProperties.length;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filter sidebar */}
      <aside className="w-full md:w-[280px] shrink-0 rounded-lg overflow-hidden border border-[var(--border-subtle)]">
        <RetreatFilterSidebar
          regions={selectedRegions}
          stayTypes={stayTypes}
          categories={categories}
          priceRange={priceRange}
          maxDriveTime={maxDriveTime}
          selectedOrigin={selectedOrigin}
          minPrivacy={minPrivacy}
          amenities={amenities}
          setRegions={setRegions}
          setStayTypes={setStayTypes}
          setCategories={setCategories}
          setPriceRange={setPriceRange}
          setMaxDriveTime={setMaxDriveTime}
          setSelectedOrigin={setSelectedOrigin}
          setMinPrivacy={setMinPrivacy}
          setAmenities={setAmenities}
          resetFilters={resetFilters}
          activeFilterCount={activeFilterCount}
          matchCount={matchCount}
          availableRegions={regions}
          availableOriginCities={originCities}
          availableStayTypes={availableStayTypes}
        />
      </aside>

      {/* Property grid */}
      <main className="flex-1 min-w-0">
        {/* Results count */}
        <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
          {matchCount} {matchCount === 1 ? 'property' : 'properties'}
        </p>

        {matchCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.slug}
                property={property as PropertyCardProperty}
                selectedOrigin={selectedOrigin}
                regionName={regionNameMap[property.region] ?? property.region}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
            <SearchX className="w-12 h-12 mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3
              className="text-lg font-semibold mb-2 font-[family-name:var(--font-heading,Playfair_Display)]"
              style={{ color: 'var(--text-primary)' }}
            >
              No properties found
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Try adjusting your filters to see more results.
            </p>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--surface-base)]"
            >
              Reset all filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
