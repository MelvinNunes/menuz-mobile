import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserPreferences {
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  spiceTolerance: number; // 1-4 scale
  diningStyles: string[];
  budgetRange: string;
  isComplete: boolean;
  completedAt?: string;
}

export interface PreferenceOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

export const DIETARY_RESTRICTIONS: PreferenceOption[] = [
  {
    id: 'vegetarian',
    label: 'preferences.dietaryRestrictions.vegetarian',
    description: 'preferences.dietaryRestrictions.vegetarianDesc',
    icon: '🌱',
  },
  {
    id: 'vegan',
    label: 'preferences.dietaryRestrictions.vegan',
    description: 'preferences.dietaryRestrictions.veganDesc',
    icon: '🥬',
  },
  {
    id: 'pescatarian',
    label: 'preferences.dietaryRestrictions.pescatarian',
    description: 'preferences.dietaryRestrictions.pescatarianDesc',
    icon: '🐟',
  },
  {
    id: 'gluten-free',
    label: 'preferences.dietaryRestrictions.glutenFree',
    description: 'preferences.dietaryRestrictions.glutenFreeDesc',
    icon: '🌾',
  },
  {
    id: 'lactose-free',
    label: 'preferences.dietaryRestrictions.lactoseFree',
    description: 'preferences.dietaryRestrictions.lactoseFreeDesc',
    icon: '🥛',
  },
  {
    id: 'nut-allergies',
    label: 'preferences.dietaryRestrictions.nutAllergies',
    description: 'preferences.dietaryRestrictions.nutAllergiesDesc',
    icon: '🥜',
  },
  {
    id: 'halal',
    label: 'preferences.dietaryRestrictions.halal',
    description: 'preferences.dietaryRestrictions.halalDesc',
    icon: '🕌',
  },
  {
    id: 'kosher',
    label: 'preferences.dietaryRestrictions.kosher',
    description: 'preferences.dietaryRestrictions.kosherDesc',
    icon: '✡️',
  },
  {
    id: 'diabetic-friendly',
    label: 'preferences.dietaryRestrictions.diabeticFriendly',
    description: 'preferences.dietaryRestrictions.diabeticFriendlyDesc',
    icon: '💉',
  },
];

export const CUISINE_OPTIONS: PreferenceOption[] = [
  {
    id: 'italian',
    label: 'preferences.cuisinePreferences.italian',
    icon: '🍝',
  },
  { id: 'asian', label: 'preferences.cuisinePreferences.asian', icon: '🍜' },
  {
    id: 'mexican',
    label: 'preferences.cuisinePreferences.mexican',
    icon: '🌮',
  },
  {
    id: 'american',
    label: 'preferences.cuisinePreferences.american',
    icon: '🍔',
  },
  { id: 'indian', label: 'preferences.cuisinePreferences.indian', icon: '🥘' },
  {
    id: 'japanese',
    label: 'preferences.cuisinePreferences.japanese',
    icon: '🍱',
  },
  { id: 'french', label: 'preferences.cuisinePreferences.french', icon: '🥖' },
  {
    id: 'bbq-grill',
    label: 'preferences.cuisinePreferences.bbqGrill',
    icon: '🍖',
  },
  {
    id: 'middle-eastern',
    label: 'preferences.cuisinePreferences.middleEastern',
    icon: '🌯',
  },
  { id: 'thai', label: 'preferences.cuisinePreferences.thai', icon: '🍲' },
];

export const SPICE_LEVELS = [
  {
    level: 1,
    label: 'preferences.cuisinePreferences.mild',
    icon: '😌',
    description: 'preferences.cuisinePreferences.mildDesc',
  },
  {
    level: 2,
    label: 'preferences.cuisinePreferences.medium',
    icon: '🌶️',
    description: 'preferences.cuisinePreferences.mediumDesc',
  },
  {
    level: 3,
    label: 'preferences.cuisinePreferences.spicy',
    icon: '🔥',
    description: 'preferences.cuisinePreferences.spicyDesc',
  },
  {
    level: 4,
    label: 'preferences.cuisinePreferences.extreme',
    icon: '💀',
    description: 'preferences.cuisinePreferences.extremeDesc',
  },
];

export const DINING_STYLES: PreferenceOption[] = [
  {
    id: 'fine-dining',
    label: 'preferences.diningPreferences.fineDining',
    icon: '🍽️',
  },
  {
    id: 'street-food',
    label: 'preferences.diningPreferences.streetFood',
    icon: '🚚',
  },
  {
    id: 'quick-bites',
    label: 'preferences.diningPreferences.quickBites',
    icon: '⚡',
  },
  {
    id: 'healthy-options',
    label: 'preferences.diningPreferences.healthyOptions',
    icon: '🥗',
  },
  {
    id: 'try-new-things',
    label: 'preferences.diningPreferences.tryNewThings',
    icon: '🎉',
  },
  {
    id: 'comfort-food',
    label: 'preferences.diningPreferences.comfortFood',
    icon: '❤️',
  },
  {
    id: 'group-dining',
    label: 'preferences.diningPreferences.groupDining',
    icon: '👥',
  },
  {
    id: 'home-cooking',
    label: 'preferences.diningPreferences.homeCooking',
    icon: '🏠',
  },
];

export const BUDGET_RANGES = [
  {
    id: 'budget',
    label: 'preferences.diningPreferences.budgetFriendly',
    symbol: '$',
    description: 'preferences.diningPreferences.budgetFriendlyDesc',
  },
  {
    id: 'moderate',
    label: 'preferences.diningPreferences.moderate',
    symbol: '$$',
    description: 'preferences.diningPreferences.moderateDesc',
  },
  {
    id: 'premium',
    label: 'preferences.diningPreferences.premium',
    symbol: '$$$',
    description: 'preferences.diningPreferences.premiumDesc',
  },
  {
    id: 'luxury',
    label: 'preferences.diningPreferences.luxury',
    symbol: '$$$',
    description: 'preferences.diningPreferences.luxuryDesc',
  },
];

const PREFERENCES_KEY = 'user_preferences';
const ONBOARDING_KEY = 'onboarding_completed';

export class OnboardingStorage {
  static async isCompleted(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
      return completed === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  static async markCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error marking onboarding as completed:', error);
      throw error;
    }
  }

  static async reset(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error('Error resetting onboarding status:', error);
      throw error;
    }
  }
}

export class PreferencesService {
  static async getPreferences(): Promise<UserPreferences | null> {
    try {
      console.log('PreferencesService: Loading preferences from AsyncStorage');
      const data = await AsyncStorage.getItem(PREFERENCES_KEY);
      console.log('PreferencesService: Raw data from AsyncStorage:', data);
      const parsed = data ? JSON.parse(data) : null;
      console.log('PreferencesService: Parsed preferences:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return null;
    }
  }

  static async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      console.log(
        'PreferencesService: Saving preferences to AsyncStorage:',
        preferences
      );
      const serialized = JSON.stringify(preferences);
      console.log('PreferencesService: Serialized data:', serialized);
      await AsyncStorage.setItem(PREFERENCES_KEY, serialized);
      console.log('PreferencesService: Successfully saved to AsyncStorage');
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  static async updatePreferences(
    updates: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    try {
      const current = await this.getPreferences();
      const updated = {
        ...current,
        ...updates,
        completedAt: updates.isComplete
          ? new Date().toISOString()
          : current?.completedAt,
      } as UserPreferences;

      await this.savePreferences(updated);
      return updated;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  static async clearPreferences(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PREFERENCES_KEY);
    } catch (error) {
      console.error('Error clearing preferences:', error);
      throw error;
    }
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      dietaryRestrictions: [],
      cuisinePreferences: [],
      spiceTolerance: 2, // Default to medium
      diningStyles: [],
      budgetRange: 'moderate',
      isComplete: false,
    };
  }
}
