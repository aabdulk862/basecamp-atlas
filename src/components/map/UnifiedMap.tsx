import { MapContainer, TileLayer, Marker, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useEffect } from 'react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { UnifiedMapProps, MapThemeConfig } from '@/components/map/types';
import { LIVE_THEME } from '@/components/map/types';
import { cn } from '@/lib/utils';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DEFAULT_CLUSTER_THRESHOLD = 10;

/**
 * MapController — Internal component that listens for flyTo prop changes
 * and animates the map to the new position.
 */
function MapController({ flyTo }: { flyTo?: { center: [number, number]; zoom: number } }) {
  const map = useMap();

  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo.center, flyTo.zoom, { duration: 1.5 });
    }
  }, [flyTo, map]);

  return null;
}

/**
 * Creates a cluster icon styled with the provided theme tokens.
 * Minimum size is 40px which satisfies the 36px mobile tap target requirement (Req 10.9).
 */
function createThemedClusterIcon(theme: MapThemeConfig) {
  return (cluster: any) => {
    const count = cluster.getChildCount();
    // Minimum 40px ensures ≥36px tap target on mobile (Req 10.9)
    const size = count < 10 ? 40 : count < 20 ? 46 : 52;
    return L.divIcon({
      html: `<div style="
        background: ${theme.clusterBgColor};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.clusterTextColor};
        font-weight: 800;
        font-size: ${count < 10 ? '14' : '15'}px;
        font-family: 'Jost', 'Inter', sans-serif;
        border: 3px solid ${theme.clusterBorderColor};
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      ">${count}</div>`,
      className: 'custom-cluster-icon',
      iconSize: L.point(size, size),
      iconAnchor: [size / 2, size / 2],
    });
  };
}

/**
 * UnifiedMap — A generic, prop-driven react-leaflet wrapper that renders
 * geographic markers for any vertical. Configured via props for center,
 * zoom, tile style, marker rendering, and clustering behavior.
 *
 * Mobile behavior:
 * - `touch-action: none` on the container prevents page scroll during pan/zoom (Req 9.7)
 * - Single-finger pan and two-finger pinch-to-zoom enabled via `dragging` and `touchZoom` (Req 9.3)
 * - `disableDoubleTapZoom` prop disables double-tap zoom to prevent conflict with browser zoom (Req 9.3)
 * - Container uses full width and min-height 50vh on mobile viewports (Req 9.1)
 * - Cluster icons use minimum 40px diameter, exceeding the 36px mobile tap target (Req 10.9)
 */
export function UnifiedMap({
  center,
  zoom,
  markers,
  clusterThreshold = DEFAULT_CLUSTER_THRESHOLD,
  markerRenderer,
  onMarkerSelect,
  theme = LIVE_THEME,
  disableDoubleTapZoom = false,
  flyTo,
  children,
}: UnifiedMapProps) {
  const shouldCluster = markers.length > clusterThreshold;

  const renderMarkers = () =>
    markers.map((descriptor) => {
      const icon = markerRenderer
        ? markerRenderer(descriptor)
        : undefined;

      return (
        <Marker
          key={descriptor.id}
          position={[descriptor.position.lat, descriptor.position.lng]}
          icon={icon}
          eventHandlers={{
            click: () => {
              onMarkerSelect?.(descriptor);
            },
          }}
        >
          <Tooltip
            direction="auto"
            offset={[0, -14]}
            opacity={0.95}
            className="unified-map-tooltip"
          >
            <span style={{ fontSize: '12px', fontWeight: 500 }}>
              {descriptor.label}
            </span>
          </Tooltip>
        </Marker>
      );
    });

  return (
    <div
      className={cn(
        'h-full w-full',
        // Mobile: full width and min-height 50vh (Req 9.1)
        'min-h-[50vh] md:min-h-0'
      )}
      style={{
        // Prevent page scroll while user is panning/zooming the map (Req 9.7)
        touchAction: 'none',
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
        doubleClickZoom={!disableDoubleTapZoom}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
      >
        <TileLayer
          attribution={
            theme.tileUrl.includes('google')
              ? '&copy; Google'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
          url={theme.tileUrl}
          maxZoom={20}
        />

        <MapController flyTo={flyTo} />

        <ZoomControl position="bottomright" />

        {shouldCluster ? (
          <MarkerClusterGroup
            iconCreateFunction={createThemedClusterIcon(theme)}
            maxClusterRadius={40}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
          >
            {renderMarkers()}
          </MarkerClusterGroup>
        ) : (
          renderMarkers()
        )}

        {/* Overlay layers (polygons, polylines) rendered outside cluster group */}
        {children}
      </MapContainer>
    </div>
  );
}
