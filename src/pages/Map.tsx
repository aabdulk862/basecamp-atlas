import { useState, Suspense, lazy, useMemo } from 'react';
import { type Apartment, apartments as allApartments } from '@/data/apartments';
import { useApartmentFilters } from '@/hooks/use-apartment-filters';
import { useFavorites } from '@/hooks/use-favorites';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ApartmentDetailCard } from '@/components/ApartmentDetailCard';
import { ApartmentListView } from '@/components/ApartmentListView';
import { CompareView } from '@/components/CompareView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, List, SlidersHorizontal, X, Heart, GitCompareArrows } from 'lucide-react';

// Lazy-load the map component (Leaflet is a heavy bundle)
const MapView = lazy(() => import('@/components/MapView').then(m => ({ default: m.MapView })));

type ViewMode = 'map' | 'list' | 'compare';

// Uptown Charlotte center for distance calculation
const UPTOWN_LAT = 35.2271;
const UPTOWN_LNG = -80.8431;

function getDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapPage() {
  const filters = useApartmentFilters();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [compareApartments, setCompareApartments] = useState<Apartment[]>([]);

  const displayedApartments = showFavoritesOnly
    ? filters.filteredApartments.filter(apt => favorites.includes(apt.name))
    : filters.filteredApartments;

  // Get favorited apartment objects for compare
  const favoritedApartments = useMemo(() =>
    allApartments.filter(apt => favorites.includes(apt.name)),
    [favorites]
  );

  const handleStartCompare = () => {
    setCompareApartments(favoritedApartments);
    setViewMode('compare');
  };

  const handleRemoveFromCompare = (name: string) => {
    setCompareApartments(prev => prev.filter(a => a.name !== name));
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-96 shrink-0 h-full border-r border-border bg-card flex-col z-10 shadow-2xl">
        <FilterSidebar
          {...filters}
          matchCount={displayedApartments.length}
        />
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85vw] max-w-sm bg-card shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold">Filters</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <FilterSidebar
                {...filters}
                matchCount={displayedApartments.length}
              />
            </div>
          </div>
        </div>
      )}

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
              {filters.activeFilterCount > 0 && (
                <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {filters.activeFilterCount}
                </Badge>
              )}
            </Button>

            {/* Favorites toggle */}
            <Button
              variant={showFavoritesOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={showFavoritesOnly ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30' : ''}
            >
              <Heart className={`w-4 h-4 mr-1 ${showFavoritesOnly ? 'fill-red-400' : ''}`} />
              {favorites.length > 0 && (
                <span className="text-xs">{favorites.length}</span>
              )}
            </Button>

            {/* Compare button - shows when 2+ favorites */}
            {favorites.length >= 2 && (
              <Button
                variant={viewMode === 'compare' ? 'default' : 'outline'}
                size="sm"
                onClick={handleStartCompare}
              >
                <GitCompareArrows className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Compare</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">
              {displayedApartments.length} results
            </span>
            {/* View toggle */}
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
              aria-label="Map view"
            >
              <Map className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 relative min-h-0 overflow-hidden">
          {viewMode === 'compare' ? (
            <CompareView
              apartments={compareApartments}
              onRemove={handleRemoveFromCompare}
              onClose={() => setViewMode('map')}
            />
          ) : viewMode === 'map' ? (
            <Suspense fallback={
              <div className="flex items-center justify-center h-full bg-muted/20">
                <div className="text-center space-y-2">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
              </div>
            }>
              <MapView
                apartments={displayedApartments}
                favorites={favorites}
                onSelectApartment={setSelectedApartment}
              />
            </Suspense>
          ) : (
            <ApartmentListView
              apartments={displayedApartments}
              favorites={favorites}
              onSelectApartment={setSelectedApartment}
              onToggleFavorite={toggleFavorite}
            />
          )}

          {/* Selected Apartment Overlay */}
          {selectedApartment && viewMode !== 'compare' && (
            <div className="absolute top-4 right-4 z-[1000] w-80 shadow-2xl rounded-xl max-sm:w-[calc(100vw-2rem)] max-sm:left-4 max-sm:right-4">
              <ApartmentDetailCard
                apartment={selectedApartment}
                isFavorite={isFavorite(selectedApartment.name)}
                onClose={() => setSelectedApartment(null)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
