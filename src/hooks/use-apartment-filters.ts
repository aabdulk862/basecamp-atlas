import { useState, useMemo, useCallback, useEffect } from 'react';
import { apartments, type Apartment } from '@/data/apartments';

export type SortOption = 'Overall Score' | 'Rent Low-High' | 'Rent High-Low' | 'Safety' | 'Walkability' | 'Transit' | 'Entertainment';

export interface FilterState {
  rentRange: [number, number];
  selectedNeighborhoods: string[];
  washerDryer: string;
  safetyScore: number;
  walkabilityScore: number;
  transitScore: number;
  entertainmentScore: number;
  sortBy: SortOption;
}

const DEFAULTS: FilterState = {
  rentRange: [850, 1900],
  selectedNeighborhoods: [],
  washerDryer: 'All',
  safetyScore: 1,
  walkabilityScore: 1,
  transitScore: 1,
  entertainmentScore: 1,
  sortBy: 'Overall Score',
};

function parseFiltersFromURL(): Partial<FilterState> {
  const params = new URLSearchParams(window.location.search);
  const parsed: Partial<FilterState> = {};

  const rentMin = params.get('rentMin');
  const rentMax = params.get('rentMax');
  if (rentMin && rentMax) {
    parsed.rentRange = [Number(rentMin), Number(rentMax)];
  }

  const neighborhoods = params.get('neighborhoods');
  if (neighborhoods) {
    parsed.selectedNeighborhoods = neighborhoods.split(',').filter(Boolean);
  }

  const wd = params.get('washerDryer');
  if (wd) parsed.washerDryer = wd;

  const safety = params.get('minSafety');
  if (safety) parsed.safetyScore = Number(safety);

  const walk = params.get('minWalkability');
  if (walk) parsed.walkabilityScore = Number(walk);

  const transit = params.get('minTransit');
  if (transit) parsed.transitScore = Number(transit);

  const ent = params.get('minEntertainment');
  if (ent) parsed.entertainmentScore = Number(ent);

  const sort = params.get('sort');
  if (sort) parsed.sortBy = sort as SortOption;

  return parsed;
}

function writeFiltersToURL(state: FilterState) {
  const params = new URLSearchParams();

  if (state.rentRange[0] !== DEFAULTS.rentRange[0] || state.rentRange[1] !== DEFAULTS.rentRange[1]) {
    params.set('rentMin', String(state.rentRange[0]));
    params.set('rentMax', String(state.rentRange[1]));
  }

  if (state.selectedNeighborhoods.length > 0) {
    params.set('neighborhoods', state.selectedNeighborhoods.join(','));
  }

  if (state.washerDryer !== DEFAULTS.washerDryer) {
    params.set('washerDryer', state.washerDryer);
  }

  if (state.safetyScore > DEFAULTS.safetyScore) {
    params.set('minSafety', String(state.safetyScore));
  }

  if (state.walkabilityScore > DEFAULTS.walkabilityScore) {
    params.set('minWalkability', String(state.walkabilityScore));
  }

  if (state.transitScore > DEFAULTS.transitScore) {
    params.set('minTransit', String(state.transitScore));
  }

  if (state.entertainmentScore > DEFAULTS.entertainmentScore) {
    params.set('minEntertainment', String(state.entertainmentScore));
  }

  if (state.sortBy !== DEFAULTS.sortBy) {
    params.set('sort', state.sortBy);
  }

  const search = params.toString();
  const newUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.replaceState(null, '', newUrl);
}

export function useApartmentFilters() {
  const urlState = parseFiltersFromURL();

  const [rentRange, setRentRange] = useState<[number, number]>(urlState.rentRange ?? DEFAULTS.rentRange);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(urlState.selectedNeighborhoods ?? DEFAULTS.selectedNeighborhoods);
  const [washerDryer, setWasherDryer] = useState<string>(urlState.washerDryer ?? DEFAULTS.washerDryer);
  const [safetyScore, setSafetyScore] = useState<number>(urlState.safetyScore ?? DEFAULTS.safetyScore);
  const [walkabilityScore, setWalkabilityScore] = useState<number>(urlState.walkabilityScore ?? DEFAULTS.walkabilityScore);
  const [transitScore, setTransitScore] = useState<number>(urlState.transitScore ?? DEFAULTS.transitScore);
  const [entertainmentScore, setEntertainmentScore] = useState<number>(urlState.entertainmentScore ?? DEFAULTS.entertainmentScore);
  const [sortBy, setSortBy] = useState<SortOption>(urlState.sortBy ?? DEFAULTS.sortBy);

  // Sync state to URL
  useEffect(() => {
    writeFiltersToURL({
      rentRange,
      selectedNeighborhoods,
      washerDryer,
      safetyScore,
      walkabilityScore,
      transitScore,
      entertainmentScore,
      sortBy,
    });
  }, [rentRange, selectedNeighborhoods, washerDryer, safetyScore, walkabilityScore, transitScore, entertainmentScore, sortBy]);

  const handleNeighborhoodToggle = useCallback((n: string) => {
    setSelectedNeighborhoods((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  }, []);

  const handleReset = useCallback(() => {
    setRentRange(DEFAULTS.rentRange);
    setSelectedNeighborhoods(DEFAULTS.selectedNeighborhoods);
    setWasherDryer(DEFAULTS.washerDryer);
    setSafetyScore(DEFAULTS.safetyScore);
    setWalkabilityScore(DEFAULTS.walkabilityScore);
    setTransitScore(DEFAULTS.transitScore);
    setEntertainmentScore(DEFAULTS.entertainmentScore);
    setSortBy(DEFAULTS.sortBy);
  }, []);

  const filteredApartments = useMemo(() => {
    let result = apartments.filter((apt) => {
      if (apt.rentMin > rentRange[1] || (apt.rentMax && apt.rentMax < rentRange[0])) return false;
      if (selectedNeighborhoods.length > 0 && !selectedNeighborhoods.includes(apt.neighborhood)) return false;
      if (washerDryer !== 'All' && apt.washerDryer !== washerDryer) return false;
      if (apt.safetyScore < safetyScore) return false;
      if (apt.walkabilityScore < walkabilityScore) return false;
      if (apt.transitScore < transitScore) return false;
      if (apt.entertainmentScore < entertainmentScore) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'Overall Score': return b.overallScore - a.overallScore;
        case 'Rent Low-High': return a.rentMin - b.rentMin;
        case 'Rent High-Low': return b.rentMin - a.rentMin;
        case 'Safety': return b.safetyScore - a.safetyScore;
        case 'Walkability': return b.walkabilityScore - a.walkabilityScore;
        case 'Transit': return b.transitScore - a.transitScore;
        case 'Entertainment': return b.entertainmentScore - a.entertainmentScore;
        default: return 0;
      }
    });

    return result;
  }, [rentRange, selectedNeighborhoods, washerDryer, safetyScore, walkabilityScore, transitScore, entertainmentScore, sortBy]);

  const activeFilterCount =
    (rentRange[0] > 850 || rentRange[1] < 1900 ? 1 : 0) +
    (selectedNeighborhoods.length > 0 ? 1 : 0) +
    (washerDryer !== 'All' ? 1 : 0) +
    (safetyScore > 1 ? 1 : 0) +
    (walkabilityScore > 1 ? 1 : 0) +
    (transitScore > 1 ? 1 : 0) +
    (entertainmentScore > 1 ? 1 : 0);

  return {
    // State
    rentRange,
    selectedNeighborhoods,
    washerDryer,
    safetyScore,
    walkabilityScore,
    transitScore,
    entertainmentScore,
    sortBy,
    // Setters
    setRentRange,
    setSelectedNeighborhoods,
    setWasherDryer,
    setSafetyScore,
    setWalkabilityScore,
    setTransitScore,
    setEntertainmentScore,
    setSortBy,
    // Actions
    handleNeighborhoodToggle,
    handleReset,
    // Derived
    filteredApartments,
    activeFilterCount,
  };
}
