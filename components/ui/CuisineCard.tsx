import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated } from 'react-native';
import { Check } from 'lucide-react-native';
import { getColor } from '@/theme/colors';

interface CuisineCardProps {
    id: string;
    label: string;
    icon?: string;
    isSelected: boolean;
    onPress: (id: string) => void;
    style?: any;
}

export default function CuisineCard({
    id,
    label,
    icon,
    isSelected,
    onPress,
    style
}: CuisineCardProps) {
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
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[
                        styles.label,
                        isSelected && styles.selectedLabel
                    ]}>
                        {label}
                    </Text>
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
                    <Check size={16} color={"#FF6B35"} />
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: getColor('bg.elevated'),
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: getColor('border.default'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedContainer: {
        backgroundColor: getColor('action.primary'),
        borderColor: getColor('action.primary'),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        fontSize: 20,
        marginRight: 8,
    },
    label: {
        fontSize: 15,
        fontFamily: 'Inter-SemiBold',
        color: getColor('fg.primary'),
        flex: 1,
    },
    selectedLabel: {
        color: getColor('fg.inverse'),
    },
    checkContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: getColor('fg.inverse'),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
});
