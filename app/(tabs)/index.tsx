import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Plus, QrCode, Camera, Sparkles, TrendingUp, Clock, Users } from 'lucide-react-native';
import { promotionalBanners, featuredRestaurants } from '@/data/mockData';
import {
  ScreenLayout,
  Header,
  HeroSection,
  RestaurantCard,
  PromoBanner,
  QRCodeScanner
} from '@/components';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState('Edu Mondlane Ave');
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleSearch = () => {
    router.push('/search');
  };

  const handleRestaurantPress = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  const handleCommunityPress = () => {
    router.push('/community');
  };

  const handleSuggestRestaurant = () => {
    router.push('/suggest-restaurant');
  };

  const handleQRScan = (data: string) => {
    console.log('QR Scanned:', data);
  };

  const handleLocationChange = (location: string, coordinates?: { latitude: number; longitude: number }) => {
    setSelectedLocation(location);
    console.log('Location changed:', location, coordinates);
  };

  const handleCategoryPress = (categoryType: string) => {
    router.push(`/category/${categoryType}`);
  };

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enhanced Header */}
        <Header title="Menuz" />

        {/* Enhanced Hero Section */}
        <HeroSection
          title="Já almoçou hoje?"
          subtitle="Descobre as melhores experiências gastronómicas em Maputo"
          backgroundImage="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200"
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          onCommunityPress={handleCommunityPress}
          onSearchPress={handleSearch}
        />

        {/* Enhanced Quick Actions */}
        <View style={styles.quickActionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Acções Rápidas</Text>
            <View style={styles.sectionDivider} />
          </View>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickActionCard, styles.qrCard]}
              onPress={() => setShowQRScanner(true)}
            >
              <View style={styles.quickActionIconContainer}>
                <QrCode size={28} color="#3B82F6" />
                <View style={styles.iconGlow} />
              </View>
              <Text style={styles.quickActionText}>Digitalizar QR</Text>
              <Text style={styles.quickActionSubtext}>Menu digital instantâneo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionCard, styles.suggestCard]}
              onPress={handleSuggestRestaurant}
            >
              <View style={styles.quickActionIconContainer}>
                <Plus size={28} color="#FF6B35" />
                <View style={styles.iconGlow} />
              </View>
              <Text style={styles.quickActionText}>Sugerir Local</Text>
              <Text style={styles.quickActionSubtext}>Partilhe descobertas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Category Cards */}
        <View style={styles.categorySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explorar por Momento</Text>
            <View style={styles.sectionDivider} />
          </View>

          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('dinner')}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.categoryImage}
              />
              {/* Strong dark overlay for better text contrast */}
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
              onPress={() => handleCategoryPress('lunch')}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.categoryImage}
              />
              {/* Strong dark overlay for better text contrast */}
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
        </View>

        {/* Enhanced Promotional Banners */}
        <View style={styles.promoBannersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ofertas Especiais</Text>
            <View style={styles.trendingBadge}>
              <TrendingUp size={14} color="#FF6B35" />
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
        </View>

        {/* Enhanced Featured Restaurants */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Principais Recomendações</Text>
            <TouchableOpacity onPress={() => router.push('/search')} style={styles.seeMoreButton}>
              <Text style={styles.seeMore}>Ver Todos</Text>
              <Sparkles size={16} color="#FF6B35" />
            </TouchableOpacity>
          </View>

          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={handleRestaurantPress}
            />
          ))}
        </View>

        {/* Enhanced Suggest Restaurant CTA */}
        <View style={styles.suggestSection}>
          <View style={styles.suggestCard}>
            <View style={styles.suggestContent}>
              <View style={styles.suggestIconContainer}>
                <Plus size={32} color="#FF6B35" />
                <View style={styles.suggestIconGlow} />
              </View>
              <View style={styles.suggestText}>
                <Text style={styles.suggestTitle}>Conhece um restaurante incrível?</Text>
                <Text style={styles.suggestSubtitle}>
                  Ajude a comunidade a descobrir novos sabores! Sugira o seu restaurante favorito e ganhe pontos de recompensa.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.suggestButton}
              onPress={handleSuggestRestaurant}
              activeOpacity={0.8}
            >
              <Text style={styles.suggestButtonText}>Sugerir Restaurante</Text>
              <Plus size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* QR Scanner Modal */}
      <Modal
        visible={showQRScanner}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <QRCodeScanner
          onClose={() => setShowQRScanner(false)}
          onScan={handleQRScan}
        />
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  sectionDivider: {
    flex: 1,
    height: 2,
    backgroundColor: '#FF6B35',
    marginLeft: 16,
    borderRadius: 1,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  trendingText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  quickActionsSection: {
    paddingVertical: 32,
    backgroundColor: 'white',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  qrCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  quickActionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    top: -8,
    left: -8,
  },
  quickActionText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  quickActionSubtext: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  categorySection: {
    paddingVertical: 32,
    backgroundColor: '#F9FAFB',
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  categoryCard: {
    flex: 1,
    height: 160,
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
    padding: 16,
    zIndex: 2,
  },
  categoryIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 4,
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categorySubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  promoBannersSection: {
    paddingVertical: 32,
    backgroundColor: 'white',
  },
  promoBanners: {
    paddingLeft: 20,
  },
  promoBannersContent: {
    paddingRight: 20,
  },
  featuredSection: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  seeMore: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
    marginRight: 6,
  },
  suggestSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: 'white',
  },
  suggestCard: {
    backgroundColor: '#FFF7F5',
    borderRadius: 24,
    padding: 28,
    borderWidth: 2,
    borderColor: '#FFE5D9',
    elevation: 8,
    shadowColor: '#FF6B35',
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  suggestIconGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    top: -8,
    left: -8,
  },
  suggestText: {
    flex: 1,
  },
  suggestTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  suggestSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    lineHeight: 22,
  },
  suggestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#FF6B35',
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