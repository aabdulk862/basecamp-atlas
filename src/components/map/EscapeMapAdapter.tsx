import { useMemo, useCallback } from 'react';
import L from 'leaflet';
import { UnifiedMap } from '@/components/map/UnifiedMap';
import { ESCAPE_THEME, CATEGORY_ICONS } from '@/components/map/types';
import type { MarkerDescriptor, VacationCategory } from '@/components/map/types';
import type { SerializedProperty } from '@/components/retreat/RetreatBrowse';
import type { RetreatFilterState } from '@/hooks/use-retreat-filters';
import { SearchX } from 'lucide-react';

// --- Types ---

export interface DestinationConfig {
  name: string;
  slug: string;
  description: string;
  scope: 'us' | 'international';
  center: { lat: number; lng: number };
  zoom: number;
}

export interface EscapeMapAdapterProps {
  properties: SerializedProperty[];
  filters?: RetreatFilterState;
  destinationConfig?: DestinationConfig;
  onSelectProperty: (property: SerializedProperty) => void;
  flyTo?: { center: [number, number]; zoom: number };
}

// --- Constants ---

/** Default center (continental US) when no destination config is provided */
const DEFAULT_CENTER: [number, number] = [39.8283, -98.5795];
const DEFAULT_ZOOM = 4;

// --- SVG Shape Generators ---

function getCategoryShapeSvg(shape: string): string {
  switch (shape) {
    case 'cabin':
      return '<path d="M12 2L2 10h3v8h14v-8h3L12 2z" fill="currentColor"/>';
    case 'ship':
      return '<path d="M4 18l1-4h14l1 4H4zm2-6h12l-1-4H7L6 12zm5-8l-3 4h8l-3-4z" fill="currentColor"/>';
    case 'palm':
      return '<path d="M12 22V12m0 0c-3-2-6-1-7 1m7-1c3-2 6-1 7 1m-7-1c-1-3 0-6 2-7m-2 7c1-3 0-6-2-7" stroke="currentColor" stroke-width="2" fill="none"/>';
    case 'house':
      return '<path d="M3 12l9-9 9 9M5 10v10h14V10" fill="currentColor"/>';
    case 'tent':
      return '<path d="M12 2L3 20h18L12 2zm0 6v8M8 16h8" stroke="currentColor" stroke-width="1.5" fill="none"/>';
    case 'compass':
      return '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 3v2m0 14v2M3 12h2m14 0h2M16 8l-4 4-4 4m0-8l4 4 4 4" fill="currentColor"/>';
    case 'lotus':
      return '<path d="M12 20c-2-3-6-6-6-10a6 6 0 0112 0c0 4-4 7-6 10z" fill="currentColor"/><path d="M12 20c-4-2-8-3-9-6 2 1 5 1 9-2m0 8c4-2 8-3 9-6-2 1-5 1-9-2" stroke="currentColor" stroke-width="1" fill="none"/>';
    default:
      return '<circle cx="12" cy="12" r="8" fill="currentColor"/>';
  }
}

// --- Marker Icon Factory ---

/**
 * Creates a Leaflet DivIcon with a category-specific shape and color.
 */
function createCategoryIcon(category: string): L.DivIcon {
  const iconConfig = CATEGORY_ICONS[category as VacationCategory] ?? {
    shape: 'circle',
    color: '#6b7280',
  };

  const shapeSvg = getCategoryShapeSvg(iconConfig.shape);

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: ${iconConfig.color};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      color: white;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" style="color: white;">
        ${shapeSvg}
      </svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

// --- Transformation ---

/**
 * Transforms an array of SerializedProperty objects into MarkerDescriptor objects,
 * filtering out any properties with invalid or missing coordinates.
 */
export function transformPropertiesToMarkers(
  properties: SerializedProperty[]
): MarkerDescriptor[] {
  return properties
    .filter(
      (p) =>
        p.coordinates &&
        typeof p.coordinates.lat === 'number' &&
        typeof p.coordinates.lng === 'number' &&
        !Number.isNaN(p.coordinates.lat) &&
        !Number.isNaN(p.coordinates.lng) &&
        p.coordinates.lat >= -90 &&
        p.coordinates.lat <= 90 &&
        p.coordinates.lng >= -180 &&
        p.coordinates.lng <= 180
    )
    .map((p) => ({
      id: p.slug,
      position: { lat: p.coordinates.lat, lng: p.coordinates.lng },
      label: p.name,
      category: p.stayType,
      metadata: {
        region: p.region,
        priceRange: p.priceRange,
        source: p,
      },
    }));
}

// --- Component ---

/**
 * EscapeMapAdapter — Transforms retreat property data into the generic UnifiedMap format,
 * providing category-specific icons, destination centering, and empty state handling.
 */
export function EscapeMapAdapter({
  properties,
  filters,
  destinationConfig,
  onSelectProperty,
  flyTo,
}: EscapeMapAdapterProps) {
  // If filters are provided, apply them; otherwise use properties as-is
  const filteredProperties = useMemo(() => {
    if (!filters) return properties;

    return properties.filter((property) => {
      // Region filter
      if (filters.regions.length > 0 && !filters.regions.includes(property.region)) {
        return false;
      }

      // Stay type filter (case-insensitive)
      if (filters.stayTypes.length > 0) {
        const propertyType = property.stayType.toLowerCase();
        const matches = filters.stayTypes.some(
          (type) => type.toLowerCase() === propertyType
        );
        if (!matches) return false;
      }

      // Category filter: property.stayType must be in selected categories
      if (filters.categories && filters.categories.length > 0) {
        const propertyCategory = property.stayType.toLowerCase();
        const matchesCategory = filters.categories.some(
          (cat) => cat.toLowerCase() === propertyCategory
        );
        if (!matchesCategory) return false;
      }

      // Price range filter (overlap check)
      if (
        property.priceRange.min > filters.priceRange[1] ||
        property.priceRange.max < filters.priceRange[0]
      ) {
        return false;
      }

      // Drive time filter
      const driveTime = property.driveTimes[filters.selectedOrigin];
      if (driveTime !== undefined && driveTime > filters.maxDriveTime) {
        return false;
      }

      // Privacy filter
      if (property.privacyLevel < filters.minPrivacy) {
        return false;
      }

      // Amenities filter (all selected must be present)
      if (filters.amenities.length > 0) {
        const propertyAmenities = property.amenities.map((a) => a.toLowerCase());
        const allPresent = filters.amenities.every((required) =>
          propertyAmenities.some((pa) => pa.includes(required.toLowerCase()))
        );
        if (!allPresent) return false;
      }

      return true;
    });
  }, [properties, filters]);

  // Transform filtered properties to markers
  const markers = useMemo(
    () => transformPropertiesToMarkers(filteredProperties),
    [filteredProperties]
  );

  // Determine map center and zoom
  const center: [number, number] = destinationConfig
    ? [destinationConfig.center.lat, destinationConfig.center.lng]
    : DEFAULT_CENTER;

  const zoom = destinationConfig ? destinationConfig.zoom : DEFAULT_ZOOM;

  // Category-specific marker renderer
  const markerRenderer = useCallback((descriptor: MarkerDescriptor) => {
    return createCategoryIcon(descriptor.category);
  }, []);

  // Handle marker selection → surface the source property
  const handleMarkerSelect = useCallback(
    (descriptor: MarkerDescriptor) => {
      const property = descriptor.metadata.source as SerializedProperty;
      if (property) {
        onSelectProperty(property);
      }
    },
    [onSelectProperty]
  );

  const isEmpty = markers.length === 0;

  return (
    <div className="relative h-full w-full">
      <UnifiedMap
        center={center}
        zoom={zoom}
        markers={markers}
        markerRenderer={markerRenderer}
        onMarkerSelect={handleMarkerSelect}
        theme={ESCAPE_THEME}
        flyTo={flyTo}
      />

      {/* No results indicator */}
      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-[1000]">
          <div
            className="pointer-events-auto flex flex-col items-center rounded-lg px-6 py-4 shadow-lg"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <SearchX
              className="mb-2 h-8 w-8"
              style={{ color: 'var(--text-muted)' }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              No properties match your filters
            </p>
          </div>
        </div>
      )}


    </div>
  );
}
