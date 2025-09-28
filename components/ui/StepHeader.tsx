import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getColor } from '@/theme/colors';
import ProgressBar from './ProgressBar';

interface StepHeaderProps {
    title: string;
    subtitle: string;
    currentStep: number;
    totalSteps: number;
    style?: any;
}

export default function StepHeader({
    title,
    subtitle,
    currentStep,
    totalSteps,
    style
}: StepHeaderProps) {
    return (
        <View style={[styles.container, style]}>
            <ProgressBar
                currentStep={currentStep}
                totalSteps={totalSteps}
            />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        marginTop: 10,
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: getColor('fg.primary'),
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: getColor('fg.muted'),
        textAlign: 'center',
        lineHeight: 20,
    },
});
