import { useState, useCallback, useMemo, useEffect, useRef, Suspense, lazy } from 'react';
import { useRetreatFilters } from '@/hooks/use-retreat-filters';
import { useIsMobile } from '@/hooks/use-mobile';
import { RetreatFilterSidebar } from '@/components/retreat/RetreatFilterSidebar';
import { PropertySummaryCard } from '@/components/escape/PropertySummaryCard';
import type { SerializedProperty, SerializedOriginCity } from '@/components/retreat/RetreatBrowse';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, LayoutGrid, SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy-load the map adapter (Leaflet is a heavy bundle)
const EscapeMapAdapter = lazy(() =>
  import('@/components/map/EscapeMapAdapter').then(m => ({ default: m.EscapeMapAdapter }))
);

/** Region with optional coordinates for map fly-to */
export interface EscapeMapRegion {
  slug: string;
  name: string;
  coordinates?: { lat: number; lng: number } | null;
}

interface EscapeMapPageProps {
  properties: SerializedProperty[];
  regions: EscapeMapRegion[];
  originCities: SerializedOriginCity[];
}

/**
 * EscapeMapPage — Full-screen map view with integrated filtering for escape/retreat properties.
 * Layout mirrors the live apartment finder (MapPage) for visual consistency across verticals.
 */
export function EscapeMapPage({ properties, regions, originCities }: EscapeMapPageProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SerializedProperty | null>(null);
  const [mapFlyTo, setMapFlyTo] = useState<{ center: [number, number]; zoom: number } | undefined>(undefined);
  const isMobile = useIsMobile();
  const prevRegionsRef = useRef<string[]>([]);

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

  // Build a coordinate lookup from regions
  const regionCoordinateMap = useMemo(() => {
    const map: Record<string, { lat: number; lng: number }> = {};
    for (const region of regions) {
      if (region.coordinates) {
        map[region.slug] = region.coordinates;
      }
    }
    return map;
  }, [regions]);

  // Fly map to region when a single region is newly selected
  useEffect(() => {
    const prev = prevRegionsRef.current;
    const added = selectedRegions.filter((r) => !prev.includes(r));
    prevRegionsRef.current = selectedRegions;

    // If exactly one region was just toggled on, fly to it
    if (added.length === 1) {
      const coords = regionCoordinateMap[added[0]];
      if (coords) {
        setMapFlyTo({ center: [coords.lat, coords.lng], zoom: 7 });
      }
    }
  }, [selectedRegions, regionCoordinateMap]);

  // Derive available stay types from all properties (unique, sorted)
  const availableStayTypes = useMemo(() => {
    const types = new Set(properties.map((p) => p.stayType));
    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [properties]);

  const matchCount = filteredProperties.length;

  const handleSelectProperty = useCallback((property: SerializedProperty) => {
    setSelectedProperty(property);
  }, []);

  const handleDismissCard = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  const filterSidebarContent = (
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
  );

  return (
    <div className="relative w-full h-[calc(100dvh-4rem)] md:h-[calc(100dvh-4rem)] overflow-hidden bg-background text-foreground flex pb-12 md:pb-0">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-96 shrink-0 h-full border-r border-border bg-card flex-col z-10 shadow-2xl">
        {filterSidebarContent}
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              className="absolute inset-y-0 left-0 w-[85vw] max-w-sm bg-card shadow-2xl flex flex-col pb-[env(safe-area-inset-bottom)]"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-semibold">Filters</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                {filterSidebarContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 relative h-full flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-border bg-card/80 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {/* Map View indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
              <Map className="w-4 h-4" />
              <span>Map View</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">
              {matchCount} {matchCount === 1 ? 'property' : 'properties'}
            </span>

            {/* Grid view link */}
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href="/escape">
                <LayoutGrid className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Grid</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Map Content */}
        <div className="flex-1 relative min-h-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center h-full bg-muted/20">
                <div className="text-center space-y-2">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
              </div>
            }>
              <EscapeMapAdapter
                properties={filteredProperties as SerializedProperty[]}
                onSelectProperty={handleSelectProperty}
                flyTo={mapFlyTo}
              />
            </Suspense>
          </motion.div>

          {/* Desktop: Overlay detail card */}
          <AnimatePresence>
            {selectedProperty && !isMobile && (
              <motion.div
                className="absolute top-4 right-4 z-[1000] w-72"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <PropertySummaryCard
                  property={selectedProperty}
                  onClose={handleDismissCard}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile: detail card handled by PropertySummaryCard's internal drawer */}
          {selectedProperty && isMobile && (
            <PropertySummaryCard
              property={selectedProperty}
              onClose={handleDismissCard}
            />
          )}
        </div>
      </div>

      {/* Mobile: Fixed bottom toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-card/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-center gap-2 p-2">
          <Button
            variant="default"
            size="sm"
            aria-label="Map view"
            className="flex-1 max-w-[7rem]"
          >
            <Map className="w-4 h-4 mr-1.5" />
            Map
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 max-w-[7rem]"
          >
            <a href="/escape" aria-label="Grid view">
              <LayoutGrid className="w-4 h-4 mr-1.5" />
              Grid
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
