import { useState, useMemo } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import type { CityConfig } from '@/components/map/LiveMapAdapter';

export interface CitySelectorProps {
  cities: CityConfig[];
  currentCity: string; // slug
}

/**
 * Sorts cities alphabetically by name (case-insensitive).
 */
export function sortCitiesAlphabetically(cities: CityConfig[]): CityConfig[] {
  return [...cities].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );
}

/**
 * CitySelector — Renders a city picker for the /live vertical.
 * Desktop: dropdown (Select) in toolbar area.
 * Mobile: full-width bottom sheet via vaul Drawer.
 * Navigates to `/live/[city-slug]` on selection.
 */
export function CitySelector({ cities, currentCity }: CitySelectorProps) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sortedCities = useMemo(() => sortCitiesAlphabetically(cities), [cities]);

  const currentCityConfig = useMemo(
    () => sortedCities.find((c) => c.slug === currentCity),
    [sortedCities, currentCity]
  );

  const handleCitySelect = (slug: string) => {
    if (slug !== currentCity) {
      window.location.href = `/live/${slug}`;
    }
  };

  if (isMobile) {
    return (
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-between gap-2',
              'border-[var(--border-subtle)] bg-[var(--surface-elevated)]',
              'text-[var(--text-primary)]'
            )}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="truncate">
                {currentCityConfig?.name ?? 'Select city'}
              </span>
            </span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-[var(--surface-elevated)] border-[var(--border-subtle)]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-base font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading,Playfair_Display)]">
              Select City
            </DrawerTitle>
            <DrawerDescription className="text-sm text-[var(--text-secondary)]">
              Choose a city to explore apartments
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <ul className="space-y-1" role="listbox" aria-label="City list">
              {sortedCities.map((city) => (
                <li key={city.slug}>
                  <button
                    role="option"
                    aria-selected={city.slug === currentCity}
                    onClick={() => {
                      handleCitySelect(city.slug);
                      setDrawerOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-3 rounded-md text-left transition-colors',
                      'min-h-[44px]',
                      city.slug === currentCity
                        ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                        : 'text-[var(--text-primary)] hover:bg-[var(--surface-base)]'
                    )}
                  >
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">{city.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: dropdown select in toolbar area
  return (
    <Select value={currentCity} onValueChange={handleCitySelect}>
      <SelectTrigger
        className={cn(
          'w-[180px] gap-2',
          'border-[var(--border-subtle)] bg-[var(--surface-elevated)]',
          'text-[var(--text-primary)]'
        )}
        aria-label="Select city"
      >
        <MapPin className="w-4 h-4 shrink-0 text-[var(--accent-primary)]" />
        <SelectValue placeholder="Select city" />
      </SelectTrigger>
      <SelectContent className="bg-[var(--surface-elevated)] border-[var(--border-subtle)]">
        {sortedCities.map((city) => (
          <SelectItem
            key={city.slug}
            value={city.slug}
            className="text-[var(--text-primary)]"
          >
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
