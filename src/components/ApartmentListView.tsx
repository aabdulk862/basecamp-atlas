import type { Apartment } from '@/data/apartments';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, ArrowUpRight, Star } from 'lucide-react';

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-green-400';
  if (score >= 7) return 'text-lime-400';
  if (score >= 6) return 'text-yellow-400';
  if (score >= 5) return 'text-orange-400';
  return 'text-red-400';
};

interface ApartmentListViewProps {
  apartments: Apartment[];
  favorites: string[];
  onSelectApartment: (apt: Apartment) => void;
  onToggleFavorite: (name: string) => void;
}

export function ApartmentListView({ apartments, favorites, onSelectApartment, onToggleFavorite }: ApartmentListViewProps) {
  if (apartments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No apartments match your filters.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
              <th className="pb-3 pr-2 w-8"></th>
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4 hidden md:table-cell">Neighborhood</th>
              <th className="pb-3 pr-4">Rent</th>
              <th className="pb-3 pr-2 text-center hidden sm:table-cell">Safety</th>
              <th className="pb-3 pr-2 text-center hidden sm:table-cell">Walk</th>
              <th className="pb-3 pr-2 text-center hidden sm:table-cell">Transit</th>
              <th className="pb-3 pr-2 text-center hidden sm:table-cell">Ent.</th>
              <th className="pb-3 pr-2 text-center">Score</th>
              <th className="pb-3 w-8"></th>
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
                  <td className="py-3 pr-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(apt.name);
                      }}
                      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-400 text-red-400' : ''}`} />
                    </Button>
                  </td>
                  <td className="py-3 pr-4">
                    <div>
                      <p className="font-medium truncate max-w-[180px]">{apt.name}</p>
                      <p className="text-xs text-muted-foreground md:hidden">{apt.neighborhood}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell text-muted-foreground">{apt.neighborhood}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    ${apt.rentMin}{apt.rentMax ? ` - $${apt.rentMax}` : '+'}
                  </td>
                  <td className={`py-3 pr-2 text-center hidden sm:table-cell font-medium ${getScoreColor(apt.safetyScore)}`}>
                    {apt.safetyScore}
                  </td>
                  <td className={`py-3 pr-2 text-center hidden sm:table-cell font-medium ${getScoreColor(apt.walkabilityScore)}`}>
                    {apt.walkabilityScore}
                  </td>
                  <td className={`py-3 pr-2 text-center hidden sm:table-cell font-medium ${getScoreColor(apt.transitScore)}`}>
                    {apt.transitScore}
                  </td>
                  <td className={`py-3 pr-2 text-center hidden sm:table-cell font-medium ${getScoreColor(apt.entertainmentScore)}`}>
                    {apt.entertainmentScore}
                  </td>
                  <td className="py-3 pr-2 text-center">
                    <Badge variant="secondary" className={`font-bold ${getScoreColor(apt.overallScore)}`}>
                      <Star className="w-3 h-3 mr-0.5" />
                      {apt.overallScore}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <a
                      href={apt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-primary"
                      aria-label={`View listing for ${apt.name}`}
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
    </ScrollArea>
  );
}
