import { useState, useCallback } from 'react';
import { EscapeMapAdapter } from '@/components/map/EscapeMapAdapter';
import type { DestinationConfig } from '@/components/map/EscapeMapAdapter';
import { PropertySummaryCard } from '@/components/escape/PropertySummaryCard';
import type { SerializedProperty } from '@/components/retreat/RetreatBrowse';
import type { RetreatFilterState } from '@/hooks/use-retreat-filters';
import { RETREAT_FILTER_DEFAULTS } from '@/hooks/use-retreat-filters';

interface DestinationMapViewProps {
  properties: SerializedProperty[];
  destinationConfig: DestinationConfig;
}

/**
 * DestinationMapView — A wrapper component for the destination detail page
 * that manages filter state and property selection internally.
 * Used with client:visible hydration on the [destination].astro page.
 */
export function DestinationMapView({ properties, destinationConfig }: DestinationMapViewProps) {
  const [filters] = useState<RetreatFilterState>(RETREAT_FILTER_DEFAULTS);
  const [selectedProperty, setSelectedProperty] = useState<SerializedProperty | null>(null);

  const handleSelectProperty = useCallback((property: SerializedProperty) => {
    setSelectedProperty(property);
  }, []);

  const handleDismissCard = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  return (
    <div className="relative h-[calc(100vh-8rem)] w-full rounded-lg overflow-hidden">
      <EscapeMapAdapter
        properties={properties}
        filters={filters}
        destinationConfig={destinationConfig}
        onSelectProperty={handleSelectProperty}
      />

      {/* Property summary card overlay */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 z-[1000]">
          <PropertySummaryCard
            property={selectedProperty}
            onClose={handleDismissCard}
          />
        </div>
      )}
    </div>
  );
}
