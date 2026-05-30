import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDriveTime } from '@/lib/drive-time';
import type { RetreatProperty } from '@/hooks/use-retreat-filters';
import { CATEGORY_ICONS, type VacationCategory } from '@/components/map/types';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react';

export interface PropertyCardProperty extends RetreatProperty {
  wowFactor: string;
  coordinates: { lat: number; lng: number };
  nearbyHikes: { name: string; distance?: string }[];
  bookingUrl: string;
}

interface PropertyCardProps {
  property: PropertyCardProperty;
  selectedOrigin: string;
  regionName: string;
}

function getCategoryColor(stayType: string): string {
  const category = stayType.toLowerCase() as VacationCategory;
  return CATEGORY_ICONS[category]?.color ?? '#6b7c5a';
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function PrivacyDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Privacy level ${level} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${
            i < level
              ? 'bg-[var(--accent-primary)]'
              : 'bg-[var(--border-subtle)] opacity-50'
          }`}
        />
      ))}
    </div>
  );
}

export function PropertyCard({ property, selectedOrigin, regionName }: PropertyCardProps) {
  const driveMinutes = property.driveTimes[selectedOrigin];
  const detailUrl = `/escape/${property.region}/${property.slug}`;
  const wowExcerpt =
    property.wowFactor.length > 120
      ? property.wowFactor.slice(0, 120).trimEnd() + '…'
      : property.wowFactor;

  const categoryColor = getCategoryColor(property.stayType);

  return (
    <Card className="bg-[var(--surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading,Playfair_Display)]">
            {property.name}
          </CardTitle>
          <Badge
            className="shrink-0 border-transparent text-[10px] uppercase tracking-wider text-white"
            style={{ backgroundColor: `${categoryColor}20`, color: categoryColor, borderColor: `${categoryColor}40` }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: categoryColor }}
              aria-hidden="true"
            />
            {capitalize(property.stayType)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mt-1">
          <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>{regionName}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Price range */}
        <div className="text-sm">
          <span className="font-semibold text-[var(--accent-primary)]">
            ${property.priceRange.min}–${property.priceRange.max}
          </span>
          <span className="text-[var(--text-muted)]">/night</span>
        </div>

        {/* Privacy dots */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Privacy</span>
          <PrivacyDots level={property.privacyLevel} />
        </div>

        {/* Drive time from selected origin */}
        {driveMinutes !== undefined && (
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>{formatDriveTime(driveMinutes)} drive</span>
          </div>
        )}

        {/* Wow factor excerpt */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
          {wowExcerpt}
        </p>

        {/* Detail page link */}
        <a
          href={detailUrl}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-primary)] hover:text-[var(--accent-tertiary)] transition-colors"
        >
          View details
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </CardContent>
    </Card>
  );
}
