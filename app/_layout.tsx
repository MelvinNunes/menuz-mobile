import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { OnboardingWrapper } from '@/components';
import { OnboardingStorage } from '@/services/onboarding';
import WelcomeScreen from './welcome';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const checkOnboardingStatus = async () => {
    try {
      const completed = await OnboardingStorage.isCompleted();
      setShowOnboarding(!completed);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to showing onboarding if there's an error
      setShowOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show loading screen while fonts are loading
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Show loading screen while checking onboarding status
  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  if (showOnboarding) {
    return <WelcomeScreen />
  }

  return (
    <OnboardingWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="restaurant/[id]" />
        <Stack.Screen name="promotion/[id]" />
        <Stack.Screen name="suggest-restaurant" />
        <Stack.Screen name="search" />
        <Stack.Screen name="add-experience" />
        <Stack.Screen name="my-reviews" />
        <Stack.Screen name="notification-preferences" />
        <Stack.Screen name="help-support" />
        <Stack.Screen name="restaurant-sharing/[id]" />
        <Stack.Screen name="category/[type]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </OnboardingWrapper>
  );
}