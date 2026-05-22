import { type Apartment, SCORE_WEIGHT_LABELS } from '@/data/apartments';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Star, Heart, Info, Car, Train } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScoreFeedback } from '@/components/ScoreFeedback';
import type { useScoreFeedback } from '@/hooks/use-score-feedback';
import type { CommuteDestination } from '@/hooks/use-commute';

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
  customScore?: number;
  commuteInfo?: { miles: number; driveMinutes: number; transitMinutes: number } | null;
  commuteDestination?: CommuteDestination | null;
  scoreFeedback: ReturnType<typeof useScoreFeedback>;
  isBottomSheet?: boolean;
}

export function ApartmentDetailCard({
  apartment,
  isFavorite,
  onClose,
  onToggleFavorite,
  customScore,
  commuteInfo,
  commuteDestination,
  scoreFeedback,
  isBottomSheet,
}: ApartmentDetailCardProps) {
  const displayScore = customScore ?? apartment.overallScore;

  const content = (
    <div className="space-y-0">
      {/* Header */}
      <div className={`p-5 pb-4 ${isBottomSheet ? '' : 'bg-muted/30 border-b border-border/50'} relative`}>
        {!isBottomSheet && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-red-400"
              onClick={() => onToggleFavorite(apartment.name)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={onClose}
              aria-label="Close detail card"
            >
              <span className="text-lg leading-none">&times;</span>
            </Button>
          </div>
        )}
        <div className={`${isBottomSheet ? 'pr-0' : 'pr-20'}`}>
          <h3 className="text-lg font-bold leading-tight">{apartment.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{apartment.address}</p>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-primary text-primary-foreground font-bold px-2.5 py-1 flex items-center gap-1 cursor-help">
                <Star className="w-3 h-3 fill-current" />
                {displayScore}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-semibold mb-1">Score Breakdown</p>
              {customScore ? (
                <p className="text-xs text-primary mb-1">Using your custom weights</p>
              ) : null}
              {SCORE_WEIGHT_LABELS.map(({ label, weight }) => (
                <p key={label} className="text-xs">
                  {label}: {Math.round(weight * 100)}% weight
                </p>
              ))}
            </TooltipContent>
          </Tooltip>
          <span className="text-xs text-muted-foreground">{apartment.neighborhood}</span>
          {isBottomSheet && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-auto text-muted-foreground hover:text-red-400"
              onClick={() => onToggleFavorite(apartment.name)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">
        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Rent Range</p>
            <p className="font-semibold text-primary">${apartment.rentMin}{apartment.rentMax ? ` – $${apartment.rentMax}` : '+'}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Unit Types</p>
            <p className="font-medium">{apartment.unitTypes}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Laundry</p>
            <p className="font-medium">{apartment.washerDryer}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Google Rating</p>
            <p className="font-medium">{apartment.googleRating ? `${apartment.googleRating} ★` : '—'}</p>
          </div>
        </div>

        {/* Commute Info */}
        {commuteInfo && commuteDestination && (
          <div className="bg-muted/50 p-4 rounded-lg border border-border/50 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Commute to {commuteDestination.label}
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold text-primary">{commuteInfo.miles}</p>
                <p className="text-xs text-muted-foreground">miles</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  <Car className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xl font-bold">{commuteInfo.driveMinutes}</p>
                </div>
                <p className="text-xs text-muted-foreground">min drive</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  <Train className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xl font-bold">{commuteInfo.transitMinutes}</p>
                </div>
                <p className="text-xs text-muted-foreground">min transit</p>
              </div>
            </div>
          </div>
        )}

        {/* Scores with Feedback */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Scores</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Each score is rated 1–10. Tap 👍/👎 if a score feels off.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {[
            { label: 'Safety', key: 'safety', score: apartment.safetyScore },
            { label: 'Walkability', key: 'walkability', score: apartment.walkabilityScore },
            { label: 'Transit', key: 'transit', score: apartment.transitScore },
            { label: 'Entertainment', key: 'entertainment', score: apartment.entertainmentScore },
          ].map(item => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  <ScoreFeedback
                    apartmentName={apartment.name}
                    category={item.key}
                    currentFeedback={scoreFeedback.getFeedback(apartment.name, item.key)}
                    onFeedback={scoreFeedback.setScoreFeedback}
                  />
                  <span className="text-sm font-semibold tabular-nums" style={{ color: getMarkerColor(item.score) }}>
                    {item.score}/10
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
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

        {/* Notes & Area */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground border-b border-border pb-2">Notes & Area</p>
          <p className="text-sm leading-relaxed">{apartment.notes}</p>
          <div className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50">
            <span className="font-semibold block mb-1">Nearby Attractions:</span>
            <span className="text-muted-foreground">{apartment.nearbyAttractions}</span>
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10" asChild>
          <a href={apartment.url} target="_blank" rel="noopener noreferrer">
            View Listing <ArrowUpRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </div>
    </div>
  );

  if (isBottomSheet) {
    return content;
  }

  return (
    <Card className="bg-card border-border shadow-2xl overflow-hidden flex flex-col sm:max-h-[calc(100dvh-6rem)]">
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        {content}
      </div>
    </Card>
  );
}
