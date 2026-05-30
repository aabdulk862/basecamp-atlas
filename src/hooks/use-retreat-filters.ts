import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { VacationCategory } from '@/components/map/types';

export interface RetreatFilterState {
  regions: string[];           // Multi-select region slugs
  stayTypes: string[];         // Multi-select stay types
  categories: VacationCategory[]; // Multi-select vacation categories
  priceRange: [number, number]; // $50–$1500, $25 increments
  maxDriveTime: number;        // Minutes, from selected origin
  selectedOrigin: string;      // Origin city slug
  minPrivacy: number;          // 1–5
  amenities: string[];         // Checkbox selections
}

export interface RetreatProperty {
  slug: string;
  name: string;
  region: string;
  stayType: string;
  priceRange: { min: number; max: number };
  driveTimes: Record<string, number>;
  privacyLevel: number;
  amenities: string[];
  [key: string]: unknown;
}

export const RETREAT_FILTER_DEFAULTS: RetreatFilterState = {
  regions: [],
  stayTypes: [],
  categories: [],
  priceRange: [50, 2000],
  maxDriveTime: 720,
  selectedOrigin: 'charlotte',
  minPrivacy: 1,
  amenities: [],
};

function parseFiltersFromURL(): Partial<RetreatFilterState> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const parsed: Partial<RetreatFilterState> = {};

  const regions = params.get('regions');
  if (regions) {
    parsed.regions = regions.split(',').filter(Boolean);
  }

  const stayTypes = params.get('stayTypes');
  const stayType = params.get('stayType');
  if (stayTypes) {
    parsed.stayTypes = stayTypes.split(',').filter(Boolean);
  } else if (stayType) {
    // Support singular ?stayType= as a filter preset (e.g., /escape?stayType=treehouse)
    parsed.stayTypes = [stayType];
  }

  const priceMin = params.get('priceMin');
  const priceMax = params.get('priceMax');
  if (priceMin && priceMax) {
    parsed.priceRange = [Number(priceMin), Number(priceMax)];
  }

  const maxDriveTime = params.get('maxDriveTime');
  if (maxDriveTime) {
    parsed.maxDriveTime = Number(maxDriveTime);
  }

  const selectedOrigin = params.get('origin');
  if (selectedOrigin) {
    parsed.selectedOrigin = selectedOrigin;
  }

  const minPrivacy = params.get('minPrivacy');
  if (minPrivacy) {
    parsed.minPrivacy = Number(minPrivacy);
  }

  const amenities = params.get('amenities');
  if (amenities) {
    parsed.amenities = amenities.split(',').filter(Boolean);
  }

  const categories = params.get('categories');
  if (categories) {
    parsed.categories = categories.split(',').filter(Boolean) as VacationCategory[];
  }

  return parsed;
}

function writeFiltersToURL(state: RetreatFilterState) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();

  if (state.regions.length > 0) {
    params.set('regions', state.regions.join(','));
  }

  if (state.stayTypes.length > 0) {
    params.set('stayTypes', state.stayTypes.join(','));
  }

  if (
    state.priceRange[0] !== RETREAT_FILTER_DEFAULTS.priceRange[0] ||
    state.priceRange[1] !== RETREAT_FILTER_DEFAULTS.priceRange[1]
  ) {
    params.set('priceMin', String(state.priceRange[0]));
    params.set('priceMax', String(state.priceRange[1]));
  }

  if (state.maxDriveTime !== RETREAT_FILTER_DEFAULTS.maxDriveTime) {
    params.set('maxDriveTime', String(state.maxDriveTime));
  }

  if (state.selectedOrigin !== RETREAT_FILTER_DEFAULTS.selectedOrigin) {
    params.set('origin', state.selectedOrigin);
  }

  if (state.minPrivacy !== RETREAT_FILTER_DEFAULTS.minPrivacy) {
    params.set('minPrivacy', String(state.minPrivacy));
  }

  if (state.amenities.length > 0) {
    params.set('amenities', state.amenities.join(','));
  }

  if (state.categories.length > 0) {
    params.set('categories', state.categories.join(','));
  }

  const search = params.toString();
  const newUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.replaceState(null, '', newUrl);
}

export function useRetreatFilters(properties: RetreatProperty[]) {
  const isInitialized = useRef(false);

  const [regions, setRegions] = useState<string[]>(RETREAT_FILTER_DEFAULTS.regions);
  const [stayTypes, setStayTypes] = useState<string[]>(RETREAT_FILTER_DEFAULTS.stayTypes);
  const [categories, setCategories] = useState<VacationCategory[]>(RETREAT_FILTER_DEFAULTS.categories);
  const [priceRange, setPriceRange] = useState<[number, number]>(RETREAT_FILTER_DEFAULTS.priceRange);
  const [maxDriveTime, setMaxDriveTime] = useState<number>(RETREAT_FILTER_DEFAULTS.maxDriveTime);
  const [selectedOrigin, setSelectedOrigin] = useState<string>(RETREAT_FILTER_DEFAULTS.selectedOrigin);
  const [minPrivacy, setMinPrivacy] = useState<number>(RETREAT_FILTER_DEFAULTS.minPrivacy);
  const [amenities, setAmenities] = useState<string[]>(RETREAT_FILTER_DEFAULTS.amenities);

  // Hydrate from URL on mount (client-only) to avoid SSR mismatch
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    const urlState = parseFiltersFromURL();
    if (urlState.regions) setRegions(urlState.regions);
    if (urlState.stayTypes) setStayTypes(urlState.stayTypes);
    if (urlState.categories) setCategories(urlState.categories);
    if (urlState.priceRange) setPriceRange(urlState.priceRange);
    if (urlState.maxDriveTime !== undefined) setMaxDriveTime(urlState.maxDriveTime);
    if (urlState.selectedOrigin) setSelectedOrigin(urlState.selectedOrigin);
    if (urlState.minPrivacy !== undefined) setMinPrivacy(urlState.minPrivacy);
    if (urlState.amenities) setAmenities(urlState.amenities);
  }, []);

  // Sync state to URL (skip during initial hydration)
  useEffect(() => {
    if (!isInitialized.current) return;
    writeFiltersToURL({
      regions,
      stayTypes,
      categories,
      priceRange,
      maxDriveTime,
      selectedOrigin,
      minPrivacy,
      amenities,
    });
  }, [regions, stayTypes, categories, priceRange, maxDriveTime, selectedOrigin, minPrivacy, amenities]);

  const resetFilters = useCallback(() => {
    setRegions(RETREAT_FILTER_DEFAULTS.regions);
    setStayTypes(RETREAT_FILTER_DEFAULTS.stayTypes);
    setCategories(RETREAT_FILTER_DEFAULTS.categories);
    setPriceRange(RETREAT_FILTER_DEFAULTS.priceRange);
    setMaxDriveTime(RETREAT_FILTER_DEFAULTS.maxDriveTime);
    setSelectedOrigin(RETREAT_FILTER_DEFAULTS.selectedOrigin);
    setMinPrivacy(RETREAT_FILTER_DEFAULTS.minPrivacy);
    setAmenities(RETREAT_FILTER_DEFAULTS.amenities);
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Region filter: property.region must be in selected regions (if any selected)
      if (regions.length > 0 && !regions.includes(property.region)) {
        return false;
      }

      // Stay type filter: case-insensitive match
      if (stayTypes.length > 0) {
        const propertyType = property.stayType.toLowerCase();
        const matches = stayTypes.some(
          (type) => type.toLowerCase() === propertyType
        );
        if (!matches) return false;
      }

      // Category filter: property.stayType must be in selected categories (if any selected)
      if (categories.length > 0) {
        const propertyCategory = property.stayType.toLowerCase();
        const matchesCategory = categories.some(
          (cat) => cat.toLowerCase() === propertyCategory
        );
        if (!matchesCategory) return false;
      }

      // Price range filter: overlap check
      // property.priceRange.min <= maxPrice AND property.priceRange.max >= minPrice
      if (
        property.priceRange.min > priceRange[1] ||
        property.priceRange.max < priceRange[0]
      ) {
        return false;
      }

      // Drive time filter: property.driveTimes[selectedOrigin] <= maxDriveTime
      const driveTime = property.driveTimes[selectedOrigin];
      if (driveTime !== undefined && driveTime > maxDriveTime) {
        return false;
      }

      // Privacy filter: property.privacyLevel >= minPrivacy
      if (property.privacyLevel < minPrivacy) {
        return false;
      }

      // Amenities filter: property must include ALL selected amenities (case-insensitive)
      if (amenities.length > 0) {
        const propertyAmenities = property.amenities.map((a) => a.toLowerCase());
        const allPresent = amenities.every((required) =>
          propertyAmenities.some((pa) => pa.includes(required.toLowerCase()))
        );
        if (!allPresent) return false;
      }

      return true;
    });
  }, [properties, regions, stayTypes, categories, priceRange, maxDriveTime, selectedOrigin, minPrivacy, amenities]);

  const activeFilterCount =
    (regions.length > 0 ? 1 : 0) +
    (stayTypes.length > 0 ? 1 : 0) +
    (categories.length > 0 ? 1 : 0) +
    (priceRange[0] !== RETREAT_FILTER_DEFAULTS.priceRange[0] ||
    priceRange[1] !== RETREAT_FILTER_DEFAULTS.priceRange[1]
      ? 1
      : 0) +
    (maxDriveTime !== RETREAT_FILTER_DEFAULTS.maxDriveTime ? 1 : 0) +
    (selectedOrigin !== RETREAT_FILTER_DEFAULTS.selectedOrigin ? 1 : 0) +
    (minPrivacy !== RETREAT_FILTER_DEFAULTS.minPrivacy ? 1 : 0) +
    (amenities.length > 0 ? 1 : 0);

  return {
    // State
    regions,
    stayTypes,
    categories,
    priceRange,
    maxDriveTime,
    selectedOrigin,
    minPrivacy,
    amenities,
    // Setters
    setRegions,
    setStayTypes,
    setCategories,
    setPriceRange,
    setMaxDriveTime,
    setSelectedOrigin,
    setMinPrivacy,
    setAmenities,
    // Actions
    resetFilters,
    // Derived
    filteredProperties,
    activeFilterCount,
  };
}

// Export URL helpers for testing
export { parseFiltersFromURL, writeFiltersToURL };
