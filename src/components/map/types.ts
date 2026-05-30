import type L from 'leaflet';
import type React from 'react';

// --- Core Interfaces ---

export interface MarkerDescriptor {
  id: string;
  position: { lat: number; lng: number };
  label: string;
  category: string;
  metadata: Record<string, unknown>;
}

export interface MapThemeConfig {
  tileUrl: string;
  clusterBgColor: string;
  clusterBorderColor: string;
  clusterTextColor: string;
  overlayBgColor: string;
}

export interface UnifiedMapProps {
  center: [number, number];
  zoom: number;
  markers: MarkerDescriptor[];
  clusterThreshold?: number;
  markerRenderer?: (descriptor: MarkerDescriptor) => L.Icon | L.DivIcon;
  onMarkerSelect?: (descriptor: MarkerDescriptor) => void;
  theme?: MapThemeConfig;
  disableDoubleTapZoom?: boolean;
  flyTo?: { center: [number, number]; zoom: number };
  children?: React.ReactNode;
}

// --- Default Theme Configs ---

export const LIVE_THEME: MapThemeConfig = {
  tileUrl: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
  clusterBgColor: 'var(--palette-accent-primary)',
  clusterBorderColor: '#ffffff',
  clusterTextColor: '#ffffff',
  overlayBgColor: 'var(--palette-surface-base)',
};

export const ESCAPE_THEME: MapThemeConfig = {
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  clusterBgColor: 'var(--palette-accent-primary)',
  clusterBorderColor: '#ffffff',
  clusterTextColor: '#ffffff',
  overlayBgColor: 'var(--palette-surface-base)',
};

// --- Vacation Categories ---

export const VACATION_CATEGORIES = [
  'retreat',
  'cruise',
  'resort',
  'villa',
  'glamping',
  'adventure',
  'wellness',
] as const;

export type VacationCategory = (typeof VACATION_CATEGORIES)[number];

// --- Category Icon Mapping ---

export const CATEGORY_ICONS: Record<VacationCategory, { shape: string; color: string }> = {
  retreat: { shape: 'cabin', color: '#6b7c5a' },
  cruise: { shape: 'ship', color: '#3b82f6' },
  resort: { shape: 'palm', color: '#eab308' },
  villa: { shape: 'house', color: '#a0543a' },
  glamping: { shape: 'tent', color: '#8b5cf6' },
  adventure: { shape: 'compass', color: '#f97316' },
  wellness: { shape: 'lotus', color: '#14b8a6' },
};
