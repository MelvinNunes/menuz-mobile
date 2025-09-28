import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getColor } from '@/theme/colors';
import { CUISINE_OPTIONS } from '@/services/preferences';
import CuisineCard from '@/components/ui/CuisineCard';
import StepHeader from '@/components/ui/StepHeader';
import StepNavigation from '@/components/ui/StepNavigation';
import BackButton from '@/components/ui/BackButton';

interface CuisinePreferencesStepProps {
    selectedCuisines: string[];
    onCuisinesChange: (cuisines: string[]) => void;
    onContinue: () => void;
    onBack: () => void;
    onSkip: () => void;
}

export default function CuisinePreferencesStep({
    selectedCuisines,
    onCuisinesChange,
    onContinue,
    onBack,
    onSkip
}: CuisinePreferencesStepProps) {
    const { t } = useTranslation();
    const [localCuisines, setLocalCuisines] = useState<string[]>(selectedCuisines);

    const handleCuisineToggle = (id: string) => {
        const newCuisines = localCuisines.includes(id)
            ? localCuisines.filter(cuisine => cuisine !== id)
            : [...localCuisines, id];

        setLocalCuisines(newCuisines);
        onCuisinesChange(newCuisines);
    };

    const handleContinue = () => {
        onCuisinesChange(localCuisines);
        onContinue();
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <BackButton onPress={onBack} />
            </View>

            <StepHeader
                title={t('preferences.cuisinePreferences.title')}
                subtitle={t('preferences.cuisinePreferences.subtitle')}
                currentStep={2}
                totalSteps={4}
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.section}>
                    <View style={styles.cuisineGrid}>
                        {CUISINE_OPTIONS.map((cuisine) => {
                            const isSelected = localCuisines.includes(cuisine.id);

                            return (
                                <CuisineCard
                                    key={cuisine.id}
                                    id={cuisine.id}
                                    label={t(cuisine.label)}
                                    icon={cuisine.icon}
                                    isSelected={isSelected}
                                    onPress={handleCuisineToggle}
                                    style={styles.cuisineCard}
                                />
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <StepNavigation
                currentStep={2}
                totalSteps={4}
                onBack={onBack}
                onContinue={handleContinue}
                onSkip={onSkip}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: getColor('bg.default'),
    },
    headerContainer: {
        position: 'absolute',
        top: 70,
        left: 20,
        zIndex: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    section: {
        paddingHorizontal: 20,
    },
    cuisineGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cuisineCard: {
        width: '48%',
        marginBottom: 12,
    },
});
