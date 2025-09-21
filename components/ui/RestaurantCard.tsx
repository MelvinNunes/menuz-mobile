import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { MapPin, Clock, Heart, Star, Zap } from 'lucide-react-native';
import RatingBadge from './RatingBadge';

const { width: screenWidth } = Dimensions.get('window');

interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  distance: string;
  priceRange: string;
  hasPromotion?: boolean;
  image: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: (id: string) => void;
  onFavoritePress?: (id: string) => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
  style?: any;
}

export default function RestaurantCard({
  restaurant,
  onPress,
  onFavoritePress,
  isFavorite = false,
  showFavoriteButton = false,
  style
}: RestaurantCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const favoriteAnim = React.useRef(new Animated.Value(isFavorite ? 1 : 0)).current;
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(favoriteAnim, {
      toValue: isFavorite ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isFavorite]);

  React.useEffect(() => {
    if (restaurant.hasPromotion) {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      shimmer.start();
      return () => shimmer.stop();
    }
  }, [restaurant.hasPromotion]);

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

  const handleFavoritePress = () => {
    // Add haptic feedback animation
    Animated.sequence([
      Animated.spring(favoriteAnim, {
        toValue: 1.3,
        useNativeDriver: true,
        tension: 400,
        friction: 3,
      }),
      Animated.spring(favoriteAnim, {
        toValue: isFavorite ? 0 : 1,
        useNativeDriver: true,
        tension: 400,
        friction: 8,
      }),
    ]).start();
    
    onFavoritePress?.(restaurant.id);
  };

  // Calculate responsive dimensions
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 768;
  const isLargeScreen = screenWidth >= 768;

  const getImageHeight = () => {
    if (isSmallScreen) return 180;
    if (isMediumScreen) return 200;
    return 220;
  };

  const getCardPadding = () => {
    if (isSmallScreen) return 16;
    if (isMediumScreen) return 20;
    return 24;
  };

  const getFontSizes = () => {
    if (isSmallScreen) {
      return {
        name: 18,
        address: 14,
        reviewCount: 14,
        detailText: 14,
        priceRange: 14,
        promotion: 12,
      };
    }
    if (isMediumScreen) {
      return {
        name: 20,
        address: 15,
        reviewCount: 15,
        detailText: 15,
        priceRange: 15,
        promotion: 13,
      };
    }
    return {
      name: 22,
      address: 16,
      reviewCount: 16,
      detailText: 16,
      priceRange: 16,
      promotion: 14,
    };
  };

  const fontSizes = getFontSizes();
  const imageHeight = getImageHeight();
  const cardPadding = getCardPadding();

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View style={[
      styles.container, 
      { 
        transform: [{ scale: scaleAnim }],
        marginHorizontal: isLargeScreen ? 8 : 0,
        maxWidth: isLargeScreen ? 420 : '100%',
        alignSelf: isLargeScreen ? 'center' : 'stretch',
      }, 
      style
    ]}>
      <TouchableOpacity 
        onPress={() => onPress(restaurant.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.touchableContainer}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: restaurant.image }} 
            style={[styles.image, { height: imageHeight }]}
            resizeMode="cover"
          />
          
          {/* Gradient overlay for better text readability */}
          <View style={styles.imageGradient} />
          
          {restaurant.hasPromotion && (
            <Animated.View style={[
              styles.promotionBadge,
              {
                paddingHorizontal: isSmallScreen ? 10 : 14,
                paddingVertical: isSmallScreen ? 6 : 8,
                opacity: shimmerOpacity,
              }
            ]}>
              <Zap size={isSmallScreen ? 14 : 16} color="white" fill="white" />
              <Text style={[
                styles.promotionText,
                { fontSize: fontSizes.promotion, marginLeft: 4 }
              ]}>
                Em Promoção
              </Text>
            </Animated.View>
          )}

          {/* Rating badge overlay */}
          <View style={styles.ratingOverlay}>
            <View style={styles.ratingBadgeContainer}>
              <Star size={14} color="#FFA500" fill="#FFA500" />
              <Text style={styles.ratingOverlayText}>{restaurant.rating}</Text>
            </View>
          </View>

          {showFavoriteButton && (
            <TouchableOpacity 
              style={[
                styles.favoriteButton,
                {
                  width: isSmallScreen ? 40 : 44,
                  height: isSmallScreen ? 40 : 44,
                  borderRadius: isSmallScreen ? 20 : 22,
                }
              ]}
              onPress={handleFavoritePress}
              activeOpacity={0.8}
            >
              <Animated.View style={{ 
                transform: [{ scale: favoriteAnim }],
                opacity: favoriteAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                })
              }}>
                <Heart 
                  size={isSmallScreen ? 20 : 22} 
                  color={isFavorite ? "#FF6B35" : "#374151"} 
                  fill={isFavorite ? "#FF6B35" : "transparent"} 
                />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.info, { padding: cardPadding }]}>
          <View style={styles.headerRow}>
            <Text 
              style={[
                styles.name, 
                { 
                  fontSize: fontSizes.name,
                  flex: 1,
                }
              ]} 
              numberOfLines={2}
            >
              {restaurant.name}
            </Text>
            <Text 
              style={[
                styles.priceRange,
                { fontSize: fontSizes.priceRange }
              ]}
            >
              {restaurant.priceRange}
            </Text>
          </View>
          
          <View style={[
            styles.meta,
            { marginBottom: isSmallScreen ? 8 : 12 }
          ]}>
            <MapPin size={isSmallScreen ? 14 : 16} color="#9CA3AF" />
            <Text 
              style={[
                styles.address, 
                { 
                  fontSize: fontSizes.address,
                  marginLeft: isSmallScreen ? 4 : 6,
                }
              ]} 
              numberOfLines={1}
            >
              {restaurant.address}
            </Text>
          </View>
          
          <View style={styles.bottomRow}>
            <View style={styles.stats}>
              <RatingBadge 
                rating={restaurant.rating} 
                size={isSmallScreen ? "small" : "medium"} 
              />
            </View>

            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={[styles.statusText, { fontSize: fontSizes.detailText }]}>
                Aberto
              </Text>
              <Text style={[styles.distanceText, { fontSize: fontSizes.detailText }]}>
                • {restaurant.distance}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  touchableContainer: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  image: {
    width: '100%',
    backgroundColor: '#F3F4F6',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
  },
  promotionBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#EF4444',
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promotionText: {
    fontFamily: 'Inter-Bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  ratingBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingOverlayText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  info: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  priceRange: {
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
    marginLeft: 12,
    backgroundColor: '#FFF7F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  address: {
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    flex: 1,
    flexShrink: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewCount: {
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  distanceText: {
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginLeft: 4,
  },
});