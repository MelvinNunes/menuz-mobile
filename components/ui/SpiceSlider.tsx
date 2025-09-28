import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { getColor } from '@/theme/colors';

interface SpiceLevel {
    level: number;
    label: string;
    icon: string;
    description: string;
}

interface SpiceSliderProps {
    levels: SpiceLevel[];
    selectedLevel: number;
    onLevelChange: (level: number) => void;
    style?: any;
}

export default function SpiceSlider({
    levels,
    selectedLevel,
    onLevelChange,
    style
}: SpiceSliderProps) {
    const progressAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const progress = (selectedLevel - 1) / (levels.length - 1);
        Animated.spring(progressAnim, {
            toValue: progress,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [selectedLevel, levels.length]);

    const handleLevelPress = (level: number) => {
        onLevelChange(level);
    };

    return (
        <View style={[styles.container, style]}>
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
                {levels.map((level, index) => (
                    <TouchableOpacity
                        key={level.level}
                        onPress={() => handleLevelPress(level.level)}
                        style={[
                            styles.levelButton,
                            {
                                left: `${(index / (levels.length - 1)) * 100}%`,
                                transform: [{ translateX: -20 }],
                            },
                            selectedLevel === level.level && styles.selectedButton,
                        ]}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.levelContent,
                            selectedLevel === level.level && styles.selectedContent,
                        ]}>
                            <Text style={[
                                styles.levelIcon,
                                selectedLevel === level.level && styles.selectedIcon
                            ]}>
                                {level.icon}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.labelsContainer}>
                {levels.map((level) => (
                    <TouchableOpacity
                        key={level.level}
                        onPress={() => handleLevelPress(level.level)}
                        style={styles.labelContainer}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.levelLabel,
                            selectedLevel === level.level && styles.selectedLabel
                        ]}>
                            {level.label}
                        </Text>
                        <Text style={[
                            styles.levelDescription,
                            selectedLevel === level.level && styles.selectedDescription
                        ]}>
                            {level.description}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 24,
    },
    track: {
        height: 8,
        backgroundColor: getColor('border.default'),
        borderRadius: 4,
        position: 'relative',
        marginBottom: 32,
    },
    progress: {
        height: 8,
        backgroundColor: getColor('action.primary'),
        borderRadius: 4,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    levelButton: {
        position: 'absolute',
        top: -16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: getColor('bg.elevated'),
        borderWidth: 3,
        borderColor: getColor('border.default'),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedButton: {
        borderColor: getColor('action.primary'),
        backgroundColor: getColor('action.primary'),
    },
    levelContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedContent: {
        // Additional styling for selected state if needed
    },
    levelIcon: {
        fontSize: 18,
    },
    selectedIcon: {
        // Icon styling for selected state
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    labelContainer: {
        alignItems: 'center',
        flex: 1,
    },
    levelLabel: {
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: getColor('fg.primary'),
        marginBottom: 4,
    },
    selectedLabel: {
        color: getColor('action.primary'),
    },
    levelDescription: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        color: getColor('fg.muted'),
        textAlign: 'center',
    },
    selectedDescription: {
        color: getColor('action.primary'),
    },
});
