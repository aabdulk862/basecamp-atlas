import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polygon, ZoomControl } from 'react-leaflet';
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
  // Google Maps-style teardrop pin
  const heartRing = isFavorite ? `<div style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;background:#ef4444;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:8px;">♥</div>` : '';
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
};

const createRailIcon = (line: 'blue' | 'gold') => {
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
};

// Custom cluster icon
const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 40 : count < 20 ? 46 : 52;
  return L.divIcon({
    html: `<div style="
      background: #1d4ed8;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: ${count < 10 ? '14' : '15'}px;
      font-family: 'Inter', sans-serif;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35), 0 0 0 2px rgba(29,78,216,0.3);
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
        () => {},
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
      {/* Satellite tiles with labels */}
      <TileLayer
        attribution='&copy; Google'
        url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        maxZoom={20}
      />

      {/* Zoom control - bottom right like Google Maps */}
      <ZoomControl position="bottomright" />

      {/* Current location pin */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={L.divIcon({
            className: 'custom-leaflet-icon',
            html: `<div style="
              width: 20px;
              height: 20px;
              background: #4285F4;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 0 0 2px rgba(66,133,244,0.3), 0 2px 6px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })}
        >
          <Tooltip direction="top" offset={[0, -14]} opacity={0.95}>
            <span style={{ fontSize: '12px', fontWeight: 500 }}>Your location</span>
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
              <div style={{ minWidth: '150px', padding: '4px 2px' }}>
                <strong style={{ fontSize: '13px', display: 'block' }}>{apt.name}</strong>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '3px' }}>{apt.neighborhood}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>${apt.rentMin}{apt.rentMax ? `–$${apt.rentMax}` : '+'}</span>
                  <span style={{ color: getMarkerColor(apt.overallScore) }}>★ {apt.overallScore}</span>
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
          <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
            <div style={{ padding: '2px 0' }}>
              <strong style={{ fontSize: '12px' }}>🚇 {station.name}</strong>
              <div style={{ fontSize: '11px', color: station.line === 'blue' ? '#2563eb' : '#ca8a04', marginTop: '2px' }}>
                {station.line === 'blue' ? 'LYNX Blue Line' : 'CityLYNX Gold Line'}
              </div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
