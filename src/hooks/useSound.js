import { useState, useCallback } from 'react';
import { 
  playClick as playClickAudio, 
  playSuccessChime as playSuccessAudio, 
  playWarningSound as playWarningAudio, 
  toggleSound as toggleGlobalSound, 
  isSoundEnabled 
} from '../utils/audioEffects';

/**
 * Custom sound effects hook with state toggle
 */
export function useSound() {
  const [enabled, setEnabled] = useState(isSoundEnabled());

  const toggle = useCallback(() => {
    const newState = toggleGlobalSound();
    setEnabled(newState);
    return newState;
  }, []);

  const playClick = useCallback(() => {
    playClickAudio();
  }, []);

  const playSuccess = useCallback(() => {
    playSuccessAudio();
  }, []);

  const playWarning = useCallback(() => {
    playWarningAudio();
  }, []);

  return {
    soundEnabled: enabled,
    toggleSound: toggle,
    playClick,
    playSuccess,
    playWarning
  };
}
