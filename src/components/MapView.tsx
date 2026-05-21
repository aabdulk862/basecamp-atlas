import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { Apartment } from '@/data/apartments';

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
  const border = isFavorite ? '3px solid #f87171' : '3px solid white';
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: ${border}; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

interface MapViewProps {
  apartments: Apartment[];
  favorites: string[];
  onSelectApartment: (apt: Apartment) => void;
}

export function MapView({ apartments, favorites, onSelectApartment }: MapViewProps) {
  return (
    <MapContainer
      center={[35.205, -80.845]}
      zoom={12}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

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
    </MapContainer>
  );
}
