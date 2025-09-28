import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Clock, Users, Star, MapPin, Filter, ChevronDown, Utensils, Wine, Coffee, Sparkles, TrendingUp, Award } from 'lucide-react-native';
import { featuredRestaurants } from '@/data/mockData';
import ScreenLayout from '@/components/layouts/ScreenLayout';
import Header from '@/components/ui/Header';
import RestaurantCard from '@/components/ui/RestaurantCard';
import FilterButton from '@/components/ui/FilterButton';
import RatingBadge from '@/components/ui/RatingBadge';
import Badge from '@/components/ui/Badge';

const { width, height } = Dimensions.get('window');

// Map of icon names to components
const LucideIcons = {
  Wine,
  Coffee,
  Utensils,
  Clock,
  Users,
  Star,
  MapPin,
  Filter,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Award,
};

interface CategoryData {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  timeRange: string;
  iconName: keyof typeof LucideIcons;
  color: string;
  backgroundColor: string;
  recommendations: string[];
  popularDishes: Array<{
    name: string;
    image: string;
    description: string;
    restaurants: number;
  }>;
  stats: {
    avgPrice: string;
    avgRating: number;
    totalRestaurants: number;
    popularTime: string;
  };
}

const categoryData: Record<string, CategoryData> = {
  dinner: {
    title: 'Para Jantares',
    subtitle: 'Experiências gastronómicas especiais',
    description: 'Descubra os melhores restaurantes para jantares românticos, celebrações especiais e momentos únicos em Maputo.',
    heroImage: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200',
    timeRange: '18:00 - 23:00',
    iconName: 'Wine',
    color: '#8B5CF6',
    backgroundColor: '#F3E8FF',
    recommendations: [
      'Ambiente romântico',
      'Serviço premium',
      'Menu degustação',
      'Vista panorâmica',
      'Música ao vivo'
    ],
    stats: {
      avgPrice: '350 MZN',
      avgRating: 4.6,
      totalRestaurants: 24,
      popularTime: '19:30'
    },
    popularDishes: [
      {
        name: 'Lagosta Grelhada',
        image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Lagosta fresca com molho de manteiga e ervas',
        restaurants: 8
      },
      {
        name: 'Filé Wellington',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Filé de vaca envolvido em massa folhada',
        restaurants: 5
      },
      {
        name: 'Risotto de Camarão',
        image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Risotto cremoso com camarões frescos',
        restaurants: 12
      }
    ]
  },
  lunch: {
    title: 'Para Almoços',
    subtitle: 'Refeições deliciosas e práticas',
    description: 'Encontre os melhores locais para almoços de negócios, refeições familiares e pausas saborosas durante o dia.',
    heroImage: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=1200',
    timeRange: '11:30 - 15:00',
    iconName: 'Coffee',
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
    recommendations: [
      'Serviço rápido',
      'Menu executivo',
      'Ambiente casual',
      'Preços acessíveis',
      'Opções saudáveis'
    ],
    stats: {
      avgPrice: '180 MZN',
      avgRating: 4.3,
      totalRestaurants: 32,
      popularTime: '12:30'
    },
    popularDishes: [
      {
        name: 'Prato do Dia',
        image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Refeição completa com preço especial',
        restaurants: 15
      },
      {
        name: 'Salada Caesar',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Salada fresca com frango grelhado',
        restaurants: 10
      },
      {
        name: 'Pasta Carbonara',
        image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Massa italiana cremosa e saborosa',
        restaurants: 7
      }
    ]
  }
};

export default function CategoryScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categoryType = type as string;
  const data = categoryData[categoryType];

  // Responsive breakpoints
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  if (!data) {
    return (
      <ScreenLayout>
        <Header title="Categoria não encontrada" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Categoria não encontrada</Text>
        </View>
      </ScreenLayout>
    );
  }

  // Filter restaurants based on category type
  const getFilteredRestaurants = () => {
    // In a real app, you would filter based on actual restaurant data
    // For now, we'll return all restaurants with some modifications
    return featuredRestaurants.map(restaurant => ({
      ...restaurant,
      // Add category-specific modifications
      priceRange: categoryType === 'dinner' ?
        `${parseInt(restaurant.priceRange.split(' ')[0]) + 50} MZN` :
        restaurant.priceRange
    }));
  };

  const filteredRestaurants = getFilteredRestaurants();

  const handleRestaurantPress = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
  };

  // Responsive dimensions
  const getHeroHeight = () => {
    if (isSmallScreen) return 350;
    if (isMediumScreen) return 400;
    if (isTablet) return 450;
    return 500;
  };

  const getIconSize = () => {
    if (isSmallScreen) return 28;
    if (isMediumScreen) return 32;
    if (isTablet) return 36;
    return 40;
  };

  const getFontSizes = () => {
    if (isSmallScreen) {
      return {
        title: 28,
        subtitle: 16,
        description: 14,
        statValue: 14,
        statLabel: 11,
        popularTime: 12,
      };
    }
    if (isMediumScreen) {
      return {
        title: 32,
        subtitle: 18,
        description: 16,
        statValue: 16,
        statLabel: 12,
        popularTime: 14,
      };
    }
    if (isTablet) {
      return {
        title: 36,
        subtitle: 20,
        description: 18,
        statValue: 18,
        statLabel: 13,
        popularTime: 15,
      };
    }
    return {
      title: 40,
      subtitle: 22,
      description: 20,
      statValue: 20,
      statLabel: 14,
      popularTime: 16,
    };
  };

  const getSpacing = () => {
    if (isSmallScreen) {
      return {
        horizontal: 16,
        vertical: 20,
        iconMargin: 20,
        statsGap: 12,
        cardPadding: 12,
      };
    }
    if (isMediumScreen) {
      return {
        horizontal: 20,
        vertical: 24,
        iconMargin: 24,
        statsGap: 16,
        cardPadding: 16,
      };
    }
    if (isTablet) {
      return {
        horizontal: 32,
        vertical: 32,
        iconMargin: 32,
        statsGap: 20,
        cardPadding: 20,
      };
    }
    return {
      horizontal: 40,
      vertical: 40,
      iconMargin: 40,
      statsGap: 24,
      cardPadding: 24,
    };
  };

  const heroHeight = getHeroHeight();
  const iconSize = getIconSize();
  const fontSizes = getFontSizes();
  const spacing = getSpacing();

  const renderHeroSection = () => {
    const IconComponent = LucideIcons[data.iconName];

    return (
      <View style={[styles.heroContainer, { height: heroHeight }]}>
        <Image source={{ uri: data.heroImage }} style={styles.heroImage} />

        {/* Enhanced gradient overlay */}
        <View style={styles.heroGradient} />

        <View style={styles.heroOverlay}>
          <View style={[
            styles.heroContent,
            {
              paddingHorizontal: spacing.horizontal,
              maxWidth: isDesktop ? 800 : '100%',
              alignSelf: 'center',
            }
          ]}>
            {/* Enhanced icon with glow effect */}
            <View style={[styles.heroIconContainer, { marginBottom: spacing.iconMargin }]}>
              <View style={[
                styles.heroIconGlow,
                {
                  backgroundColor: data.color + '30',
                  width: iconSize * 3,
                  height: iconSize * 3,
                  borderRadius: iconSize * 1.5,
                  top: -iconSize * 0.5,
                  left: -iconSize * 0.5,
                }
              ]} />
              <View style={[
                styles.heroIcon,
                {
                  backgroundColor: data.backgroundColor,
                  width: iconSize * 2,
                  height: iconSize * 2,
                  borderRadius: iconSize,
                }
              ]}>
                {IconComponent && <IconComponent size={iconSize} color={data.color} />}
              </View>
              <View style={[
                styles.sparkleContainer,
                {
                  top: -iconSize * 0.2,
                  right: -iconSize * 0.2,
                }
              ]}>
                <Sparkles size={iconSize * 0.6} color="#FFD700" fill="#FFD700" />
              </View>
            </View>

            {/* Enhanced title section */}
            <View style={[styles.heroTitleSection, { marginBottom: spacing.vertical }]}>
              <Text style={[
                styles.heroTitle,
                {
                  fontSize: fontSizes.title,
                  marginBottom: spacing.vertical * 0.3,
                }
              ]}>
                {data.title}
              </Text>
              <Text style={[
                styles.heroSubtitle,
                {
                  fontSize: fontSizes.subtitle,
                  marginBottom: spacing.vertical * 0.5,
                }
              ]}>
                {data.subtitle}
              </Text>
              <Text style={[
                styles.heroDescription,
                {
                  fontSize: fontSizes.description,
                  maxWidth: isTablet ? 500 : 320,
                }
              ]}>
                {data.description}
              </Text>
            </View>

            {/* Enhanced stats grid - responsive layout */}
            <View style={[
              styles.heroStatsGrid,
              {
                gap: spacing.statsGap,
                marginBottom: spacing.vertical,
                flexDirection: isSmallScreen ? 'column' : 'row',
                width: '100%',
                maxWidth: isTablet ? 600 : '100%',
              }
            ]}>
              <View style={[
                styles.heroStatCard,
                {
                  padding: spacing.cardPadding,
                  minWidth: isSmallScreen ? '100%' : isTablet ? 120 : 90,
                  flex: isSmallScreen ? 0 : 1,
                }
              ]}>
                <View style={[
                  styles.heroStatIcon,
                  {
                    width: iconSize * 0.9,
                    height: iconSize * 0.9,
                    borderRadius: iconSize * 0.45,
                  }
                ]}>
                  <Clock size={iconSize * 0.5} color={data.color} />
                </View>
                <Text style={[
                  styles.heroStatValue,
                  { fontSize: fontSizes.statValue }
                ]}>
                  {data.timeRange}
                </Text>
                <Text style={[
                  styles.heroStatLabel,
                  { fontSize: fontSizes.statLabel }
                ]}>
                  Horário ideal
                </Text>
              </View>

              <View style={[
                styles.heroStatCard,
                {
                  padding: spacing.cardPadding,
                  minWidth: isSmallScreen ? '100%' : isTablet ? 120 : 90,
                  flex: isSmallScreen ? 0 : 1,
                }
              ]}>
                <View style={[
                  styles.heroStatIcon,
                  {
                    width: iconSize * 0.9,
                    height: iconSize * 0.9,
                    borderRadius: iconSize * 0.45,
                  }
                ]}>
                  <Utensils size={iconSize * 0.5} color={data.color} />
                </View>
                <Text style={[
                  styles.heroStatValue,
                  { fontSize: fontSizes.statValue }
                ]}>
                  {data.stats.totalRestaurants}
                </Text>
                <Text style={[
                  styles.heroStatLabel,
                  { fontSize: fontSizes.statLabel }
                ]}>
                  Restaurantes
                </Text>
              </View>

              <View style={[
                styles.heroStatCard,
                {
                  padding: spacing.cardPadding,
                  minWidth: isSmallScreen ? '100%' : isTablet ? 120 : 90,
                  flex: isSmallScreen ? 0 : 1,
                }
              ]}>
                <View style={[
                  styles.heroStatIcon,
                  {
                    width: iconSize * 0.9,
                    height: iconSize * 0.9,
                    borderRadius: iconSize * 0.45,
                  }
                ]}>
                  <Star size={iconSize * 0.5} color={data.color} />
                </View>
                <Text style={[
                  styles.heroStatValue,
                  { fontSize: fontSizes.statValue }
                ]}>
                  {data.stats.avgRating}
                </Text>
                <Text style={[
                  styles.heroStatLabel,
                  { fontSize: fontSizes.statLabel }
                ]}>
                  Avaliação média
                </Text>
              </View>
            </View>

            {/* Popular time highlight */}
            <View style={[
              styles.popularTimeContainer,
              {
                paddingHorizontal: spacing.cardPadding,
                paddingVertical: spacing.cardPadding * 0.5,
              }
            ]}>
              <TrendingUp size={iconSize * 0.4} color="#FFD700" />
              <Text style={[
                styles.popularTimeText,
                {
                  fontSize: fontSizes.popularTime,
                  marginLeft: spacing.cardPadding * 0.5,
                }
              ]}>
                Horário mais popular: {data.stats.popularTime}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderRecommendations = () => (
    <View style={[
      styles.recommendationsSection,
      {
        paddingHorizontal: spacing.horizontal,
        paddingVertical: spacing.vertical,
      }
    ]}>
      <View style={styles.sectionHeader}>
        <Award size={isTablet ? 28 : 24} color={data.color} />
        <Text style={[
          styles.sectionTitle,
          {
            fontSize: isTablet ? 28 : 24,
            marginLeft: spacing.cardPadding * 0.5,
          }
        ]}>
          O que procurar
        </Text>
      </View>
      <Text style={[
        styles.sectionSubtitle,
        {
          fontSize: isTablet ? 18 : 16,
          marginBottom: spacing.vertical * 0.8,
        }
      ]}>
        Características que tornam {categoryType === 'dinner' ? 'um jantar' : 'um almoço'} especial
      </Text>
      <View style={[
        styles.recommendationsList,
        {
          gap: spacing.statsGap,
          justifyContent: isTablet ? 'center' : 'flex-start',
        }
      ]}>
        {data.recommendations.map((recommendation, index) => (
          <View key={index} style={[
            styles.recommendationChip,
            {
              borderColor: data.color,
              paddingHorizontal: spacing.cardPadding,
              paddingVertical: spacing.cardPadding * 0.6,
              minWidth: isTablet ? 180 : 'auto',
            }
          ]}>
            <View style={[
              styles.recommendationDot,
              { backgroundColor: data.color }
            ]} />
            <Text style={[
              styles.recommendationText,
              {
                color: data.color,
                fontSize: isTablet ? 16 : 14,
              }
            ]}>
              {recommendation}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPopularDishes = () => (
    <View style={[
      styles.popularDishesSection,
      { paddingVertical: spacing.vertical }
    ]}>
      <View style={[
        styles.sectionHeader,
        { paddingHorizontal: spacing.horizontal }
      ]}>
        <Sparkles size={isTablet ? 28 : 24} color={data.color} />
        <Text style={[
          styles.sectionTitle,
          {
            fontSize: isTablet ? 28 : 24,
            marginLeft: spacing.cardPadding * 0.5,
          }
        ]}>
          Pratos Populares
        </Text>
      </View>
      <Text style={[
        styles.sectionSubtitle,
        {
          fontSize: isTablet ? 18 : 16,
          marginBottom: spacing.vertical * 0.8,
          paddingHorizontal: spacing.horizontal,
        }
      ]}>
        Os pratos mais pedidos para {categoryType === 'dinner' ? 'jantar' : 'almoço'}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.dishesScrollContent,
          { paddingHorizontal: spacing.horizontal }
        ]}
      >
        {data.popularDishes.map((dish, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dishCard,
              {
                width: isTablet ? 280 : 220,
                marginRight: spacing.cardPadding,
              }
            ]}
          >
            <View style={styles.dishImageContainer}>
              <Image
                source={{ uri: dish.image }}
                style={[
                  styles.dishImage,
                  { height: isTablet ? 160 : 140 }
                ]}
              />
              <View style={styles.dishImageOverlay}>
                <Badge
                  text="Popular"
                  variant="warning"
                  size="small"
                />
              </View>
            </View>
            <View style={[
              styles.dishContent,
              { padding: spacing.cardPadding }
            ]}>
              <Text style={[
                styles.dishName,
                { fontSize: isTablet ? 20 : 18 }
              ]}>
                {dish.name}
              </Text>
              <Text style={[
                styles.dishDescription,
                {
                  fontSize: isTablet ? 16 : 14,
                  marginBottom: spacing.cardPadding,
                }
              ]}>
                {dish.description}
              </Text>
              <View style={styles.dishMeta}>
                <View style={styles.dishRestaurantsContainer}>
                  <Utensils size={14} color="#6B7280" />
                  <Text style={[
                    styles.dishRestaurants,
                    {
                      fontSize: isTablet ? 15 : 13,
                      marginLeft: 6,
                    }
                  ]}>
                    {dish.restaurants} restaurantes
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFilters = () => {
    const filters = [
      { key: 'all', label: 'Todos' },
      { key: 'rating', label: 'Melhor Avaliados' },
      { key: 'price', label: 'Melhor Preço' },
      { key: 'distance', label: 'Mais Próximos' },
      { key: 'popular', label: 'Mais Populares' }
    ];

    return (
      <View style={[
        styles.filtersSection,
        { paddingVertical: spacing.vertical * 0.8 }
      ]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.filtersContent,
            { paddingHorizontal: spacing.horizontal }
          ]}
        >
          {filters.map((filter) => (
            <FilterButton
              key={filter.key}
              label={filter.label}
              isActive={selectedFilter === filter.key}
              onPress={() => handleFilterPress(filter.key)}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderRestaurantsList = () => (
    <View style={styles.restaurantsSection}>
      <View style={[
        styles.restaurantsHeader,
        {
          paddingHorizontal: spacing.horizontal,
          marginBottom: spacing.vertical * 0.8,
        }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { fontSize: isTablet ? 28 : 24 }
        ]}>
          Restaurantes Recomendados
        </Text>
        <Text style={[
          styles.resultsCount,
          { fontSize: isTablet ? 17 : 15 }
        ]}>
          {filteredRestaurants.length} opções encontradas • Preço médio: {data.stats.avgPrice}
        </Text>
      </View>

      <View style={[
        styles.restaurantsList,
        {
          paddingHorizontal: spacing.horizontal,
          paddingBottom: spacing.vertical,
        }
      ]}>
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={handleRestaurantPress}
            showFavoriteButton={true}
          />
        ))}
      </View>
    </View>
  );

  const renderSpecialOffers = () => {
    const IconComponent = LucideIcons[data.iconName];

    return (
      <View style={[
        styles.specialOffersSection,
        {
          paddingHorizontal: spacing.horizontal,
          paddingVertical: spacing.vertical,
        }
      ]}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={isTablet ? 28 : 24} color={data.color} />
          <Text style={[
            styles.sectionTitle,
            {
              fontSize: isTablet ? 28 : 24,
              marginLeft: spacing.cardPadding * 0.5,
            }
          ]}>
            Ofertas Especiais
          </Text>
        </View>
        <View style={[
          styles.offerCard,
          {
            padding: spacing.cardPadding * 1.2,
            flexDirection: isSmallScreen ? 'column' : 'row',
            alignItems: isSmallScreen ? 'center' : 'flex-start',
          }
        ]}>
          <View style={[
            styles.offerContent,
            {
              flex: isSmallScreen ? 0 : 1,
              alignItems: isSmallScreen ? 'center' : 'flex-start',
              marginBottom: isSmallScreen ? spacing.cardPadding : 0,
            }
          ]}>
            <Text style={[
              styles.offerTitle,
              {
                fontSize: isTablet ? 24 : 20,
                textAlign: isSmallScreen ? 'center' : 'left',
                marginBottom: spacing.cardPadding * 0.4,
              }
            ]}>
              {categoryType === 'dinner' ? 'Menu Degustação' : 'Menu Executivo'}
            </Text>
            <Text style={[
              styles.offerDescription,
              {
                fontSize: isTablet ? 17 : 15,
                textAlign: isSmallScreen ? 'center' : 'left',
                marginBottom: spacing.cardPadding,
              }
            ]}>
              {categoryType === 'dinner'
                ? 'Experiência gastronómica completa com 5 pratos especiais'
                : 'Refeição completa com entrada, prato principal e sobremesa'
              }
            </Text>
            <View style={[
              styles.offerPrice,
              {
                paddingHorizontal: spacing.cardPadding,
                paddingVertical: spacing.cardPadding * 0.5,
              }
            ]}>
              <Text style={[
                styles.offerPriceText,
                { fontSize: isTablet ? 18 : 16 }
              ]}>
                A partir de {categoryType === 'dinner' ? '450' : '180'} MZN
              </Text>
            </View>
          </View>
          <View style={[
            styles.offerIcon,
            {
              backgroundColor: data.backgroundColor,
              width: isTablet ? 90 : 70,
              height: isTablet ? 90 : 70,
              borderRadius: isTablet ? 45 : 35,
              marginLeft: isSmallScreen ? 0 : spacing.cardPadding,
            }
          ]}>
            {IconComponent && <IconComponent size={isTablet ? 32 : 24} color={data.color} />}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenLayout>
      <Header title={data.title} showBackButton />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Enhanced Hero Section */}
        {renderHeroSection()}

        {/* Recommendations */}
        {renderRecommendations()}

        {/* Popular Dishes */}
        {renderPopularDishes()}

        {/* Special Offers */}
        {renderSpecialOffers()}

        {/* Filters */}
        {renderFilters()}

        {/* Restaurants List */}
        {renderRestaurantsList()}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    width: '100%',
  },
  heroIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconGlow: {
    position: 'absolute',
  },
  heroIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sparkleContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  heroTitleSection: {
    alignItems: 'center',
    width: '100%',
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroDescription: {
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroStatsGrid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStatCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  heroStatIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroStatValue: {
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroStatLabel: {
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  popularTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  popularTimeText: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  recommendationsSection: {
    backgroundColor: 'white',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    color: '#374151',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 22,
  },
  recommendationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recommendationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 6,
  },
  recommendationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  recommendationText: {
    fontFamily: 'Inter-SemiBold',
  },
  popularDishesSection: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dishesScrollContent: {
    paddingRight: 20,
  },
  dishCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dishImageContainer: {
    position: 'relative',
  },
  dishImage: {
    width: '100%',
    resizeMode: 'cover',
  },
  dishImageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  dishContent: {
    flex: 1,
  },
  dishName: {
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  dishDescription: {
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  dishMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishRestaurantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishRestaurants: {
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  specialOffersSection: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  offerCard: {
    backgroundColor: '#FFF7F5',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFE5D9',
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  offerContent: {
  },
  offerTitle: {
    fontFamily: 'Inter-Bold',
    color: '#374151',
    letterSpacing: -0.2,
  },
  offerDescription: {
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 22,
  },
  offerPrice: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  offerPriceText: {
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  offerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  filtersSection: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  filtersContent: {
  },
  restaurantsSection: {
    backgroundColor: '#F9FAFB',
    paddingTop: 32,
  },
  restaurantsHeader: {
  },
  resultsCount: {
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    lineHeight: 20,
  },
  restaurantsList: {
  },
});