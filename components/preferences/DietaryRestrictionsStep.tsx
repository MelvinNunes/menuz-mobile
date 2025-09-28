import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getColor } from '@/theme/colors';
import { DIETARY_RESTRICTIONS } from '@/services/preferences';
import PreferenceCard from '@/components/ui/PreferenceCard';
import StepHeader from '@/components/ui/StepHeader';
import StepNavigation from '@/components/ui/StepNavigation';
import BackButton from '@/components/ui/BackButton';

interface DietaryRestrictionsStepProps {
    selectedRestrictions: string[];
    onRestrictionsChange: (restrictions: string[]) => void;
    onContinue: () => void;
    onBack: () => void;
    onSkip: () => void;
}

export default function DietaryRestrictionsStep({
    selectedRestrictions,
    onRestrictionsChange,
    onContinue,
    onBack,
    onSkip
}: DietaryRestrictionsStepProps) {
    const { t } = useTranslation();
    const [localSelections, setLocalSelections] = useState<string[]>(selectedRestrictions);

    const handleRestrictionToggle = (id: string) => {
        const newSelections = localSelections.includes(id)
            ? localSelections.filter(restriction => restriction !== id)
            : [...localSelections, id];

        setLocalSelections(newSelections);
        onRestrictionsChange(newSelections);
    };

    const handleContinue = () => {
        onRestrictionsChange(localSelections);
        onContinue();
    };


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <BackButton onPress={onBack} />
            </View>

            <StepHeader
                title={t('preferences.dietaryRestrictions.title')}
                subtitle={t('preferences.dietaryRestrictions.subtitle')}
                currentStep={1}
                totalSteps={4}
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.optionsContainer}>
                    {DIETARY_RESTRICTIONS.map((restriction) => {
                        const isSelected = localSelections.includes(restriction.id);

                        return (
                            <PreferenceCard
                                key={restriction.id}
                                id={restriction.id}
                                label={t(restriction.label)}
                                description={t(restriction.description || '')}
                                icon={restriction.icon}
                                isSelected={isSelected}
                                onPress={handleRestrictionToggle}
                            />
                        );
                    })}
                </View>
            </ScrollView>

            <StepNavigation
                currentStep={1}
                totalSteps={4}
                onBack={onBack}
                onContinue={handleContinue}
                onSkip={onSkip}
                showBack={false}
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
    optionsContainer: {
        paddingHorizontal: 20,
    },
});
