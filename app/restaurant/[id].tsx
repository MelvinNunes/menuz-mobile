import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, Star, MapPin, Clock, Phone, Heart, MessageCircle, Globe, Share, QrCode } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { featuredRestaurants, mockMenuItems, mockReviews } from '@/data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ScreenLayout, 
  Header, 
  SearchBar, 
  FilterButton, 
  RatingBadge,
  ReviewCard,
  MenuSection,
  DietaryFilter,
  Badge
} from '@/components';

const { width } = Dimensions.get('window');

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('info');
  const [isFavorite, setIsFavorite] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState(mockReviews);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [tabsPosition, setTabsPosition] = useState(0);

  useEffect(() => {
    if (id) {
      const found = featuredRestaurants.find(r => r.id === id);
      setRestaurant(found);
      checkFavoriteStatus(id as string);
    }
  }, [id]);

  const checkFavoriteStatus = async (restaurantId: string) => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const favoritesList = JSON.parse(favorites);
        setIsFavorite(favoritesList.includes(restaurantId));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favoritesList = favorites ? JSON.parse(favorites) : [];
      
      if (isFavorite) {
        favoritesList = favoritesList.filter((favId: string) => favId !== id);
      } else {
        favoritesList.push(id);
      }
      
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesList));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleReviewHelpful = (reviewId: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? {
              ...review,
              isHelpful: !review.isHelpful,
              helpful: review.isHelpful ? review.helpful - 1 : review.helpful + 1
            }
          : review
      )
    );
  };

  const handleShare = () => {
    router.push(`/restaurant-sharing/${id}`);
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    // Assuming the tabs should become sticky after scrolling past the hero section
    // Adjust this threshold based on your header + search + hero height
    const stickyThreshold = 350; // Adjust this value as needed
    setIsTabsSticky(scrollY > stickyThreshold);
  };

  const onTabsLayout = (event: any) => {
    setTabsPosition(event.nativeEvent.layout.y);
  };

  if (!restaurant) {
    return (
      <ScreenLayout>
        <Text>Restaurant not found</Text>
      </ScreenLayout>
    );
  }

  const tabs = [
    { key: 'info', label: 'Informação' },
    { key: 'menu', label: 'Menu' },
    { key: 'reviews', label: 'Avaliações' },
    { key: 'photos', label: 'Fotos' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <View style={styles.tabContent}>
            <View style={styles.restaurantHeader}>
              <RatingBadge rating={restaurant.rating} />
              <Text style={styles.reviewCount}>{restaurant.reviewCount}+ reviews</Text>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={toggleFavorite}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
                <Heart size={16} color={isFavorite ? "#FF6B35" : "#6B7280"} fill={isFavorite ? "#FF6B35" : "transparent"} />
              </TouchableOpacity>
            </View>

            <Text style={styles.restaurantName}>{restaurant.name}</Text>

            <View style={styles.cuisineTypes}>
              {restaurant.cuisine.map((cuisine: string, index: number) => (
                <Badge key={index} text={cuisine} variant="secondary" size="small" style={styles.cuisineBadge} />
              ))}
            </View>

            {/* Dietary Information */}
            {restaurant.dietary && restaurant.dietary.length > 0 && (
              <View style={styles.dietarySection}>
                <Text style={styles.sectionTitle}>Opções Dietéticas</Text>
                <View style={styles.dietaryTags}>
                  {restaurant.dietary.map((diet: string, index: number) => (
                    <Badge 
                      key={index} 
                      text={diet === 'vegetarian' ? 'Vegetariano' : 
                            diet === 'vegan' ? 'Vegano' : 
                            diet === 'gluten-free' ? 'Sem Glúten' :
                            diet === 'seafood' ? 'Frutos do Mar' :
                            diet === 'halal' ? 'Halal' : diet}
                      variant="success" 
                      size="small" 
                      style={styles.dietaryBadge} 
                    />
                  ))}
                </View>
              </View>
            )}

            <View style={styles.addressSection}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.addressText}>{restaurant.address}</Text>
              <TouchableOpacity style={styles.mapButton}>
                <Text style={styles.mapButtonText}>Ver no mapa</Text>
                <MapPin size={14} color="#FF6B35" />
              </TouchableOpacity>
            </View>

            <View style={styles.statusSection}>
              <Clock size={16} color="#10B981" />
              <Text style={styles.statusText}>Aberto</Text>
              <Text style={styles.distanceText}>• {restaurant.distance}</Text>
            </View>

            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Contacto</Text>
              <View style={styles.contactItem}>
                <Phone size={16} color="#6B7280" />
                <Text style={styles.contactText}>{restaurant.phone}</Text>
              </View>
              {restaurant.website && (
                <View style={styles.contactItem}>
                  <Globe size={16} color="#6B7280" />
                  <Text style={styles.contactText}>{restaurant.website}</Text>
                </View>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Phone size={20} color="#FF6B35" />
                <Text style={styles.actionButtonText}>Ligar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MapPin size={20} color="#FF6B35" />
                <Text style={styles.actionButtonText}>Como chegar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <QrCode size={20} color="#FF6B35" />
                <Text style={styles.actionButtonText}>QR & Partilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'menu':
        return (
          <View style={styles.tabContent}>
            <View style={styles.menuFilters}>
              <FilterButton label="Todos" isActive />
              <FilterButton label="Entradas" />
              <FilterButton label="Pratos Principais" />
              <FilterButton label="Sobremesas" />
            </View>

            <Text style={styles.menuHours}>Horários: Quarta 17h – 20h, Quinta – Sábado 17h – 21h, Domingo 17h – 20h</Text>

            <MenuSection
              title="Entradas"
              items={mockMenuItems.starters}
            />

            <MenuSection
              title="Pratos Principais"
              items={mockMenuItems.mains}
            />

            <MenuSection
              title="Sobremesas"
              items={mockMenuItems.desserts}
            />
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.reviewsTitle}>O que {restaurant.reviewCount} pessoas estão a dizer</Text>
            
            <View style={styles.overallRating}>
              <Text style={styles.overallRatingTitle}>Avaliações e comentários gerais</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={20} 
                    color="#FFA500" 
                    fill={star <= Math.floor(restaurant.rating) ? "#FFA500" : "transparent"} 
                  />
                ))}
                <Text style={styles.overallRatingText}>{restaurant.rating} baseado em todas as avaliações</Text>
              </View>
            </View>

            <View style={styles.ratingBreakdown}>
              <View style={styles.ratingCategory}>
                <Text style={styles.ratingScore}>4.6</Text>
                <Text style={styles.ratingLabel}>Comida</Text>
              </View>
              <View style={styles.ratingCategory}>
                <Text style={styles.ratingScore}>4.4</Text>
                <Text style={styles.ratingLabel}>Serviço</Text>
              </View>
              <View style={styles.ratingCategory}>
                <Text style={styles.ratingScore}>4.3</Text>
                <Text style={styles.ratingLabel}>Ambiente</Text>
              </View>
              <View style={styles.ratingCategory}>
                <Text style={styles.ratingScore}>4.2</Text>
                <Text style={styles.ratingLabel}>Valor</Text>
              </View>
            </View>

            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsCount}>{reviews.length} Avaliações</Text>
              <TouchableOpacity style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Mais recentes</Text>
              </TouchableOpacity>
            </View>

            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpfulPress={handleReviewHelpful}
                onReplyPress={(reviewId) => console.log('Reply to:', reviewId)}
                onUserPress={(userId) => console.log('View user:', userId)}
              />
            ))}
          </View>
        );

      case 'photos':
        return (
          <View style={styles.tabContent}>
            <View style={styles.photoFilters}>
              <FilterButton label="Comida" isActive />
              <FilterButton label="Exterior" />
              <FilterButton label="Interior" />
              <FilterButton label="Ambiente" />
            </View>

            <Text style={styles.photoCount}>22 Fotos</Text>
            <Text style={styles.photoSectionTitle}>Comida</Text>

            <View style={styles.photoGrid}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.largePhoto}
              />
              <View style={styles.smallPhotos}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=200' }}
                  style={styles.smallPhoto}
                />
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=200' }}
                  style={styles.smallPhoto}
                />
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.mainScrollView} 
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <Header title="Taste of Maputo" showBackButton />

          {/* Search Bar */}
          <View style={styles.searchSection}>
            <SearchBar placeholder="Pesquise cozinhas, restaurantes" editable={false} />
          </View>

          {/* Hero Image */}
          <View style={styles.heroSection}>
            <Image source={{ uri: restaurant.image }} style={styles.heroImage} />
            <TouchableOpacity style={styles.photoButton}>
              <Camera size={20} color="white" />
              <Text style={styles.photoButtonText}>Ver fotos</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View 
            style={styles.tabsContainer}
            onLayout={onTabsLayout}
          >
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContent}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tab,
                    activeTab === tab.key && styles.activeTab
                  ]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Text style={[
                    styles.tabText,
                    activeTab === tab.key && styles.activeTabText
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tab Content */}
          <View style={styles.contentContainer}>
            {renderTabContent()}
          </View>
        </ScrollView>

        {/* Sticky Tabs Overlay */}
        {isTabsSticky && (
          <View style={styles.stickyTabsOverlay}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContent}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tab,
                    activeTab === tab.key && styles.activeTab
                  ]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Text style={[
                    styles.tabText,
                    activeTab === tab.key && styles.activeTabText
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainScrollView: {
    flex: 1,
  },
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  heroSection: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  photoButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  photoButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  tabsContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stickyTabsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tabsContent: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FF6B35',
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    backgroundColor: 'white',
    padding: 20,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  saveButtonText: {
    marginRight: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  restaurantName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 16,
  },
  cuisineTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  cuisineBadge: {
    marginRight: 8,
    marginBottom: 8,
  },
  dietarySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  dietaryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dietaryBadge: {
    marginRight: 8,
    marginBottom: 4,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapButtonText: {
    marginRight: 4,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF6B35',
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  distanceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  contactSection: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FF6B35',
  },
  menuFilters: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  menuHours: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  reviewsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 20,
  },
  overallRating: {
    marginBottom: 20,
  },
  overallRatingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overallRatingText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  ratingBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  ratingCategory: {
    alignItems: 'center',
  },
  ratingScore: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  ratingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewsCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
  },
  sortButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  photoFilters: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  photoCount: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  photoSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  largePhoto: {
    flex: 2,
    height: 200,
    borderRadius: 8,
  },
  smallPhotos: {
    flex: 1,
    gap: 8,
  },
  smallPhoto: {
    height: 96,
    borderRadius: 8,
  },
});