import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Clock, Users } from 'lucide-react-native';
import { getColor } from '@/theme/colors';
import Skeleton from '@/components/ui/Skeleton';

interface CategoryCardsSectionProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    onCategoryPress: (categoryType: string) => void;
}

export default function CategoryCardsSection({
    fadeAnim,
    slideAnim,
    onCategoryPress,
}: CategoryCardsSectionProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time for this section
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 900 + Math.random() * 700); // Random delay between 0.9-1.6 seconds

        return () => clearTimeout(timer);
    }, []);
    if (isLoading) {
        return (
            <Animated.View style={[styles.categorySection, {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }]}>
                <View style={styles.sectionHeader}>
                    <Skeleton width={200} height={28} />
                    <View style={styles.sectionDivider} />
                </View>
                <View style={styles.categoryRow}>
                    <View style={styles.categoryCardSkeleton}>
                        <Skeleton width="100%" height={180} borderRadius={20} />
                    </View>
                    <View style={styles.categoryCardSkeleton}>
                        <Skeleton width="100%" height={180} borderRadius={20} />
                    </View>
                </View>
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.categorySection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
        }]}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explorar por Momento</Text>
                <View style={styles.sectionDivider} />
            </View>

            <View style={styles.categoryRow}>
                <TouchableOpacity
                    style={styles.categoryCard}
                    onPress={() => onCategoryPress('dinner')}
                    activeOpacity={0.8}
                >
                    <Image
                        source={{ uri: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                        style={styles.categoryImage}
                    />
                    <View style={styles.categoryDarkOverlay} />
                    <View style={styles.categoryOverlay}>
                        <View style={styles.categoryIconBadge}>
                            <Clock size={20} color="white" />
                        </View>
                        <Text style={styles.categoryTitle}>Para Jantares</Text>
                        <Text style={styles.categorySubtitle}>Experiências especiais</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.categoryCard}
                    onPress={() => onCategoryPress('lunch')}
                    activeOpacity={0.8}
                >
                    <Image
                        source={{ uri: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                        style={styles.categoryImage}
                    />
                    <View style={styles.categoryDarkOverlay} />
                    <View style={styles.categoryOverlay}>
                        <View style={styles.categoryIconBadge}>
                            <Users size={20} color="white" />
                        </View>
                        <Text style={styles.categoryTitle}>Para Almoços</Text>
                        <Text style={styles.categorySubtitle}>Refeições práticas</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    categorySection: {
        paddingVertical: 15,
        backgroundColor: getColor('bg.subtle'),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 26,
        fontFamily: 'Inter-Bold',
        color: getColor('fg.primary'),
        letterSpacing: -0.4,
    },
    sectionDivider: {
        flex: 1,
        height: 3,
        backgroundColor: getColor('action.primary'),
        marginLeft: 20,
        borderRadius: 2,
    },
    categoryRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 16,
    },
    categoryCard: {
        flex: 1,
        height: 180,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        position: 'relative',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryDarkOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1,
    },
    categoryOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        zIndex: 2,
    },
    categoryIconBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    categoryTitle: {
        fontSize: 18,
        fontFamily: 'Inter-Bold',
        color: 'white',
        marginBottom: 6,
        letterSpacing: -0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    categorySubtitle: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: 'rgba(255, 255, 255, 0.95)',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    categoryCardSkeleton: {
        flex: 1,
    },
});
