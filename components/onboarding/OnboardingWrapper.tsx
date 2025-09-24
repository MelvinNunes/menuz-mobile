import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingStepper from './OnboardingStepper';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export default function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
      setShowOnboarding(hasCompleted !== 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to showing onboarding if there's an error
      setShowOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleContinueAsGuest = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
    router.replace('/(tabs)');
  };

  const handleSignIn = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
    router.push('/auth?mode=login');
  };

  const handleSignUp = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
    router.push('/auth?mode=signup');
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <>
      {showOnboarding && (
        showWelcome ? (
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeHeader}>
              <Text style={styles.brand}>Menuz</Text>
              <TouchableOpacity onPress={handleContinueAsGuest} accessibilityRole="button" accessibilityLabel="Continuar como convidado">
                <Text style={styles.linkPrimary}>Continuar como convidado</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.illustration}>
              {/* Placeholder illustration; replace with image if available */}
              <Image
                source={require('@/assets/images/logo.png')}
                style={{ width: 96, height: 96, resizeMode: 'contain' }}
              />
            </View>

            <View style={styles.welcomeBody}>
              <Text style={styles.title}>O que está no Menuz?</Text>
              <Text style={styles.subtitle}>
                Explore restaurantes, guarde favoritos e partilhe experiências culinárias em Maputo.
              </Text>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSignUp} accessibilityRole="button">
              <Text style={styles.primaryBtnText}>Começar</Text>
            </TouchableOpacity>

            <View style={styles.authRow}>
              <Text style={styles.authText}>Já tem conta?</Text>
              <TouchableOpacity onPress={handleSignIn} accessibilityRole="button">
                <Text style={styles.linkPrimary}>Entrar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.authRowAlt}>
              <Text style={styles.authText}>Não tem conta?</Text>
              <TouchableOpacity onPress={handleSignUp} accessibilityRole="button">
                <Text style={styles.linkPrimary}>Criar conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <OnboardingStepper onComplete={handleOnboardingComplete} />
        )
      )}
      {children}
    </>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: 'flex-start',
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  brand: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  illustration: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  welcomeBody: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  primaryBtn: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  primaryBtnText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  authRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  authRowAlt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  authText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginRight: 6,
  },
  linkPrimary: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0B6B53',
  },
});