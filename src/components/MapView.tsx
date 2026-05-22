import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polygon } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { Apartment } from '@/data/apartments';
import { lightRailStations } from '@/data/lightrail';
import { neighborhoodBoundaries } from '@/data/neighborhoods';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const getMarkerColor = (score: number) => {
  if (score >= 8) return '#22c55e';
  if (score >= 7) return '#84cc16';
  if (score >= 6) return '#eab308';
  if (score >= 5) return '#f97316';
  return '#ef4444';
};

const createCustomIcon = (score: number, isFavorite: boolean) => {
  const color = getMarkerColor(score);
  const border = isFavorite ? '3px solid #f87171' : '3px solid rgba(255,255,255,0.9)';
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 26px; height: 26px; border-radius: 50%; border: ${border}; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  });
};

const createRailIcon = (line: 'blue' | 'gold') => {
  const color = line === 'blue' ? '#3b82f6' : '#eab308';
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 3px; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 1px 3px rgba(0,0,0,0.4); opacity: 0.8;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6],
  });
};

// Custom cluster icon
const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 36 : count < 20 ? 42 : 48;
  return L.divIcon({
    html: `<div style="
      background: rgba(14, 165, 233, 0.85);
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: ${count < 10 ? '13' : '14'}px;
      border: 3px solid rgba(255,255,255,0.9);
      box-shadow: 0 3px 8px rgba(0,0,0,0.4);
    ">${count}</div>`,
    className: 'custom-cluster-icon',
    iconSize: L.point(size, size),
    iconAnchor: [size / 2, size / 2],
  });
};

interface MapViewProps {
  apartments: Apartment[];
  favorites: string[];
  onSelectApartment: (apt: Apartment) => void;
}

export function MapView({ apartments, favorites, onSelectApartment }: MapViewProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          // Permission denied or error — silently ignore
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  return (
    <MapContainer
      center={[35.205, -80.845]}
      zoom={12}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={false}
    >
      {/* Satellite map tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {/* Current location pin */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={L.divIcon({
            className: 'custom-leaflet-icon',
            html: `<div style="font-size: 28px; line-height: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">📍</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
          })}
        >
          <Tooltip direction="top" offset={[0, -28]} opacity={0.9}>
            <span style={{ fontSize: '11px', fontWeight: 600 }}>You are here</span>
          </Tooltip>
        </Marker>
      )}

      {/* Neighborhood boundary overlays */}
      {neighborhoodBoundaries.map((nb) => (
        <Polygon
          key={nb.name}
          positions={nb.coordinates}
          pathOptions={{
            color: nb.color,
            weight: 2,
            opacity: 0.85,
            fillColor: nb.color,
            fillOpacity: 0.12,
          }}
        >
          <Tooltip direction="center" permanent={false} opacity={0.9}>
            <span style={{ fontSize: '11px', fontWeight: 600 }}>{nb.name}</span>
          </Tooltip>
        </Polygon>
      ))}

      {/* Clustered apartment markers */}
      <MarkerClusterGroup
        iconCreateFunction={createClusterIcon}
        maxClusterRadius={40}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        disableClusteringAtZoom={14}
      >
        {apartments.map((apt) => (
          <Marker
            key={apt.name}
            position={[apt.lat, apt.lng]}
            icon={createCustomIcon(apt.overallScore, favorites.includes(apt.name))}
            eventHandlers={{
              click: () => onSelectApartment(apt),
            }}
          >
            <Tooltip direction="top" offset={[0, -14]} opacity={0.95}>
              <div style={{ minWidth: '140px', padding: '2px 0' }}>
                <strong style={{ fontSize: '12px' }}>{apt.name}</strong>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{apt.neighborhood}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '3px' }}>
                  ${apt.rentMin}{apt.rentMax ? `–$${apt.rentMax}` : '+'}
                  <span style={{ float: 'right', color: getMarkerColor(apt.overallScore) }}>★ {apt.overallScore}</span>
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {/* Light rail stations (not clustered) */}
      {lightRailStations.map((station) => (
        <Marker
          key={`${station.line}-${station.name}`}
          position={[station.lat, station.lng]}
          icon={createRailIcon(station.line)}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={0.9}>
            <div style={{ padding: '2px 0' }}>
              <strong style={{ fontSize: '11px' }}>🚇 {station.name}</strong>
              <div style={{ fontSize: '10px', color: station.line === 'blue' ? '#60a5fa' : '#fbbf24', marginTop: '2px' }}>
                {station.line === 'blue' ? 'LYNX Blue Line' : 'CityLYNX Gold Line'}
              </div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
