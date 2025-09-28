import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Plus } from 'lucide-react-native';
import { getColor } from '@/theme/colors';
import Skeleton from '@/components/ui/Skeleton';

interface SuggestRestaurantCTAProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    onSuggestRestaurant: () => void;
}

export default function SuggestRestaurantCTA({
    fadeAnim,
    slideAnim,
    onSuggestRestaurant,
}: SuggestRestaurantCTAProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time for this section
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 700 + Math.random() * 500); // Random delay between 0.7-1.2 seconds

        return () => clearTimeout(timer);
    }, []);
    if (isLoading) {
        return (
            <Animated.View style={[styles.suggestSection, {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }]}>
                <View style={styles.suggestCard}>
                    <View style={styles.suggestContent}>
                        <Skeleton width={56} height={56} borderRadius={28} />
                        <View style={styles.suggestText}>
                            <Skeleton width={200} height={20} style={{ marginBottom: 8 }} />
                            <Skeleton width={250} height={15} />
                        </View>
                    </View>
                    <Skeleton width="100%" height={50} borderRadius={16} />
                </View>
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.suggestSection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
        }]}>
            <View style={styles.suggestCard}>
                <View style={styles.suggestContent}>
                    <View style={styles.suggestIconContainer}>
                        <Plus size={32} color={getColor('action.primary')} />
                        <View style={styles.suggestIconGlow} />
                    </View>
                    <View style={styles.suggestText}>
                        <Text style={styles.suggestTitle}>Conhece um restaurante incrível?</Text>
                        <Text style={styles.suggestSubtitle}>
                            Sugira o seu restaurante favorito e ganhe pontos de recompensa.
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.suggestButton}
                    onPress={onSuggestRestaurant}
                    activeOpacity={0.8}
                >
                    <Text style={styles.suggestButtonText}>Sugerir Restaurante</Text>
                    <Plus size={18} color="white" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    suggestSection: {
        paddingHorizontal: 20,
        paddingVertical: 32,
        marginBottom: 70,
        backgroundColor: getColor('bg.default'),
    },
    suggestCard: {
        backgroundColor: getColor('action.primary') + '10',
        borderRadius: 24,
        padding: 28,
        borderWidth: 2,
        borderColor: getColor('action.primary') + '20',
        elevation: 8,
        shadowColor: getColor('action.primary'),
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
    },
    suggestContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    suggestIconContainer: {
        width: 56,
        height: 56,
        backgroundColor: 'white',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        position: 'relative',
    },
    suggestIconGlow: {
        position: 'absolute',
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: getColor('action.primary') + '20',
        top: -8,
        left: -8,
    },
    suggestText: {
        flex: 1,
    },
    suggestTitle: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        color: getColor('fg.primary'),
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    suggestSubtitle: {
        fontSize: 15,
        fontFamily: 'Inter-Medium',
        color: getColor('fg.muted'),
        lineHeight: 22,
    },
    suggestButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: getColor('action.primary'),
        paddingVertical: 16,
        paddingHorizontal: 28,
        borderRadius: 16,
        elevation: 6,
        shadowColor: getColor('action.primary'),
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    suggestButtonText: {
        fontSize: 17,
        fontFamily: 'Inter-Bold',
        color: 'white',
        marginRight: 10,
        letterSpacing: -0.2,
    },
});
