import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { mozambiqueCategories } from '@/data/mockData';
import { getColor } from '@/theme/colors';
import { Skeleton } from '@/components';

interface MozambiqueCategoriesSectionProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    scaleAnim: Animated.Value;
    onCategoryPress: (categoryType: string) => void;
}

export default function MozambiqueCategoriesSection({
    fadeAnim,
    slideAnim,
    scaleAnim,
    onCategoryPress,
}: MozambiqueCategoriesSectionProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time for this section
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800 + Math.random() * 600); // Random delay between 0.8-1.4 seconds

        return () => clearTimeout(timer);
    }, []);
    const renderMozambiqueCategory = ({ item }: { item: any }) => (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={[styles.mozambiqueCategoryCard, { backgroundColor: item.color }]}
                onPress={() => onCategoryPress(item.id)}
                activeOpacity={0.8}
            >
                <View style={styles.mozambiqueCategoryIconContainer}>
                    <Text style={styles.mozambiqueCategoryIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.mozambiqueCategoryText}>{item.name}</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    if (isLoading) {
        return (
            <Animated.View style={[styles.mozambiqueCategoriesSection, {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }]}>
                <View style={styles.sectionHeader}>
                    <Skeleton width={200} height={28} />
                    <View style={styles.sectionDivider} />
                </View>
                <FlatList
                    data={[1, 2, 3, 4, 5, 6]}
                    renderItem={({ item }) => (
                        <View style={styles.mozambiqueCategorySkeleton}>
                            <Skeleton width={80} height={60} borderRadius={16} />
                            <Skeleton width={70} height={12} style={{ marginTop: 8 }} />
                        </View>
                    )}
                    keyExtractor={(item) => item.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.mozambiqueCategoriesList}
                    snapToInterval={130}
                    decelerationRate="fast"
                />
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.mozambiqueCategoriesSection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
        }]}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categorias Moçambicanas</Text>
                <View style={styles.sectionDivider} />
            </View>
            <FlatList
                data={mozambiqueCategories}
                renderItem={renderMozambiqueCategory}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mozambiqueCategoriesList}
                snapToInterval={130}
                decelerationRate="fast"
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    mozambiqueCategoriesSection: {
        paddingVertical: 20,
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
    mozambiqueCategoriesList: {
        paddingHorizontal: 20,
        backgroundColor: getColor('bg.elevated'),
    },
    mozambiqueCategoryCard: {
        width: 110,
        height: 90,
        borderRadius: 16,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    mozambiqueCategoryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    mozambiqueCategoryIcon: {
        fontSize: 18,
    },
    mozambiqueCategoryText: {
        fontSize: 11,
        fontFamily: 'Inter-Bold',
        color: 'white',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    mozambiqueCategorySkeleton: {
        marginRight: 12,
        alignItems: 'center',
    },
});
