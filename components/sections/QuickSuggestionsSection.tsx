import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { quickSuggestionsCategories } from '@/data/mockData';
import { getColor } from '@/theme/colors';
import Skeleton from '@/components/ui/Skeleton';

interface QuickSuggestionsSectionProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    scaleAnim: Animated.Value;
    onCategoryPress: (categoryId: string) => void;
}

export default function QuickSuggestionsSection({
    fadeAnim,
    slideAnim,
    scaleAnim,
    onCategoryPress,
}: QuickSuggestionsSectionProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time for this section
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds

        return () => clearTimeout(timer);
    }, []);

    const renderQuickSuggestionCard = ({ item }: { item: any }) => (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={[styles.quickSuggestionCard, { backgroundColor: item.color }]}
                onPress={() => onCategoryPress(item.id)}
                activeOpacity={0.8}
            >
                <View style={styles.quickSuggestionIconContainer}>
                    <Text style={styles.quickSuggestionIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.quickSuggestionText}>{item.name}</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    if (isLoading) {
        return (
            <Animated.View style={[styles.quickSuggestionsSection, {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }]}>
                <View style={styles.sectionHeader}>
                    <Skeleton width={180} height={28} />
                    <View style={styles.sectionDivider} />
                </View>
                <FlatList
                    data={[1, 2, 3, 4, 5, 6, 7, 8]}
                    renderItem={({ item }) => (
                        <View style={styles.quickSuggestionSkeleton}>
                            <Skeleton width={90} height={90} borderRadius={20} />
                            <Skeleton width={70} height={14} style={{ marginTop: 8 }} />
                        </View>
                    )}
                    keyExtractor={(item) => item.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.quickSuggestionsList}
                    snapToInterval={110}
                    decelerationRate="fast"
                />
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.quickSuggestionsSection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
        }]}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('home.sections.quickSuggestions')}</Text>
                <View style={styles.sectionDivider} />
            </View>
            <FlatList
                data={quickSuggestionsCategories}
                renderItem={renderQuickSuggestionCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickSuggestionsList}
                snapToInterval={110}
                decelerationRate="fast"
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    quickSuggestionsSection: {
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
    quickSuggestionsList: {
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    quickSuggestionCard: {
        width: 90,
        height: 110,
        borderRadius: 20,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    quickSuggestionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    quickSuggestionIcon: {
        fontSize: 24,
    },
    quickSuggestionText: {
        fontSize: 12,
        fontFamily: 'Inter-Bold',
        color: 'white',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    quickSuggestionSkeleton: {
        marginRight: 12,
        alignItems: 'center',
    },
});
