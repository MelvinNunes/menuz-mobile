import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Onboarding status service
 * Centralizes read/write of onboarding completion state with a stable key
 * and backward-compatibility for legacy keys found in the codebase.
 */

const PRIMARY_KEY = 'onboarding.completed';
const LEGACY_KEYS = ['hasCompletedOnboarding'];

/**
 * Returns true if the user has completed onboarding.
 */
export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    // Check primary key first
    const primary = await AsyncStorage.getItem(PRIMARY_KEY);
    if (primary === 'true') return true;

    // Fallback to legacy keys
    for (const legacyKey of LEGACY_KEYS) {
      const value = await AsyncStorage.getItem(legacyKey);
      if (value === 'true') {
        // Migrate to primary key for future reads
        await AsyncStorage.setItem(PRIMARY_KEY, 'true');
        return true;
      }
    }

    return false;
  } catch (_error) {
    // On error, default to not completed so onboarding can show
    return false;
  }
}

/**
 * Marks onboarding as completed.
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(PRIMARY_KEY, 'true');
  } catch (_error) {
    // Swallow; callers don't need to handle errors for this UX hint
  }
}

/**
 * Clears onboarding completion status (useful for debugging or resets).
 */
export async function clearOnboardingStatus(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PRIMARY_KEY);
    // Optionally clear legacy keys too
    await Promise.all(LEGACY_KEYS.map((k) => AsyncStorage.removeItem(k)));
  } catch (_error) {
    // No-op
  }
}

export const OnboardingStorage = {
  isCompleted: isOnboardingCompleted,
  setCompleted: setOnboardingCompleted,
  clear: clearOnboardingStatus,
};
