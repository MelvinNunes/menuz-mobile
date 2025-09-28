import { Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useEffect } from 'react';
import {
  ScreenLayout,
  QuickSuggestionsSection,
  MostExploredSection,
  MozambiqueCategoriesSection,
  CategoryCardsSection,
  NearestSection,
  SuggestRestaurantCTA,
} from '@/components';

export default function HomeScreen() {
  const router = useRouter();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  const handleRestaurantPress = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  const handleSuggestRestaurant = () => {
    router.push('/suggest-restaurant');
  };

  const handleCategoryPress = (categoryType: string) => {
    router.push(`/category/${categoryType}`);
  };

  const handleQuickSuggestionPress = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  return (
    <ScreenLayout>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {/* Quick Suggestions Section */}
        <QuickSuggestionsSection
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          scaleAnim={scaleAnim}
          onCategoryPress={handleQuickSuggestionPress}
        />

        {/* Most Explored Section */}
        <MostExploredSection
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          onRestaurantPress={handleRestaurantPress}
        />

        {/* Mozambique Categories Section */}
        <MozambiqueCategoriesSection
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          scaleAnim={scaleAnim}
          onCategoryPress={handleCategoryPress}
        />

        {/* Category Cards Section */}
        <CategoryCardsSection
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          onCategoryPress={handleCategoryPress}
        />

        {/* Promotional Banners Section */}
        {/* <PromoBannersSection
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
        /> */}

        {/* Nearest Section */}
        <NearestSection
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          onRestaurantPress={handleRestaurantPress}
        />

        {/* Suggest Restaurant CTA */}
        <SuggestRestaurantCTA
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          onSuggestRestaurant={handleSuggestRestaurant}
        />
      </Animated.ScrollView>
    </ScreenLayout>
  );
}
