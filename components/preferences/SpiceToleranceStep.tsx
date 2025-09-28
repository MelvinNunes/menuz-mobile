import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getColor } from '@/theme/colors';
import { SPICE_LEVELS } from '@/services/preferences';
import SpiceSlider from '@/components/ui/SpiceSlider';
import StepHeader from '@/components/ui/StepHeader';
import StepNavigation from '@/components/ui/StepNavigation';
import BackButton from '@/components/ui/BackButton';

interface SpiceToleranceStepProps {
    spiceTolerance: number;
    onSpiceToleranceChange: (tolerance: number) => void;
    onContinue: () => void;
    onBack: () => void;
    onSkip: () => void;
}

export default function SpiceToleranceStep({
    spiceTolerance,
    onSpiceToleranceChange,
    onContinue,
    onBack,
    onSkip
}: SpiceToleranceStepProps) {
    const { t } = useTranslation();
    const [localSpiceTolerance, setLocalSpiceTolerance] = useState<number>(spiceTolerance);

    const handleSpiceToleranceChange = (tolerance: number) => {
        setLocalSpiceTolerance(tolerance);
        onSpiceToleranceChange(tolerance);
    };

    const handleContinue = () => {
        onSpiceToleranceChange(localSpiceTolerance);
        onContinue();
    };

    const translatedSpiceLevels = SPICE_LEVELS.map(level => ({
        ...level,
        label: t(level.label),
        description: t(level.description),
    }));

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <BackButton onPress={onBack} />
            </View>

            <StepHeader
                title={t('preferences.cuisinePreferences.spiceTolerance')}
                subtitle={t('preferences.cuisinePreferences.spiceToleranceSubtitle')}
                currentStep={3}
                totalSteps={4}
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.section}>
                    <SpiceSlider
                        levels={translatedSpiceLevels}
                        selectedLevel={localSpiceTolerance}
                        onLevelChange={handleSpiceToleranceChange}
                    />
                </View>
            </ScrollView>

            <StepNavigation
                currentStep={3}
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
        top: 60,
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
        paddingTop: 40,
    },
});
