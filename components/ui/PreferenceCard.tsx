import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated } from 'react-native';
import { Check } from 'lucide-react-native';
import { getColor } from '@/theme/colors';

interface PreferenceCardProps {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    isSelected: boolean;
    onPress: (id: string) => void;
    style?: any;
}

export default function PreferenceCard({
    id,
    label,
    description,
    icon,
    isSelected,
    onPress,
    style
}: PreferenceCardProps) {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const checkAnim = React.useRef(new Animated.Value(isSelected ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.spring(checkAnim, {
            toValue: isSelected ? 1 : 0,
            useNativeDriver: true,
        }).start();
    }, [isSelected]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
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

    const handlePress = () => {
        onPress(id);
    };

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                    styles.container,
                    isSelected && styles.selectedContainer,
                ]}
                activeOpacity={0.8}
            >
                <View style={styles.content}>
                    {icon && (
                        <Text style={styles.icon}>{icon}</Text>
                    )}
                    <View style={styles.textContainer}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[
                            styles.label,
                            isSelected && styles.selectedLabel
                        ]}>
                            {label}
                        </Text>
                        {description && (
                            <Text numberOfLines={2} ellipsizeMode="tail" style={[
                                styles.description,
                                isSelected && styles.selectedDescription
                            ]}>
                                {description}
                            </Text>
                        )}
                    </View>
                </View>

                <Animated.View
                    style={[
                        styles.checkContainer,
                        {
                            opacity: checkAnim,
                            transform: [
                                {
                                    scale: checkAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.5, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Check size={20} color={getColor('fg.inverse')} />
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: getColor('bg.elevated'),
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: getColor('border.default'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedContainer: {
        backgroundColor: getColor('warning.surface'),
        borderColor: getColor('warning.text'),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        fontSize: 24,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: getColor('fg.primary'),
        marginBottom: 2,
    },
    selectedLabel: {
        color: getColor('warning.text'),
    },
    description: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: getColor('fg.muted'),
        lineHeight: 18,
    },
    selectedDescription: {
        color: getColor('warning.text'),
        opacity: 0.8,
    },
    checkContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: getColor('warning.text'),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
});
