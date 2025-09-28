import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { promotionalBanners } from '@/data/mockData';
import PromoBanner from '@/components/ui/PromoBanner';
import { getColor } from '@/theme/colors';

const { width } = Dimensions.get('window');

interface PromoBannersSectionProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

export default function PromoBannersSection({
    fadeAnim,
    slideAnim,
}: PromoBannersSectionProps) {
    return (
        <Animated.View style={[styles.promoBannersSection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
        }]}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ofertas Especiais</Text>
                <View style={styles.trendingBadge}>
                    <TrendingUp size={14} color={getColor('action.primary')} />
                    <Text style={styles.trendingText}>Em Alta</Text>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.promoBanners}
                contentContainerStyle={styles.promoBannersContent}
            >
                {promotionalBanners.map((banner, index) => (
                    <PromoBanner
                        key={index}
                        title={banner.title}
                        discount={banner.discount}
                        description={banner.description}
                        image={banner.image}
                        promotionId={banner.id}
                        width={width * 0.8}
                    />
                ))}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    promoBannersSection: {
        paddingVertical: 32,
        backgroundColor: getColor('bg.default'),
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
    trendingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: getColor('action.primary') + '15',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: getColor('action.primary') + '30',
    },
    trendingText: {
        marginLeft: 6,
        fontSize: 12,
        fontFamily: 'Inter-Bold',
        color: getColor('action.primary'),
    },
    promoBanners: {
        paddingLeft: 20,
    },
    promoBannersContent: {
        paddingRight: 20,
    },
});
