import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getColor } from '@/theme/colors';
import { UserPreferences, PreferencesService } from '@/services/preferences';
import DietaryRestrictionsStep from './DietaryRestrictionsStep';
import CuisinePreferencesStep from './CuisinePreferencesStep';
import SpiceToleranceStep from './SpiceToleranceStep';
import DiningPreferencesStep from './DiningPreferencesStep';

interface PreferencesFlowProps {
    onComplete?: () => void;
}

export default function PreferencesFlow({ onComplete }: PreferencesFlowProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [preferences, setPreferences] = useState<UserPreferences>(
        PreferencesService.getDefaultPreferences()
    );
    const [isLoading, setIsLoading] = useState(false);

    const totalSteps = 4;

    useEffect(() => {
        loadExistingPreferences();
    }, []);

    const loadExistingPreferences = async () => {
        try {
            const existing = await PreferencesService.getPreferences();
            if (existing) {
                setPreferences(existing);
            }
        } catch (error) {
            console.error('Error loading existing preferences:', error);
        }
    };

    const savePreferences = async (updatedPreferences: UserPreferences) => {
        try {
            setIsLoading(true);
            await PreferencesService.savePreferences(updatedPreferences);
            setPreferences(updatedPreferences);
        } catch (error) {
            console.error('Error saving preferences:', error);
            Alert.alert(
                t('preferences.error.title', 'Error'),
                t('preferences.error.save', 'Failed to save preferences. Please try again.')
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleStepContinue = async () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            // Complete the flow
            const completedPreferences: UserPreferences = {
                ...preferences,
                isComplete: true,
                completedAt: new Date().toISOString(),
            };

            await savePreferences(completedPreferences);

            // Show completion message
            Alert.alert(
                t('preferences.setupComplete'),
                t('preferences.setupCompleteMessage'),
                [
                    {
                        text: t('preferences.continue', 'Continue'),
                        onPress: () => {
                            if (onComplete) {
                                onComplete();
                            } else {
                                router.back();
                            }
                        },
                    },
                ]
            );
        }
    };

    const handleStepBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        Alert.alert(
            t('preferences.skip.title'),
            t('preferences.skip.message'),
            [
                {
                    text: t('preferences.back', 'Back'),
                    style: 'cancel',
                },
                {
                    text: t('preferences.skip.confirm', 'Skip'),
                    style: 'destructive',
                    onPress: () => {
                        if (onComplete) {
                            onComplete();
                        } else {
                            router.back();
                        }
                    },
                },
            ]
        );
    };

    const handleDietaryRestrictionsChange = (restrictions: string[]) => {
        const updatedPreferences = {
            ...preferences,
            dietaryRestrictions: restrictions,
        };
        setPreferences(updatedPreferences);
        savePreferences(updatedPreferences);
    };

    const handleCuisinePreferencesChange = (cuisines: string[]) => {
        const updatedPreferences = {
            ...preferences,
            cuisinePreferences: cuisines,
        };
        setPreferences(updatedPreferences);
        savePreferences(updatedPreferences);
    };

    const handleSpiceToleranceChange = (tolerance: number) => {
        const updatedPreferences = {
            ...preferences,
            spiceTolerance: tolerance,
        };
        setPreferences(updatedPreferences);
        savePreferences(updatedPreferences);
    };

    const handleDiningStylesChange = (styles: string[]) => {
        const updatedPreferences = {
            ...preferences,
            diningStyles: styles,
        };
        setPreferences(updatedPreferences);
        savePreferences(updatedPreferences);
    };

    const handleBudgetRangeChange = (range: string) => {
        const updatedPreferences = {
            ...preferences,
            budgetRange: range,
        };
        setPreferences(updatedPreferences);
        savePreferences(updatedPreferences);
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <DietaryRestrictionsStep
                        selectedRestrictions={preferences.dietaryRestrictions}
                        onRestrictionsChange={handleDietaryRestrictionsChange}
                        onContinue={handleStepContinue}
                        onBack={handleStepBack}
                        onSkip={handleSkip}
                    />
                );
            case 2:
                return (
                    <CuisinePreferencesStep
                        selectedCuisines={preferences.cuisinePreferences}
                        onCuisinesChange={handleCuisinePreferencesChange}
                        onContinue={handleStepContinue}
                        onBack={handleStepBack}
                        onSkip={handleSkip}
                    />
                );
            case 3:
                return (
                    <SpiceToleranceStep
                        spiceTolerance={preferences.spiceTolerance}
                        onSpiceToleranceChange={handleSpiceToleranceChange}
                        onContinue={handleStepContinue}
                        onBack={handleStepBack}
                        onSkip={handleSkip}
                    />
                );
            case 4:
                return (
                    <DiningPreferencesStep
                        selectedDiningStyles={preferences.diningStyles}
                        budgetRange={preferences.budgetRange}
                        onDiningStylesChange={handleDiningStylesChange}
                        onBudgetRangeChange={handleBudgetRangeChange}
                        onContinue={handleStepContinue}
                        onBack={handleStepBack}
                        onSkip={handleSkip}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {renderCurrentStep()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: getColor('bg.default'),
    },
});
