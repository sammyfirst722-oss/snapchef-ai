'use client';

import { useCallback } from 'react';

export function useHaptics() {
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      switch (type) {
        case 'light':
          window.navigator.vibrate(10);
          break;
        case 'medium':
          window.navigator.vibrate(20);
          break;
        case 'heavy':
          window.navigator.vibrate([30, 50, 30]);
          break;
      }
    }
  }, []);

  return triggerHaptic;
}
