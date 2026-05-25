import { useState, Suspense, lazy, useMemo } from 'react';
import { type Apartment, apartments as allApartments } from '@/data/apartments';
import { useApartmentFilters } from '@/hooks/use-apartment-filters';
import { useFavorites } from '@/hooks/use-favorites';
import { useScoreWeights } from '@/hooks/use-score-weights';
import { useCommute } from '@/hooks/use-commute';
import { useScoreFeedback } from '@/hooks/use-score-feedback';
import { useIsMobile } from '@/hooks/use-mobile';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ApartmentDetailCard } from '@/components/ApartmentDetailCard';
import { ApartmentListView } from '@/components/ApartmentListView';
import { CompareView } from '@/components/CompareView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, List, SlidersHorizontal, X, Heart, GitCompareArrows } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Drawer } from 'vaul';

// Lazy-load the map component (Leaflet is a heavy bundle)
const MapView = lazy(() => import('@/components/MapView').then(m => ({ default: m.MapView })));

type ViewMode = 'map' | 'list' | 'compare';

export default function MapPage() {
  const filters = useApartmentFilters();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const scoreWeights = useScoreWeights();
  const commute = useCommute();
  const scoreFeedback = useScoreFeedback();
  const isMobile = useIsMobile();
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [compareApartments, setCompareApartments] = useState<Apartment[]>([]);

  // Recalculate scores based on custom weights
  const apartmentsWithCustomScores = useMemo(() => {
    if (!scoreWeights.isCustom) return filters.filteredApartments;
    return filters.filteredApartments.map(apt => ({
      ...apt,
      overallScore: scoreWeights.calculateScore(apt),
    }));
  }, [filters.filteredApartments, scoreWeights]);

  const displayedApartments = showFavoritesOnly
    ? apartmentsWithCustomScores.filter(apt => favorites.includes(apt.name))
    : apartmentsWithCustomScores;

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
    <div className="relative w-full h-[calc(100dvh-4rem)] overflow-hidden bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-96 shrink-0 h-full border-r border-border bg-card flex-col z-10 shadow-2xl">
        <FilterSidebar
          {...filters}
          matchCount={displayedApartments.length}
          scoreWeights={scoreWeights}
          commute={commute}
        />
      </div>

      {/* Mobile Filter Drawer */}
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
              <FilterSidebar
                {...filters}
                matchCount={displayedApartments.length}
                scoreWeights={scoreWeights}
                commute={commute}
              />
            </div>
          </motion.div>
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

        {/* View Content with animated transitions */}
        <div className="flex-1 relative min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === 'compare' ? (
              <motion.div
                key="compare"
                className="absolute inset-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CompareView
                  apartments={compareApartments}
                  onRemove={handleRemoveFromCompare}
                  onClose={() => setViewMode('map')}
                />
              </motion.div>
            ) : viewMode === 'map' ? (
              <motion.div
                key="map"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                  <MapView
                    apartments={displayedApartments}
                    favorites={favorites}
                    onSelectApartment={setSelectedApartment}
                  />
                </Suspense>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="absolute inset-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ApartmentListView
                  apartments={displayedApartments}
                  favorites={favorites}
                  onSelectApartment={setSelectedApartment}
                  onToggleFavorite={toggleFavorite}
                  getCommuteInfo={commute.getCommuteInfo}
                  commuteDestination={commute.destination}
                  sortBy={filters.sortBy}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop: Overlay detail card */}
          {selectedApartment && viewMode !== 'compare' && !isMobile && (
            <motion.div
              className="absolute top-4 right-4 z-[1000] w-80"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ApartmentDetailCard
                apartment={selectedApartment}
                isFavorite={isFavorite(selectedApartment.name)}
                onClose={() => setSelectedApartment(null)}
                onToggleFavorite={toggleFavorite}
                customScore={scoreWeights.isCustom ? scoreWeights.calculateScore(selectedApartment) : undefined}
                commuteInfo={commute.getCommuteInfo(selectedApartment)}
                commuteDestination={commute.destination}
                scoreFeedback={scoreFeedback}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile: Bottom sheet detail card */}
      {isMobile && (
        <Drawer.Root
          open={!!selectedApartment && viewMode !== 'compare'}
          onOpenChange={(open) => { if (!open) setSelectedApartment(null); }}
        >
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[999]" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[1000] flex flex-col rounded-t-xl bg-card border-t border-border max-h-[85dvh]">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/30 my-3" />
              {selectedApartment && (
                <div className="flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
                  <ApartmentDetailCard
                    apartment={selectedApartment}
                    isFavorite={isFavorite(selectedApartment.name)}
                    onClose={() => setSelectedApartment(null)}
                    onToggleFavorite={toggleFavorite}
                    customScore={scoreWeights.isCustom ? scoreWeights.calculateScore(selectedApartment) : undefined}
                    commuteInfo={commute.getCommuteInfo(selectedApartment)}
                    commuteDestination={commute.destination}
                    scoreFeedback={scoreFeedback}
                    isBottomSheet
                  />
                </div>
              )}
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </div>
  );
}
