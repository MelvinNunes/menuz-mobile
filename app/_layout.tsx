import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import LoadingChef from '@/components/ui/LoadingChef';
import '@/i18n';

SplashScreen.preventAutoHideAsync();

const initialLoadingMessages = [
  "Preparing your menu...",
  "Finding the best restaurants...",
  "Curating delicious options...",
  "Almost ready...",
  "Final touches..."
];

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      setIsLoading(false);
    }
  }, [fontsLoaded, fontError]);

  // Show loading screen while fonts are loading
  if (isLoading || (!fontsLoaded && !fontError)) {
    return <LoadingChef loadingMessages={initialLoadingMessages} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="help-support" />
      <Stack.Screen name="restaurant/[id]" />
      <Stack.Screen name="promotion/[id]" />
      <Stack.Screen name="suggest-restaurant" />
      <Stack.Screen name="my-reviews" />
      <Stack.Screen name="notification-preferences" />
      <Stack.Screen name="restaurant-sharing/[id]" />
      <Stack.Screen name="category/[type]" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}