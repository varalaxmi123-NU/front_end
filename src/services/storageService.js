/**
 * Storage Service for safe localStorage operations with fallback
 */
const STORAGE_KEY = 'pulse30_financial_state_v1';

export const storageService = {
  loadState: (fallbackState) => {
    try {
      if (typeof window === 'undefined') return fallbackState;
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : fallbackState;
    } catch {
      return fallbackState;
    }
  },

  saveState: (state) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // Graceful degradation
    }
  },

  clearState: () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Graceful degradation
    }
  }
};
