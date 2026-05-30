import { useMemo, useCallback } from 'react';
import L from 'leaflet';
import { Marker, Tooltip, Polygon } from 'react-leaflet';
import type { Apartment } from '@/data/apartments';
import { lightRailStations } from '@/data/lightrail';
import { neighborhoodBoundaries } from '@/data/neighborhoods';
import { getScoreColor } from '@/lib/score-color';
import { UnifiedMap } from '@/components/map/UnifiedMap';
import { LIVE_THEME } from '@/components/map/types';
import type { MarkerDescriptor } from '@/components/map/types';

export interface CityConfig {
  name: string;
  slug: string;
  center: { lat: number; lng: number };
  zoom: number;
  dataSource: string;
}

export interface LiveMapAdapterProps {
  apartments: Apartment[];
  favorites: string[];
  onSelectApartment: (apt: Apartment) => void;
  cityConfig: CityConfig;
}

/**
 * Returns true if coordinates are within valid geographic bounds.
 */
function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Transforms an array of Apartment objects into MarkerDescriptor objects,
 * filtering out any apartments with invalid coordinates.
 */
export function transformApartmentsToMarkers(apartments: Apartment[]): MarkerDescriptor[] {
  return apartments
    .filter((apt) => isValidCoordinate(apt.lat, apt.lng))
    .map((apt) => ({
      id: apt.name,
      position: { lat: apt.lat, lng: apt.lng },
      label: apt.name,
      category: 'apartment',
      metadata: {
        overallScore: apt.overallScore,
        neighborhood: apt.neighborhood,
        source: apt,
      },
    }));
}

/**
 * Creates a score-colored teardrop pin DivIcon with an optional heart indicator
 * for favorited apartments.
 */
function createCustomIcon(score: number, isFavorite: boolean): L.DivIcon {
  const color = getScoreColor(score);
  const heartRing = isFavorite
    ? `<div style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;background:#ef4444;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:8px;">♥</div>`
    : '';
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="position:relative;">
      <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.716 23.284 0 15 0z" fill="${color}"/>
        <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.716 23.284 0 15 0z" fill="none" stroke="white" stroke-width="2"/>
        <circle cx="15" cy="14" r="6" fill="white" opacity="0.9"/>
        <text x="15" y="17.5" text-anchor="middle" font-size="9" font-weight="700" font-family="Inter,sans-serif" fill="${color}">${score}</text>
      </svg>
      ${heartRing}
    </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });
}

/**
 * Creates a light rail station icon.
 */
function createRailIcon(line: 'blue' | 'gold'): L.DivIcon {
  const color = line === 'blue' ? '#3b82f6' : '#eab308';
  const label = line === 'blue' ? 'B' : 'G';
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 4px;
      border: 2.5px solid ${color};
      box-shadow: 0 1px 4px rgba(0,0,0,0.35);
      font-size: 10px;
      font-weight: 800;
      font-family: Inter, sans-serif;
      color: ${color};
      line-height: 1;
    ">${label}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
}

/**
 * LiveMapAdapter — Transforms apartment data into the generic UnifiedMap format,
 * preserving score-colored pins, favorites heart indicators, light rail stations,
 * and neighborhood polygon overlays.
 */
export function LiveMapAdapter({
  apartments,
  favorites,
  onSelectApartment,
  cityConfig,
}: LiveMapAdapterProps) {
  const markers = useMemo(
    () => transformApartmentsToMarkers(apartments),
    [apartments]
  );

  const markerRenderer = useCallback(
    (descriptor: MarkerDescriptor) => {
      const score = (descriptor.metadata.overallScore as number) ?? 0;
      const isFavorite = favorites.includes(descriptor.id);
      return createCustomIcon(score, isFavorite);
    },
    [favorites]
  );

  const handleMarkerSelect = useCallback(
    (descriptor: MarkerDescriptor) => {
      const apt = descriptor.metadata.source as Apartment;
      if (apt) {
        onSelectApartment(apt);
      }
    },
    [onSelectApartment]
  );

  return (
    <UnifiedMap
      center={[cityConfig.center.lat, cityConfig.center.lng]}
      zoom={cityConfig.zoom}
      markers={markers}
      markerRenderer={markerRenderer}
      onMarkerSelect={handleMarkerSelect}
      theme={LIVE_THEME}
    >
      {/* Neighborhood boundary overlays */}
      {neighborhoodBoundaries.map((nb) => (
        <Polygon
          key={nb.name}
          positions={nb.coordinates}
          pathOptions={{
            color: nb.color,
            weight: 2,
            opacity: 0.7,
            fillColor: nb.color,
            fillOpacity: 0.08,
          }}
        >
          <Tooltip direction="center" permanent={false} opacity={0.95}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{nb.name}</span>
          </Tooltip>
        </Polygon>
      ))}

      {/* Light rail stations (non-clustered overlay) */}
      {lightRailStations.map((station) => (
        <Marker
          key={`${station.line}-${station.name}`}
          position={[station.lat, station.lng]}
          icon={createRailIcon(station.line)}
        >
          <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
            <div style={{ padding: '2px 0' }}>
              <strong style={{ fontSize: '12px' }}>🚇 {station.name}</strong>
              <div
                style={{
                  fontSize: '11px',
                  color: station.line === 'blue' ? '#2563eb' : '#ca8a04',
                  marginTop: '2px',
                }}
              >
                {station.line === 'blue' ? 'LYNX Blue Line' : 'CityLYNX Gold Line'}
              </div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </UnifiedMap>
  );
}
