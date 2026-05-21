import { useState, useCallback, useMemo } from 'react';
import { SCORE_WEIGHTS } from '@/data/apartments';
import type { Apartment } from '@/data/apartments';

export interface ScoreWeights {
  safety: number;
  walkability: number;
  transit: number;
  entertainment: number;
}

const DEFAULT_WEIGHTS: ScoreWeights = { ...SCORE_WEIGHTS };

const STORAGE_KEY = 'charlotte-apt-weights';

function loadWeights(): ScoreWeights {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate
      if (parsed.safety && parsed.walkability && parsed.transit && parsed.entertainment) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_WEIGHTS };
}

function saveWeights(weights: ScoreWeights) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(weights));
}

export function useScoreWeights() {
  const [weights, setWeightsState] = useState<ScoreWeights>(loadWeights);

  const setWeights = useCallback((newWeights: ScoreWeights) => {
    setWeightsState(newWeights);
    saveWeights(newWeights);
  }, []);

  const resetWeights = useCallback(() => {
    setWeightsState({ ...DEFAULT_WEIGHTS });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isCustom = useMemo(() => {
    return (
      weights.safety !== DEFAULT_WEIGHTS.safety ||
      weights.walkability !== DEFAULT_WEIGHTS.walkability ||
      weights.transit !== DEFAULT_WEIGHTS.transit ||
      weights.entertainment !== DEFAULT_WEIGHTS.entertainment
    );
  }, [weights]);

  const calculateScore = useCallback((apt: Apartment): number => {
    const total = weights.safety + weights.walkability + weights.transit + weights.entertainment;
    if (total === 0) return 0;
    // Normalize weights to sum to 1
    const s = weights.safety / total;
    const w = weights.walkability / total;
    const t = weights.transit / total;
    const e = weights.entertainment / total;
    const score = apt.safetyScore * s + apt.walkabilityScore * w + apt.transitScore * t + apt.entertainmentScore * e;
    return Math.round(score * 10) / 10;
  }, [weights]);

  return {
    weights,
    setWeights,
    resetWeights,
    isCustom,
    calculateScore,
    defaultWeights: DEFAULT_WEIGHTS,
  };
}
