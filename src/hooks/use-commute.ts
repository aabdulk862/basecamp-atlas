import { useState, useCallback, useMemo } from 'react';
import type { Apartment } from '@/data/apartments';

export interface CommuteDestination {
  label: string;
  lat: number;
  lng: number;
}

const STORAGE_KEY = 'charlotte-apt-commute';

// Preset destinations in Charlotte
export const PRESET_DESTINATIONS: CommuteDestination[] = [
  { label: 'Uptown Charlotte', lat: 35.2271, lng: -80.8431 },
  { label: 'SouthPark Mall', lat: 35.1535, lng: -80.8279 },
  { label: 'Charlotte Douglas Airport', lat: 35.2140, lng: -80.9431 },
  { label: 'UNC Charlotte', lat: 35.3076, lng: -80.7335 },
  { label: 'Atrium Health Midtown', lat: 35.2113, lng: -80.8402 },
  { label: 'Ballantyne', lat: 35.0535, lng: -80.8454 },
];

function getDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Rough estimate: city driving averages ~20mph, transit ~12mph
function estimateDriveMinutes(miles: number): number {
  return Math.round(miles / 20 * 60);
}

function estimateTransitMinutes(miles: number): number {
  return Math.round(miles / 12 * 60);
}

function loadDestination(): CommuteDestination | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
}

export function useCommute() {
  const [destination, setDestinationState] = useState<CommuteDestination | null>(loadDestination);

  const setDestination = useCallback((dest: CommuteDestination | null) => {
    setDestinationState(dest);
    if (dest) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dest));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const getCommuteInfo = useCallback((apt: Apartment) => {
    if (!destination) return null;
    const miles = getDistanceMiles(apt.lat, apt.lng, destination.lat, destination.lng);
    return {
      miles: Math.round(miles * 10) / 10,
      driveMinutes: estimateDriveMinutes(miles),
      transitMinutes: estimateTransitMinutes(miles),
    };
  }, [destination]);

  return {
    destination,
    setDestination,
    getCommuteInfo,
    presets: PRESET_DESTINATIONS,
  };
}
