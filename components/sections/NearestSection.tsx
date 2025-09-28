import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Animated } from 'react-native';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { nearestRestaurants } from '@/data/mockData';
import { getColor } from '@/theme/colors';
import { Skeleton } from '@/components';

interface NearestSectionProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    onRestaurantPress: (id: string) => void;
}

export default function NearestSection({
    fadeAnim,
    slideAnim,
    onRestaurantPress,
}: NearestSectionProps) {
    const router = useRouter();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time for this section
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1100 + Math.random() * 900); // Random delay between 1.1-2 seconds

        return () => clearTimeout(timer);
    }, []);

    const renderNearestItem = ({ item }: { item: any }) => (
        <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
        }}>
            <TouchableOpacity
                style={styles.nearestItem}
                onPress={() => onRestaurantPress(item.id)}
                activeOpacity={0.8}
            >
                <View style={styles.nearestImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.nearestImage} />
                    <View style={styles.nearestImageOverlay} />
                </View>
                <View style={styles.nearestContent}>
                    <Text style={styles.nearestName}>{item.name}</Text>
                    <Text style={styles.nearestCuisine}>{item.cuisine}</Text>
                    <View style={styles.nearestDistance}>
                        <MapPin size={12} color={getColor('fg.muted')} />
                        <Text style={styles.nearestDistanceText}>{item.distance}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    if (isLoading) {
        return (
            <Animated.View style={[styles.nearestSection, {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }]}>
                <View style={styles.sectionHeader}>
                    <Skeleton width={150} height={28} />
                    <View style={styles.seeAllButtonSkeleton}>
                        <Skeleton width={80} height={32} borderRadius={20} />
                    </View>
                </View>
                {[1, 2, 3, 4].map((item) => (
                    <View key={item} style={styles.nearestSkeleton}>
                        <Skeleton width={70} height={70} borderRadius={12} />
                        <View style={styles.nearestSkeletonContent}>
                            <Skeleton width={120} height={16} />
                            <Skeleton width={100} height={14} style={{ marginTop: 6 }} />
                            <Skeleton width={80} height={12} style={{ marginTop: 8 }} />
                        </View>
                    </View>
                ))}
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.nearestSection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
        }]}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('home.sections.nearest')}</Text>
                <TouchableOpacity onPress={() => router.push('/search')} style={styles.seeAllButton}>
                    <Text style={styles.seeAllText}>{t('home.sections.seeAll')}</Text>
                    <ChevronRight size={16} color={getColor('action.primary')} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={nearestRestaurants}
                renderItem={renderNearestItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    nearestSection: {
        paddingHorizontal: 20,
        paddingVertical: 15,
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
    nearestItem: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: getColor('bg.elevated'),
        borderRadius: 16,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: getColor('border.subtle'),
    },
    nearestImageContainer: {
        position: 'relative',
        width: 70,
        height: 70,
        borderRadius: 12,
        marginRight: 16,
        overflow: 'hidden',
    },
    nearestImage: {
        width: '100%',
        height: '100%',
    },
    nearestImageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    nearestContent: {
        flex: 1,
        justifyContent: 'center',
    },
    nearestName: {
        fontSize: 16,
        fontFamily: 'Inter-Bold',
        color: getColor('fg.primary'),
        marginBottom: 6,
        letterSpacing: -0.2,
    },
    nearestCuisine: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: getColor('fg.muted'),
        marginBottom: 8,
    },
    nearestDistance: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nearestDistanceText: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        color: getColor('fg.muted'),
        marginLeft: 4,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: getColor('action.primary') + '15',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: getColor('action.primary') + '30',
    },
    seeAllText: {
        fontSize: 14,
        fontFamily: 'Inter-Bold',
        color: getColor('action.primary'),
        marginRight: 4,
    },
    seeAllButtonSkeleton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nearestSkeleton: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: getColor('bg.elevated'),
        borderRadius: 16,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: getColor('border.subtle'),
    },
    nearestSkeletonContent: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
});
