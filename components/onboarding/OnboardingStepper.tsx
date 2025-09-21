import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Search,
  Users,
  Heart,
  QrCode,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  backgroundColor: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'discover',
    icon: Search,
    title: 'Descubra Sabores Únicos',
    description: 'Explore os melhores restaurantes de Maputo com avaliações autênticas e filtros personalizados para encontrar exatamente o que procura.',
    color: '#FF6B35',
    backgroundColor: '#FFF7F5',
  },
  {
    id: 'community',
    icon: Users,
    title: 'Junte-se à Comunidade',
    description: 'Partilhe experiências gastronómicas, descubra novos pratos através de outros utilizadores e conecte-se com amantes da boa comida.',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  {
    id: 'favorites',
    icon: Heart,
    title: 'Guarde os Seus Favoritos',
    description: 'Crie a sua lista personalizada de restaurantes favoritos e nunca mais perca de vista os locais que mais gosta.',
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  {
    id: 'qr',
    icon: QrCode,
    title: 'Acesso Rápido com QR',
    description: 'Digitalize códigos QR nos restaurantes para aceder instantaneamente aos menus digitais e informações detalhadas.',
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
];

interface OnboardingStepperProps {
  onComplete: () => void;
}

export default function OnboardingStepper({ onComplete }: OnboardingStepperProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Update progress animation
    Animated.timing(progressAnim, {
      toValue: currentStep / (onboardingSteps.length - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      animateToStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      animateToStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await markOnboardingComplete();
    animateOut();
  };

  const handleComplete = async () => {
    await markOnboardingComplete();
    animateOut();
  };

  // Keyboard navigation
  useKeyboardNavigation({
    onNext: handleNext,
    onPrevious: handlePrevious,
    onSkip: handleSkip,
    enabled: isVisible,
  });

  const markOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const animateToStep = (stepIndex: number) => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: stepIndex < currentStep ? -50 : 50,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentStep(stepIndex);
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onComplete();
    });
  };

  const renderProgressIndicator = () => {
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth,
                backgroundColor: onboardingSteps[currentStep].color
              }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} de {onboardingSteps.length}
        </Text>
      </View>
    );
  };

  const renderStepIndicators = () => (
    <View style={styles.stepIndicators}>
      {onboardingSteps.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.stepDot,
            {
              backgroundColor: index === currentStep
                ? onboardingSteps[currentStep].color
                : '#E5E7EB',
              transform: [{ scale: index === currentStep ? 1.2 : 1 }],
            }
          ]}
          onPress={() => animateToStep(index)}
          accessibilityRole="button"
          accessibilityLabel={`Ir para passo ${index + 1}`}
        />
      ))}
    </View>
  );

  const renderCurrentStep = () => {
    const step = onboardingSteps[currentStep];
    const IconComponent = step.icon;

    return (
      <Animated.View
        style={[
          styles.stepContent,
          {
            transform: [
              { translateX: slideAnim },
              { scale: scaleAnim }
            ],
            opacity: fadeAnim,
          }
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: step.backgroundColor }]}>
          <View style={[styles.iconCircle, { backgroundColor: step.color }]}>
            <IconComponent size={32} color="white" />
          </View>
        </View>

        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDescription}>{step.description}</Text>
      </Animated.View>
    );
  };

  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      <TouchableOpacity
        style={[
          styles.navButton,
          styles.previousButton,
          currentStep === 0 && styles.navButtonDisabled
        ]}
        onPress={handlePrevious}
        disabled={currentStep === 0}
        accessibilityRole="button"
        accessibilityLabel="Voltar ao passo anterior"
      >
        <ChevronLeft
          size={20}
          color={currentStep === 0 ? '#9CA3AF' : '#374151'}
        />
        <Text style={[
          styles.navButtonText,
          currentStep === 0 && styles.navButtonTextDisabled
        ]}>
          Voltar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navButton,
          styles.nextButton,
          { backgroundColor: onboardingSteps[currentStep].color }
        ]}
        onPress={handleNext}
        accessibilityRole="button"
        accessibilityLabel={currentStep === onboardingSteps.length - 1 ? 'Começar a usar a aplicação' : 'Próximo passo'}
      >
        <Text style={styles.nextButtonText}>
          {currentStep === onboardingSteps.length - 1 ? 'Começar' : 'Próximo'}
        </Text>
        <ChevronRight size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container]}>
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <Text style={styles.brandTitle}>Menuz</Text>
              <Text style={styles.brandSubtitle}>Bem-vindo à sua jornada gastronómica</Text>
            </View>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              accessibilityRole="button"
              accessibilityLabel="Saltar introdução"
            >
              <X size={20} color="#6B7280" />
              <Text style={styles.skipButtonText}>Saltar</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Indicator */}
          {renderProgressIndicator()}

          {/* Main Content */}
          <View style={styles.contentContainer}>
            {renderCurrentStep()}
          </View>

          {/* Step Indicators */}
          {renderStepIndicators()}

          {/* Navigation Buttons */}
          {renderNavigationButtons()}

          {/* Keyboard Navigation Hint */}
          {Platform.OS === 'web' && (
            <Text style={styles.keyboardHint}>
              Use as setas ← → do teclado para navegar • Escape para saltar
            </Text>
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: Platform.select({
      ios: 60,
      android: 40,
      web: 20,
    }),
    paddingHorizontal: 20,
    minHeight: height,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    paddingTop: Platform.select({
      ios: 20,
      android: 20,
      web: 40,
    }),
  },
  brandContainer: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skipButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  progressTrack: {
    width: '100%',
    maxWidth: 300,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    minHeight: 300,
  },
  stepContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: 400,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 32,
    gap: 12,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 120,
    justifyContent: 'center',
  },
  previousButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  nextButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  navButtonTextDisabled: {
    color: '#9CA3AF',
  },
  nextButtonText: {
    marginRight: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  keyboardHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
  },
});