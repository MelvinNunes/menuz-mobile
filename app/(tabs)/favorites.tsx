import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, Plus, Search, TrendingUp, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { featuredRestaurants } from '@/data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ScreenLayout,
  Header,
  RestaurantCard,
  EmptyState,
  Toast,
  LoadingSpinner
} from '@/components';
import { useToast } from '@/hooks/useToast';

const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    const filtered = featuredRestaurants.filter(restaurant =>
      favorites.includes(restaurant.id)
    );
    setFavoriteRestaurants(filtered);
  }, [favorites]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      showToast('Erro ao carregar favoritos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (restaurantId: string) => {
    try {
      const updatedFavorites = favorites.filter(id => id !== restaurantId);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      const restaurant = featuredRestaurants.find(r => r.id === restaurantId);
      showToast(`${restaurant?.name} removido dos favoritos`, 'success');
    } catch (error) {
      console.error('Error removing favorite:', error);
      showToast('Erro ao remover favorito', 'error');
    }
  };

  const handleRestaurantPress = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  const handleSuggestRestaurant = () => {
    router.push('/suggest-restaurant');
  };

  const renderRestaurant = ({ item }: { item: any }) => (
    <RestaurantCard
      restaurant={item}
      onPress={handleRestaurantPress}
      onFavoritePress={removeFavorite}
      isFavorite={true}
      showFavoriteButton={true}
    />
  );


  const renderStatsCard = () => {
    const totalRating = favoriteRestaurants.reduce((sum, restaurant) => sum + restaurant.rating, 0);
    const averageRating = favoriteRestaurants.length > 0 ? (totalRating / favoriteRestaurants.length).toFixed(1) : '0.0';

    return (
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Heart size={20} color="#FF6B35" fill="#FF6B35" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{favoriteRestaurants.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Star size={20} color="#FFA500" fill="#FFA500" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{averageRating}</Text>
            <Text style={styles.statLabel}>Avaliação Média</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <EmptyState
        icon={Heart}
        title="Nenhum favorito ainda"
        subtitle="Comece a explorar e adicione seus restaurantes favoritos para criar a sua lista personalizada"
        buttonText="Explorar Restaurantes"
        onButtonPress={() => router.push('/search')}
        iconColor="#FF6B35"
      />
    </View>
  );

  if (loading) {
    return (
      <ScreenLayout>
        <Header title="Seus Favoritos" />
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={40} color="#FF6B35" />
          <Text style={styles.loadingText}>Carregando favoritos...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      {/* Enhanced Header */}
      <Header title="Seus Favoritos" />

      {favoriteRestaurants.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {/* Stats Card */}
          {renderStatsCard()}

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seus Restaurantes Favoritos</Text>
            <Text style={styles.sectionSubtitle}>
              Toque no coração para remover dos favoritos
            </Text>
          </View>

          {/* Restaurant List */}
          <FlatList
            data={favoriteRestaurants}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.restaurantList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
  quickActionsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: '#FAFAFA',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  restaurantList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    backgroundColor: '#F9FAFB',
  },
  separator: {
    height: 16,
  },
  emptyStateContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});