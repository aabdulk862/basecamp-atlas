import { type Apartment, SCORE_WEIGHT_LABELS } from '@/data/apartments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight, Star, Heart, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const getMarkerColor = (score: number) => {
  if (score >= 8) return '#22c55e';
  if (score >= 7) return '#84cc16';
  if (score >= 6) return '#eab308';
  if (score >= 5) return '#f97316';
  return '#ef4444';
};

interface ApartmentDetailCardProps {
  apartment: Apartment;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (name: string) => void;
}

export function ApartmentDetailCard({ apartment, isFavorite, onClose, onToggleFavorite }: ApartmentDetailCardProps) {
  return (
    <Card className="bg-card border-border shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)]">
      <CardHeader className="bg-muted/30 pb-4 relative">
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-red-400"
            onClick={() => onToggleFavorite(apartment.name)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onClose}
            aria-label="Close detail card"
          >
            <span className="text-lg leading-none">&times;</span>
          </Button>
        </div>
        <div className="flex justify-between items-start pr-16">
          <div>
            <CardTitle className="text-xl font-bold leading-tight">{apartment.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{apartment.address}</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-primary text-primary-foreground font-bold px-2 py-1 flex items-center gap-1 cursor-help">
                <Star className="w-3 h-3 fill-current" />
                {apartment.overallScore}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="font-semibold mb-1">Score Breakdown</p>
              {SCORE_WEIGHT_LABELS.map(({ label, weight }) => (
                <p key={label} className="text-xs">
                  {label}: {Math.round(weight * 100)}% weight
                </p>
              ))}
              <p className="text-xs mt-1 text-muted-foreground border-t border-border pt-1">
                Formula: (Safety×0.3) + (Walk×0.3) + (Transit×0.2) + (Ent×0.2)
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Neighborhood</p>
              <p className="font-medium">{apartment.neighborhood}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Rent Range</p>
              <p className="font-medium">${apartment.rentMin} {apartment.rentMax ? `- $${apartment.rentMax}` : '+'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Unit Types</p>
              <p className="font-medium">{apartment.unitTypes}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Laundry</p>
              <p className="font-medium">{apartment.washerDryer}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-1 border-b border-border pb-1">
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Scores</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Each score is rated 1-10 based on neighborhood data</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {[
              { label: 'Safety', score: apartment.safetyScore },
              { label: 'Walkability', score: apartment.walkabilityScore },
              { label: 'Transit', score: apartment.transitScore },
              { label: 'Entertainment', score: apartment.entertainmentScore },
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.score}/10</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.score / 10) * 100}%`,
                      backgroundColor: getMarkerColor(item.score)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border pb-1">Notes & Area</p>
            <p className="text-sm leading-relaxed">{apartment.notes}</p>
            <div className="text-sm bg-muted/50 p-3 rounded-md border border-border/50">
              <span className="font-semibold block mb-1">Nearby Attractions:</span>
              <span className="text-muted-foreground">{apartment.nearbyAttractions}</span>
            </div>
          </div>

          <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a href={apartment.url} target="_blank" rel="noopener noreferrer">
              View Listing <ArrowUpRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
