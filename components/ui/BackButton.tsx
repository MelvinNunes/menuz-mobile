import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { getColor } from '@/theme/colors';

interface BackButtonProps {
    onPress: () => void;
    style?: any;
}

export default function BackButton({ onPress, style }: BackButtonProps) {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

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

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.container}
                activeOpacity={0.8}
            >
                <ArrowLeft size={24} color={getColor('fg.primary')} />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: getColor('bg.elevated'),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: getColor('border.default'),
    },
});
