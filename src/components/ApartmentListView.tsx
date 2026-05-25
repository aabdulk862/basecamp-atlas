import { useState, useRef, useCallback } from 'react';
import type { Apartment } from '@/data/apartments';
import type { CommuteDestination } from '@/hooks/use-commute';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ArrowUpRight, Star, MapPin, Download, Car, RefreshCw } from 'lucide-react';
import { ListSkeleton, TableSkeleton } from '@/components/ListSkeleton';

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-green-400';
  if (score >= 7) return 'text-lime-400';
  if (score >= 6) return 'text-yellow-400';
  if (score >= 5) return 'text-orange-400';
  return 'text-red-400';
};

const getScoreBg = (score: number) => {
  if (score >= 8) return 'bg-green-400/10';
  if (score >= 7) return 'bg-lime-400/10';
  if (score >= 6) return 'bg-yellow-400/10';
  if (score >= 5) return 'bg-orange-400/10';
  return 'bg-red-400/10';
};

interface ApartmentListViewProps {
  apartments: Apartment[];
  favorites: string[];
  onSelectApartment: (apt: Apartment) => void;
  onToggleFavorite: (name: string) => void;
  getCommuteInfo?: (apt: Apartment) => { miles: number; driveMinutes: number; transitMinutes: number } | null;
  commuteDestination?: CommuteDestination | null;
  isLoading?: boolean;
  sortBy?: string;
}

function downloadCSV(apartments: Apartment[], favorites: string[]) {
  const headers = ['Name', 'Neighborhood', 'Address', 'Rent Min', 'Rent Max', 'Unit Types', 'Washer/Dryer', 'Safety', 'Walkability', 'Transit', 'Entertainment', 'Overall Score', 'Favorited', 'Website', 'Notes'];
  const rows = apartments.map(apt => [
    apt.name,
    apt.neighborhood,
    apt.address,
    apt.rentMin,
    apt.rentMax ?? '',
    apt.unitTypes,
    apt.washerDryer,
    apt.safetyScore,
    apt.walkabilityScore,
    apt.transitScore,
    apt.entertainmentScore,
    apt.overallScore,
    favorites.includes(apt.name) ? 'Yes' : 'No',
    apt.url,
    apt.notes,
  ]);

  const csv = [headers, ...rows].map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'basecamp-atlas-apartments.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Sort indicator arrow
function SortArrow({ column, currentSort }: { column: string; currentSort?: string }) {
  const isActive = currentSort === column;
  if (!isActive) return null;
  return <span className="ml-0.5 text-primary">↓</span>;
}

export function ApartmentListView({ apartments, favorites, onSelectApartment, onToggleFavorite, getCommuteInfo, commuteDestination, isLoading, sortBy }: ApartmentListViewProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0 && scrollRef.current && scrollRef.current.scrollTop === 0) {
      setPullDistance(Math.min(diff * 0.4, 60));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 40) {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 800);
    } else {
      setPullDistance(0);
    }
    isPulling.current = false;
  }, [pullDistance]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 shrink-0">
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
        </div>
        <ListSkeleton />
        <TableSkeleton />
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No apartments match your filters.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with count and download */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 shrink-0">
        <span className="text-xs text-muted-foreground">{apartments.length} apartments</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => downloadCSV(apartments, favorites)}
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          Export CSV
        </Button>
      </div>

      {/* Mobile: Card layout with native scroll + pull-to-refresh */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain sm:hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull-to-refresh indicator */}
        {(pullDistance > 0 || isRefreshing) && (
          <div
            className="flex items-center justify-center transition-all duration-200"
            style={{ height: isRefreshing ? 40 : pullDistance }}
          >
            <RefreshCw className={`w-4 h-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`} style={{ opacity: Math.min(pullDistance / 40, 1) }} />
          </div>
        )}

        <div className="p-3 space-y-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {apartments.map((apt) => {
            const isFav = favorites.includes(apt.name);
            return (
              <div
                key={apt.name}
                className="bg-card border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/30 transition-colors active:bg-muted/50"
                onClick={() => onSelectApartment(apt)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">{apt.name}</p>
                      <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 shrink-0 ${getScoreColor(apt.overallScore)} ${getScoreBg(apt.overallScore)}`}>
                        {apt.overallScore}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{apt.neighborhood} · {apt.address}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(apt.name);
                    }}
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-red-400 text-red-400' : ''}`} />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                      ${apt.rentMin}{apt.rentMax ? `–$${apt.rentMax}` : '+'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{apt.unitTypes}</span>
                  </div>
                  <a
                    href={apt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
                  >
                    Website <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs">
                  <span className={getScoreColor(apt.safetyScore)}>Safe: {apt.safetyScore}</span>
                  <span className={getScoreColor(apt.walkabilityScore)}>Walk: {apt.walkabilityScore}</span>
                  <span className={getScoreColor(apt.transitScore)}>Transit: {apt.transitScore}</span>
                  <span className={getScoreColor(apt.entertainmentScore)}>Ent: {apt.entertainmentScore}</span>
                  {getCommuteInfo && commuteDestination && (() => {
                    const info = getCommuteInfo(apt);
                    if (!info) return null;
                    return (
                      <span className="text-muted-foreground flex items-center gap-0.5">
                        <Car className="w-3 h-3" /> {info.driveMinutes}min
                      </span>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Table layout with sticky header */}
      <div className="flex-1 overflow-auto hidden sm:block">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-10 border-b border-border">
            <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-4 w-8"></th>
              <th className="py-3 pr-3">Name</th>
              <th className="py-3 pr-3 hidden md:table-cell">
                Neighborhood<SortArrow column="Neighborhood" currentSort={sortBy} />
              </th>
              <th className="py-3 pr-3">
                Rent<SortArrow column="Rent Low-High" currentSort={sortBy} />
                <SortArrow column="Rent High-Low" currentSort={sortBy} />
              </th>
              <th className="py-3 pr-3 hidden md:table-cell">Units</th>
              <th className="py-3 pr-2 text-center hidden lg:table-cell">
                Safe<SortArrow column="Safety" currentSort={sortBy} />
              </th>
              <th className="py-3 pr-2 text-center hidden lg:table-cell">
                Walk<SortArrow column="Walkability" currentSort={sortBy} />
              </th>
              <th className="py-3 pr-2 text-center hidden lg:table-cell">
                Trans<SortArrow column="Transit" currentSort={sortBy} />
              </th>
              <th className="py-3 pr-2 text-center hidden lg:table-cell">
                Ent<SortArrow column="Entertainment" currentSort={sortBy} />
              </th>
              <th className="py-3 pr-2 text-center">
                Score<SortArrow column="Overall Score" currentSort={sortBy} />
              </th>
              <th className="py-3 pr-4 text-center">Link</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apt) => {
              const isFav = favorites.includes(apt.name);
              return (
                <tr
                  key={apt.name}
                  className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => onSelectApartment(apt)}
                >
                  <td className="py-2.5 px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(apt.name);
                      }}
                      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-400 text-red-400' : ''}`} />
                    </Button>
                  </td>
                  <td className="py-2.5 pr-3">
                    <div>
                      <p className="font-medium truncate max-w-[200px]">{apt.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px] md:hidden">{apt.neighborhood}</p>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 hidden md:table-cell text-muted-foreground text-xs">{apt.neighborhood}</td>
                  <td className="py-2.5 pr-3 whitespace-nowrap font-medium">
                    ${apt.rentMin}{apt.rentMax ? `–$${apt.rentMax}` : '+'}
                  </td>
                  <td className="py-2.5 pr-3 hidden md:table-cell text-xs text-muted-foreground">{apt.unitTypes}</td>
                  <td className={`py-2.5 pr-2 text-center hidden lg:table-cell font-medium ${getScoreColor(apt.safetyScore)}`}>
                    {apt.safetyScore}
                  </td>
                  <td className={`py-2.5 pr-2 text-center hidden lg:table-cell font-medium ${getScoreColor(apt.walkabilityScore)}`}>
                    {apt.walkabilityScore}
                  </td>
                  <td className={`py-2.5 pr-2 text-center hidden lg:table-cell font-medium ${getScoreColor(apt.transitScore)}`}>
                    {apt.transitScore}
                  </td>
                  <td className={`py-2.5 pr-2 text-center hidden lg:table-cell font-medium ${getScoreColor(apt.entertainmentScore)}`}>
                    {apt.entertainmentScore}
                  </td>
                  <td className="py-2.5 pr-2 text-center">
                    <Badge variant="secondary" className={`font-bold ${getScoreColor(apt.overallScore)}`}>
                      <Star className="w-3 h-3 mr-0.5" />
                      {apt.overallScore}
                    </Badge>
                  </td>
                  <td className="py-2.5 pr-4 text-center">
                    <a
                      href={apt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center h-7 w-7 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      aria-label={`Visit ${apt.name} website`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
