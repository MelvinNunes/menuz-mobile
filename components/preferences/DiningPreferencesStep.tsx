import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getColor } from '@/theme/colors';
import { DINING_STYLES, BUDGET_RANGES } from '@/services/preferences';
import CuisineCard from '@/components/ui/CuisineCard';
import BudgetCard from '@/components/ui/BudgetCard';
import StepHeader from '@/components/ui/StepHeader';
import StepNavigation from '@/components/ui/StepNavigation';
import BackButton from '@/components/ui/BackButton';

interface DiningPreferencesStepProps {
    selectedDiningStyles: string[];
    budgetRange: string;
    onDiningStylesChange: (styles: string[]) => void;
    onBudgetRangeChange: (range: string) => void;
    onContinue: () => void;
    onBack: () => void;
    onSkip: () => void;
}

export default function DiningPreferencesStep({
    selectedDiningStyles,
    budgetRange,
    onDiningStylesChange,
    onBudgetRangeChange,
    onContinue,
    onBack,
    onSkip
}: DiningPreferencesStepProps) {
    const { t } = useTranslation();
    const [localDiningStyles, setLocalDiningStyles] = useState<string[]>(selectedDiningStyles);
    const [localBudgetRange, setLocalBudgetRange] = useState<string>(budgetRange);

    const handleDiningStyleToggle = (id: string) => {
        const newStyles = localDiningStyles.includes(id)
            ? localDiningStyles.filter(style => style !== id)
            : [...localDiningStyles, id];

        setLocalDiningStyles(newStyles);
        onDiningStylesChange(newStyles);
    };

    const handleBudgetRangeChange = (range: string) => {
        setLocalBudgetRange(range);
        onBudgetRangeChange(range);
    };

    const handleContinue = () => {
        onDiningStylesChange(localDiningStyles);
        onBudgetRangeChange(localBudgetRange);
        onContinue();
    };


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <BackButton onPress={onBack} />
            </View>

            <StepHeader
                title={t('preferences.diningPreferences.title')}
                subtitle={t('preferences.diningPreferences.subtitle')}
                currentStep={4}
                totalSteps={4}
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {t('preferences.diningPreferences.title')}
                    </Text>
                    <View style={styles.diningStylesGrid}>
                        {DINING_STYLES.map((style) => {
                            const isSelected = localDiningStyles.includes(style.id);

                            return (
                                <CuisineCard
                                    key={style.id}
                                    id={style.id}
                                    label={t(style.label)}
                                    icon={style.icon}
                                    isSelected={isSelected}
                                    onPress={handleDiningStyleToggle}
                                    style={styles.diningStyleCard}
                                />
                            );
                        })}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {t('preferences.diningPreferences.budgetRange')}
                    </Text>
                    <View style={styles.budgetContainer}>
                        {BUDGET_RANGES.map((budget) => {
                            const isSelected = localBudgetRange === budget.id;

                            return (
                                <BudgetCard
                                    key={budget.id}
                                    id={budget.id}
                                    label={t(budget.label)}
                                    symbol={budget.symbol}
                                    description={t(budget.description)}
                                    isSelected={isSelected}
                                    onPress={handleBudgetRangeChange}
                                />
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <StepNavigation
                currentStep={4}
                totalSteps={4}
                onBack={onBack}
                onContinue={handleContinue}
                onSkip={onSkip}
                continueLabel={t('preferences.complete')}
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
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        color: getColor('fg.primary'),
        marginBottom: 16,
    },
    diningStylesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    diningStyleCard: {
        width: '48%',
        marginBottom: 12,
    },
    budgetContainer: {
        // No additional styles needed, cards handle their own spacing
    },
});
