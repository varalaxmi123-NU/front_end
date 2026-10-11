import { useState, useEffect } from 'react';

/**
 * Custom hook for synchronized local storage persistence
 * @param {string} key 
 * @param {any} initialValue 
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch {
      // LocalStorage quota or restricted mode handled gracefully
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
