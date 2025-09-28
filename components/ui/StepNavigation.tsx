import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { getColor } from '@/theme/colors';

interface StepNavigationProps {
    currentStep: number;
    totalSteps: number;
    onBack: () => void;
    onContinue: () => void;
    onSkip?: () => void;
    isContinueDisabled?: boolean;
    continueLabel?: string;
    showBack?: boolean;
    style?: any;
}

export default function StepNavigation({
    currentStep,
    totalSteps,
    onBack,
    onContinue,
    onSkip,
    isContinueDisabled = false,
    continueLabel,
    showBack = true,
    style
}: StepNavigationProps) {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    const isLastStep = currentStep === totalSteps;
    const defaultContinueLabel = isLastStep ? 'Complete Setup' : 'Continue';

    return (
        <View style={[styles.container, style]}>
            <View style={styles.buttonContainer}>
                <View style={styles.primaryButtonContainer}>
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <TouchableOpacity
                            onPress={onContinue}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            style={[
                                styles.continueButton,
                                isContinueDisabled && styles.disabledButton,
                            ]}
                            activeOpacity={0.8}
                            disabled={isContinueDisabled}
                        >
                            <Text style={[
                                styles.continueButtonText,
                                isContinueDisabled && styles.disabledButtonText
                            ]}>
                                {continueLabel || defaultContinueLabel}
                            </Text>
                            {!isLastStep && (
                                <ArrowRight size={20} color={getColor('fg.inverse')} />
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>

            {onSkip && !isLastStep && (
                <TouchableOpacity
                    onPress={onSkip}
                    style={styles.skipButton}
                    activeOpacity={0.8}
                >
                    <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonContainer: {
        flex: 1,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: getColor('action.primary'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: getColor('border.default'),
        shadowOpacity: 0,
        elevation: 0,
    },
    continueButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: getColor('fg.inverse'),
        marginRight: 8,
    },
    disabledButtonText: {
        color: getColor('fg.muted'),
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 16,
    },
    skipButtonText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: getColor('fg.muted'),
    },
});
