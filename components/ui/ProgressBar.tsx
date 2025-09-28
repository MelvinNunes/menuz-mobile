import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { getColor } from '@/theme/colors';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    style?: any;
}

export default function ProgressBar({
    currentStep,
    totalSteps,
    style
}: ProgressBarProps) {
    const progressAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const progress = (currentStep - 1) / (totalSteps - 1);
        Animated.spring(progressAnim, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [currentStep, totalSteps]);

    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <View style={[styles.container, style]}>
            <View style={styles.progressContainer}>
                <View style={styles.track}>
                    <Animated.View
                        style={[
                            styles.progress,
                            {
                                width: progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                }),
                            },
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {Math.round(progressPercentage)}%
                </Text>
            </View>

            <View style={styles.stepContainer}>
                <Text style={styles.stepText}>
                    Step {currentStep} of {totalSteps}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    track: {
        flex: 1,
        height: 6,
        backgroundColor: getColor('border.default'),
        borderRadius: 3,
        marginRight: 12,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        backgroundColor: getColor('action.primary'),
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        fontFamily: 'Inter-SemiBold',
        color: getColor('action.primary'),
        minWidth: 35,
        textAlign: 'right',
    },
    stepContainer: {
        alignItems: 'center',
    },
    stepText: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        color: getColor('fg.muted'),
    },
});
