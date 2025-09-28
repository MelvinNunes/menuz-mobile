import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Filter, Plus, X, Check, ChevronDown } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { featuredRestaurants, promotionalBanners } from '@/data/mockData';
import ScreenLayout from '@/components/layouts/ScreenLayout';
import Header from '@/components/ui/Header';
import LocationPicker from '@/components/ui/LocationPicker';
import SearchBar from '@/components/ui/SearchBar';
import FilterButton from '@/components/ui/FilterButton';
import PromoBanner from '@/components/ui/PromoBanner';
import RestaurantCard from '@/components/ui/RestaurantCard';
import DietaryFilter from '@/components/ui/DietaryFilter';

interface FilterState {
  price: string[];
  cuisine: string[];
  rating: number | null;
  dietary: string[];
  distance: number | null;
  openNow: boolean;
}

const priceRanges = [
  { id: 'budget', label: 'Económico', range: '< 200 MZN', value: 'budget' },
  { id: 'moderate', label: 'Moderado', range: '200-500 MZN', value: 'moderate' },
  { id: 'expensive', label: 'Caro', range: '500-1000 MZN', value: 'expensive' },
  { id: 'luxury', label: 'Luxo', range: '> 1000 MZN', value: 'luxury' },
];

const cuisineTypes = [
  'Moçambicana', 'Portuguesa', 'Italiana', 'Chinesa', 'Indiana', 'Francesa',
  'Mediterrânica', 'Frutos do Mar', 'Grelhados', 'Vegetariana', 'Fusion'
];

const ratingOptions = [
  { value: 4.5, label: '4.5+ estrelas' },
  { value: 4.0, label: '4.0+ estrelas' },
  { value: 3.5, label: '3.5+ estrelas' },
  { value: 3.0, label: '3.0+ estrelas' },
];

const distanceOptions = [
  { value: 1, label: 'Até 1 km' },
  { value: 2, label: 'Até 2 km' },
  { value: 5, label: 'Até 5 km' },
  { value: 10, label: 'Até 10 km' },
];

export default function SearchScreen() {
  const router = useRouter();
  const { focus, t } = useLocalSearchParams();
  const [selectedLocation, setSelectedLocation] = useState('Edu Mondlane Ave');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showDietaryFilters, setShowDietaryFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    price: [],
    cuisine: [],
    rating: null,
    dietary: [],
    distance: null,
    openNow: false,
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (focus === 'true') {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });

      const focusTimeout = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(focusTimeout);
    }
  }, [focus, t]);

  const handleRestaurantPress = (id: string) => {
    router.push(`/restaurant/${id}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSuggestRestaurant = () => {
    router.push('/suggest-restaurant');
  };

  const handleLocationChange = (location: string, coordinates?: { latitude: number; longitude: number }) => {
    setSelectedLocation(location);
    console.log('Location changed in search:', location, coordinates);
  };

  const handleDietaryFilterChange = (dietaryFilters: string[]) => {
    setFilters(prev => ({ ...prev, dietary: dietaryFilters }));
  };

  const togglePriceFilter = (priceRange: string) => {
    setFilters(prev => ({
      ...prev,
      price: prev.price.includes(priceRange)
        ? prev.price.filter(p => p !== priceRange)
        : [...prev.price, priceRange]
    }));
  };

  const toggleCuisineFilter = (cuisine: string) => {
    setFilters(prev => ({
      ...prev,
      cuisine: prev.cuisine.includes(cuisine)
        ? prev.cuisine.filter(c => c !== cuisine)
        : [...prev.cuisine, cuisine]
    }));
  };

  const setRatingFilter = (rating: number | null) => {
    setFilters(prev => ({ ...prev, rating }));
  };

  const setDistanceFilter = (distance: number | null) => {
    setFilters(prev => ({ ...prev, distance }));
  };

  const toggleOpenNow = () => {
    setFilters(prev => ({ ...prev, openNow: !prev.openNow }));
  };

  const clearAllFilters = () => {
    setFilters({
      price: [],
      cuisine: [],
      rating: null,
      dietary: [],
      distance: null,
      openNow: false,
    });
  };

  const getActiveFiltersCount = () => {
    return filters.price.length +
      filters.cuisine.length +
      filters.dietary.length +
      (filters.rating ? 1 : 0) +
      (filters.distance ? 1 : 0) +
      (filters.openNow ? 1 : 0);
  };

  // Filter restaurants based on all criteria
  const filteredRestaurants = featuredRestaurants.filter(restaurant => {
    // Search query filter
    const matchesSearch = searchQuery === '' ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    // Dietary filter
    const matchesDietary = filters.dietary.length === 0 ||
      filters.dietary.some(filter => restaurant.dietary?.includes(filter));

    // Price filter (simplified - in real app would use actual price data)
    const matchesPrice = filters.price.length === 0 || filters.price.includes('moderate');

    // Cuisine filter
    const matchesCuisine = filters.cuisine.length === 0 ||
      filters.cuisine.some(cuisine => restaurant.cuisine.includes(cuisine));

    // Rating filter
    const matchesRating = !filters.rating || restaurant.rating >= filters.rating;

    // Distance filter (simplified - in real app would calculate actual distance)
    const matchesDistance = !filters.distance || true; // Simplified for demo

    // Open now filter (simplified - in real app would check actual hours)
    const matchesOpenNow = !filters.openNow || true; // Simplified for demo

    return matchesSearch && matchesDietary && matchesPrice &&
      matchesCuisine && matchesRating && matchesDistance && matchesOpenNow;
  });

  const renderFiltersModal = () => (
    <Modal
      visible={showFiltersModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFiltersModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filtersModal}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={() => setShowFiltersModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Faixa de Preço</Text>
              <View style={styles.filterOptions}>
                {priceRanges.map((range) => (
                  <TouchableOpacity
                    key={range.id}
                    style={[
                      styles.filterOption,
                      filters.price.includes(range.value) && styles.filterOptionActive
                    ]}
                    onPress={() => togglePriceFilter(range.value)}
                  >
                    <View style={styles.filterOptionContent}>
                      <Text style={[
                        styles.filterOptionText,
                        filters.price.includes(range.value) && styles.filterOptionTextActive
                      ]}>
                        {range.label}
                      </Text>
                      <Text style={[
                        styles.filterOptionSubtext,
                        filters.price.includes(range.value) && styles.filterOptionSubtextActive
                      ]}>
                        {range.range}
                      </Text>
                    </View>
                    {filters.price.includes(range.value) && (
                      <Check size={20} color="#FF6B35" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Cuisine Types */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Tipo de Culinária</Text>
              <View style={styles.filterChips}>
                {cuisineTypes.map((cuisine) => (
                  <TouchableOpacity
                    key={cuisine}
                    style={[
                      styles.filterChip,
                      filters.cuisine.includes(cuisine) && styles.filterChipActive
                    ]}
                    onPress={() => toggleCuisineFilter(cuisine)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      filters.cuisine.includes(cuisine) && styles.filterChipTextActive
                    ]}>
                      {cuisine}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Avaliação Mínima</Text>
              <View style={styles.filterOptions}>
                {ratingOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      filters.rating === option.value && styles.filterOptionActive
                    ]}
                    onPress={() => setRatingFilter(filters.rating === option.value ? null : option.value)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.rating === option.value && styles.filterOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                    {filters.rating === option.value && (
                      <Check size={20} color="#FF6B35" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Distance */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Distância</Text>
              <View style={styles.filterOptions}>
                {distanceOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      filters.distance === option.value && styles.filterOptionActive
                    ]}
                    onPress={() => setDistanceFilter(filters.distance === option.value ? null : option.value)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.distance === option.value && styles.filterOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                    {filters.distance === option.value && (
                      <Check size={20} color="#FF6B35" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Open Now */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filters.openNow && styles.filterOptionActive
                ]}
                onPress={toggleOpenNow}
              >
                <Text style={[
                  styles.filterOptionText,
                  filters.openNow && styles.filterOptionTextActive
                ]}>
                  Aberto agora
                </Text>
                {filters.openNow && (
                  <Check size={20} color="#FF6B35" />
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearAllFilters}
            >
              <Text style={styles.clearFiltersText}>Limpar Filtros</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyFiltersButton}
              onPress={() => setShowFiltersModal(false)}
            >
              <Text style={styles.applyFiltersText}>
                Aplicar ({filteredRestaurants.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const getFilterButtonLabel = (filterType: string) => {
    switch (filterType) {
      case 'all':
        const activeCount = getActiveFiltersCount();
        return activeCount > 0 ? `Filtros (${activeCount})` : 'Filtros';
      case 'rating':
        return filters.rating ? `${filters.rating}+ estrelas` : 'Avaliações';
      case 'price':
        return filters.price.length > 0 ? `Preços (${filters.price.length})` : 'Preços';
      case 'cuisine':
        return filters.cuisine.length > 0 ? `Culinárias (${filters.cuisine.length})` : 'Culinárias';
      case 'dietary':
        return filters.dietary.length > 0 ? `Dieta (${filters.dietary.length})` : 'Dieta';
      default:
        return filterType;
    }
  };

  const isFilterActive = (filterType: string) => {
    switch (filterType) {
      case 'all':
        return getActiveFiltersCount() > 0;
      case 'rating':
        return filters.rating !== null;
      case 'price':
        return filters.price.length > 0;
      case 'cuisine':
        return filters.cuisine.length > 0;
      case 'dietary':
        return filters.dietary.length > 0;
      default:
        return false;
    }
  };

  const handleFilterPress = (filterKey: string) => {
    if (filterKey === 'all') {
      setShowFiltersModal(true);
    } else if (filterKey === 'dietary') {
      setShowDietaryFilters(!showDietaryFilters);
    } else {
      setShowFiltersModal(true);
    }
  };

  const filterButtons = [
    { key: 'all', label: getFilterButtonLabel('all'), icon: Filter },
    { key: 'rating', label: getFilterButtonLabel('rating') },
    { key: 'price', label: getFilterButtonLabel('price') },
    { key: 'cuisine', label: getFilterButtonLabel('cuisine') },
    { key: 'dietary', label: getFilterButtonLabel('dietary') },
  ];

  return (
    <ScreenLayout>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Header */}
        <Header title="Taste of Maputo" showBackButton />

        {/* Location Picker */}
        <View style={styles.locationSection}>
          <LocationPicker
            location={selectedLocation}
            onLocationChange={handleLocationChange}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            ref={searchInputRef}
            placeholder="Pesquise cozinhas, restaurantes"
            value={searchQuery}
            onChangeText={setSearchQuery}
            showClearButton={true}
            onClear={handleClearSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          >
            {filterButtons.map((filter) => (
              <FilterButton
                key={filter.key}
                label={filter.label}
                icon={filter.icon}
                showArrow={filter.key !== 'all'}
                isActive={isFilterActive(filter.key)}
                onPress={() => handleFilterPress(filter.key)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Dietary Filters */}
        {showDietaryFilters && (
          <DietaryFilter
            selectedFilters={filters.dietary}
            onFilterChange={handleDietaryFilterChange}
            style={styles.dietarySection}
          />
        )}

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <View style={styles.activeFiltersSection}>
            <Text style={styles.activeFiltersTitle}>Filtros Ativos:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.activeFiltersList}>
                {filters.price.map(price => (
                  <View key={price} style={styles.activeFilterTag}>
                    <Text style={styles.activeFilterText}>
                      {priceRanges.find(p => p.value === price)?.label}
                    </Text>
                    <TouchableOpacity onPress={() => togglePriceFilter(price)}>
                      <X size={14} color="#FF6B35" />
                    </TouchableOpacity>
                  </View>
                ))}
                {filters.cuisine.map(cuisine => (
                  <View key={cuisine} style={styles.activeFilterTag}>
                    <Text style={styles.activeFilterText}>{cuisine}</Text>
                    <TouchableOpacity onPress={() => toggleCuisineFilter(cuisine)}>
                      <X size={14} color="#FF6B35" />
                    </TouchableOpacity>
                  </View>
                ))}
                {filters.rating && (
                  <View style={styles.activeFilterTag}>
                    <Text style={styles.activeFilterText}>{filters.rating}+ estrelas</Text>
                    <TouchableOpacity onPress={() => setRatingFilter(null)}>
                      <X size={14} color="#FF6B35" />
                    </TouchableOpacity>
                  </View>
                )}
                {filters.distance && (
                  <View style={styles.activeFilterTag}>
                    <Text style={styles.activeFilterText}>Até {filters.distance} km</Text>
                    <TouchableOpacity onPress={() => setDistanceFilter(null)}>
                      <X size={14} color="#FF6B35" />
                    </TouchableOpacity>
                  </View>
                )}
                {filters.openNow && (
                  <View style={styles.activeFilterTag}>
                    <Text style={styles.activeFilterText}>Aberto agora</Text>
                    <TouchableOpacity onPress={toggleOpenNow}>
                      <X size={14} color="#FF6B35" />
                    </TouchableOpacity>
                  </View>
                )}
                {filters.dietary.map(diet => (
                  <View key={diet} style={styles.activeFilterTag}>
                    <Text style={styles.activeFilterText}>
                      {diet === 'vegetarian' ? 'Vegetariano' :
                        diet === 'vegan' ? 'Vegano' :
                          diet === 'gluten-free' ? 'Sem Glúten' :
                            diet === 'seafood' ? 'Frutos do Mar' :
                              diet === 'halal' ? 'Halal' : diet}
                    </Text>
                    <TouchableOpacity onPress={() => handleDietaryFilterChange(filters.dietary.filter(d => d !== diet))}>
                      <X size={14} color="#FF6B35" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.clearAllButton} onPress={clearAllFilters}>
              <Text style={styles.clearAllText}>Limpar Todos</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Promotional Banners */}
        <View style={styles.promoBannersSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
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
                width={300}
                height={100}
              />
            ))}
          </ScrollView>
        </View>

        {/* Results Header */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Melhores restaurantes em Maputo'}
          </Text>
          <Text style={styles.resultsSubtitle}>
            <Text>Mostrar 1-{filteredRestaurants.length} de {filteredRestaurants.length}</Text>
            {getActiveFiltersCount() > 0 && (
              <Text style={styles.filterInfo}>
                {' • '}{getActiveFiltersCount()} filtro{getActiveFiltersCount() > 1 ? 's' : ''} aplicado{getActiveFiltersCount() > 1 ? 's' : ''}
              </Text>
            )}
          </Text>
        </View>

        {/* Restaurant List */}
        <View style={styles.restaurantList}>
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={handleRestaurantPress}
              showFavoriteButton={true}
            />
          ))}

          {filteredRestaurants.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsTitle}>Nenhum resultado encontrado</Text>
              <Text style={styles.noResultsText}>
                Tente ajustar os filtros ou pesquisar por outros termos
              </Text>
              <TouchableOpacity
                style={styles.suggestFromNoResults}
                onPress={handleSuggestRestaurant}
              >
                <Plus size={18} color="#FF6B35" />
                <Text style={styles.suggestFromNoResultsText}>Sugerir Restaurante</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filters Modal */}
      {renderFiltersModal()}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  locationSection: {
    backgroundColor: 'white',
    marginTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filtersSection: {
    backgroundColor: 'white',
    paddingBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  dietarySection: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activeFiltersSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  activeFiltersList: {
    flexDirection: 'row',
    gap: 8,
  },
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderWidth: 1,
    borderColor: '#FFE5D9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FF6B35',
  },
  clearAllButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  clearAllText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  suggestBannerSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestBanner: {
    backgroundColor: '#FFF7F5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  suggestBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestBannerIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestBannerText: {
    flex: 1,
  },
  suggestBannerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  suggestBannerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  promoBannersSection: {
    marginTop: 16,
    backgroundColor: 'white',
    paddingVertical: 16,
  },
  promoBannersContent: {
    paddingHorizontal: 20,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  filterInfo: {
    color: '#FF6B35',
    fontFamily: 'Inter-Medium',
  },
  restaurantList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  suggestFromNoResults: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  suggestFromNoResultsText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filtersModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  filterOptions: {
    gap: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterOptionActive: {
    backgroundColor: '#FFF7F5',
    borderColor: '#FF6B35',
  },
  filterOptionContent: {
    flex: 1,
  },
  filterOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  filterOptionTextActive: {
    color: '#FF6B35',
  },
  filterOptionSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  filterOptionSubtextActive: {
    color: '#FF6B35',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  filterChipTextActive: {
    color: 'white',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  applyFiltersButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});