import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import type { DestinationConfig } from '@/components/map/EscapeMapAdapter';

export interface DestinationBrowserProps {
  destinations: DestinationConfig[];
}

interface DestinationGroup {
  label: string;
  destinations: DestinationConfig[];
}

function groupAndSort(destinations: DestinationConfig[]): DestinationGroup[] {
  const us: DestinationConfig[] = [];
  const international: DestinationConfig[] = [];

  for (const dest of destinations) {
    if (dest.scope === 'us') {
      us.push(dest);
    } else {
      international.push(dest);
    }
  }

  const sortAlpha = (a: DestinationConfig, b: DestinationConfig) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase());

  us.sort(sortAlpha);
  international.sort(sortAlpha);

  const groups: DestinationGroup[] = [];
  if (us.length > 0) {
    groups.push({ label: 'US', destinations: us });
  }
  if (international.length > 0) {
    groups.push({ label: 'International', destinations: international });
  }

  return groups;
}

function DestinationLink({ destination }: { destination: DestinationConfig }) {
  return (
    <a
      href={`/escape/destinations/${destination.slug}`}
      className={cn(
        'group block rounded-lg border p-4 transition-colors',
        'bg-[var(--surface-elevated)] border-[var(--border-subtle)]',
        'hover:border-[var(--accent-primary)] hover:bg-[var(--surface-base)]'
      )}
    >
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-[var(--accent-primary)]" />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] font-[family-name:var(--font-heading,Playfair_Display)] group-hover:text-[var(--accent-primary)] transition-colors">
            {destination.name}
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
            {destination.description}
          </p>
        </div>
      </div>
    </a>
  );
}

export function DestinationBrowser({ destinations }: DestinationBrowserProps) {
  const groups = useMemo(() => groupAndSort(destinations), [destinations]);

  if (destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[var(--text-muted)]">
          No destinations available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.label}>
          <h2 className="text-lg font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading,Playfair_Display)] mb-4">
            {group.label}
          </h2>
          {/* Mobile: single column scrollable list; Tablet (768px+): 2 columns; Desktop (1024px+): 3 columns */}
          <div
            className={cn(
              'grid gap-3',
              'grid-cols-1',
              'md:grid-cols-2',
              'lg:grid-cols-3'
            )}
          >
            {group.destinations.map((destination) => (
              <DestinationLink key={destination.slug} destination={destination} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
