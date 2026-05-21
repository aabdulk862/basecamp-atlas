import { useState, useCallback } from 'react';

export type FeedbackType = 'up' | 'down' | null;

interface FeedbackMap {
  [apartmentName: string]: {
    [category: string]: FeedbackType;
  };
}

const STORAGE_KEY = 'charlotte-apt-feedback';

function loadFeedback(): FeedbackMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return {};
}

function saveFeedback(feedback: FeedbackMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback));
}

export function useScoreFeedback() {
  const [feedback, setFeedback] = useState<FeedbackMap>(loadFeedback);

  const getFeedback = useCallback((apartmentName: string, category: string): FeedbackType => {
    return feedback[apartmentName]?.[category] ?? null;
  }, [feedback]);

  const setScoreFeedback = useCallback((apartmentName: string, category: string, value: FeedbackType) => {
    setFeedback(prev => {
      const next = { ...prev };
      if (!next[apartmentName]) next[apartmentName] = {};
      // Toggle off if same value
      if (next[apartmentName][category] === value) {
        next[apartmentName][category] = null;
      } else {
        next[apartmentName][category] = value;
      }
      saveFeedback(next);
      return next;
    });
  }, []);

  const getFeedbackSummary = useCallback((apartmentName: string) => {
    const aptFeedback = feedback[apartmentName];
    if (!aptFeedback) return null;
    let ups = 0;
    let downs = 0;
    Object.values(aptFeedback).forEach(v => {
      if (v === 'up') ups++;
      if (v === 'down') downs++;
    });
    return { ups, downs };
  }, [feedback]);

  return {
    getFeedback,
    setScoreFeedback,
    getFeedbackSummary,
  };
}
