import { useEffect } from 'react';
import { Platform } from 'react-native';

interface UseKeyboardNavigationProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onNext,
  onPrevious,
  onSkip,
  enabled = true,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    if (Platform.OS !== 'web' || !enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          onNext?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onPrevious?.();
          break;
        case 'Escape':
          event.preventDefault();
          onSkip?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onNext, onPrevious, onSkip, enabled]);
}