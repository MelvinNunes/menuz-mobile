import AsyncStorage from '@react-native-async-storage/async-storage';

const IS_ANONYMOUS_USER = 'auth.user.is_anony_or_guest';

export async function isAnonymousUser(): Promise<boolean> {
  try {
    // Check primary key first
    const primary = await AsyncStorage.getItem(IS_ANONYMOUS_USER);
    if (primary === 'true') return true;
    return false;
  } catch (_error) {
    // On error, default to not completed so onboarding can show
    return false;
  }
}

export async function setAnonymousUser(): Promise<void> {
  try {
    await AsyncStorage.setItem(IS_ANONYMOUS_USER, 'true');
  } catch (_error) {
    // Swallow; callers don't need to handle errors for this UX hint
  }
}

export async function clearAnonymousUserStatus(): Promise<void> {
  try {
    await AsyncStorage.removeItem(IS_ANONYMOUS_USER);
  } catch (_error) {
    // No-op
  }
}

export const AnonymousAuthStorage = {
  isAnonymous: isAnonymousUser,
  setAnonymous: setAnonymousUser,
  clear: clearAnonymousUserStatus,
};
