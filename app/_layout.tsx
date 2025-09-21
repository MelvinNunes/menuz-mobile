import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from 'react-native';
import { OnboardingWrapper } from '@/components';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <OnboardingWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="restaurant/[id]" />
        <Stack.Screen name="promotion/[id]" />
        <Stack.Screen name="suggest-restaurant" />
        <Stack.Screen name="search" />
        <Stack.Screen name="auth" />
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