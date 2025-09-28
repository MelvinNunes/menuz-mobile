import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Animated } from 'react-native';
import { Star, MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { mostExploredRestaurants } from '@/data/mockData';
import { getColor } from '@/theme/colors';
import Skeleton from '@/components/ui/Skeleton';

interface MostExploredSectionProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    onRestaurantPress: (id: string) => void;
}

export default function MostExploredSection({
    fadeAnim,
    slideAnim,
    onRestaurantPress,
}: MostExploredSectionProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time for this section
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200 + Math.random() * 800); // Random delay between 1.2-2 seconds

        return () => clearTimeout(timer);
    }, []);

    const renderMostExploredItem = ({ item }: { item: any }) => (
        <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
        }}>
            <TouchableOpacity
                style={styles.mostExploredItem}
                onPress={() => onRestaurantPress(item.id)}
                activeOpacity={0.8}
            >
                <View style={styles.mostExploredImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.mostExploredImage} />
                    <View style={styles.mostExploredImageOverlay} />
                    <View style={styles.mostExploredRatingBadge}>
                        <Star size={12} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.mostExploredRatingText}>{item.rating}</Text>
                    </View>
                </View>
                <View style={styles.mostExploredContent}>
                    <Text style={styles.mostExploredName}>{item.name}</Text>
                    <Text style={styles.mostExploredCuisine}>{item.cuisine}</Text>
                    <View style={styles.mostExploredDetails}>
                        <View style={styles.mostExploredDistance}>
                            <MapPin size={12} color={getColor('fg.muted')} />
                            <Text style={styles.mostExploredDistanceText}>{item.distance}</Text>
                        </View>
                        <Text style={styles.mostExploredPrice}>{item.priceRange}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    if (isLoading) {
        return (
            <Animated.View style={[styles.mostExploredSection, {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }]}>
                <View style={styles.sectionHeader}>
                    <Skeleton width={180} height={28} />
                    <View style={styles.sectionDivider} />
                </View>
                {[1, 2, 3].map((item) => (
                    <View key={item} style={styles.mostExploredSkeleton}>
                        <Skeleton width={90} height={90} borderRadius={12} />
                        <View style={styles.mostExploredSkeletonContent}>
                            <Skeleton width={140} height={18} />
                            <Skeleton width={100} height={16} style={{ marginTop: 6 }} />
                            <Skeleton width={120} height={14} style={{ marginTop: 12 }} />
                            <Skeleton width={80} height={14} style={{ marginTop: 6 }} />
                        </View>
                    </View>
                ))}
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.mostExploredSection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
        }]}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('home.sections.mostExplored')}</Text>
                <View style={styles.sectionDivider} />
            </View>
            <FlatList
                data={mostExploredRestaurants}
                renderItem={renderMostExploredItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    mostExploredSection: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: getColor('bg.default'),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
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
    mostExploredItem: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: getColor('bg.elevated'),
        borderRadius: 16,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: getColor('border.subtle'),
    },
    mostExploredImageContainer: {
        position: 'relative',
        width: 90,
        height: 90,
        borderRadius: 12,
        marginRight: 16,
        overflow: 'hidden',
    },
    mostExploredImage: {
        width: '100%',
        height: '100%',
    },
    mostExploredImageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    mostExploredRatingBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    mostExploredRatingText: {
        marginLeft: 4,
        fontSize: 12,
        fontFamily: 'Inter-Bold',
        color: 'white',
    },
    mostExploredContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    mostExploredName: {
        fontSize: 18,
        fontFamily: 'Inter-Bold',
        color: getColor('fg.primary'),
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    mostExploredCuisine: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: getColor('fg.muted'),
        marginBottom: 12,
    },
    mostExploredDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mostExploredDistance: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mostExploredDistanceText: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        color: getColor('fg.muted'),
        marginLeft: 4,
    },
    mostExploredPrice: {
        fontSize: 14,
        fontFamily: 'Inter-Bold',
        color: getColor('action.primary'),
        backgroundColor: getColor('action.primary') + '15',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    mostExploredSkeleton: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: getColor('bg.elevated'),
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    mostExploredSkeletonContent: {
        flex: 1,
        marginLeft: 16,
    },
});
