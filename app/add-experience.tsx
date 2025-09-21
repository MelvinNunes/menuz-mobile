import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Camera, Plus, X, MapPin, Clock, Users, ChefHat, Star, Calendar, Tag, Upload, Search, Check } from 'lucide-react-native';
import { ScreenLayout, Header, LoadingSpinner, Badge, UserAvatar } from '@/components';
import { featuredRestaurants } from '@/data/mockData';

interface FoodExperience {
  title: string;
  description: string;
  experienceType: string;
  restaurantId?: string;
  restaurantName?: string;
  location: string;
  date: string;
  participants: number;
  duration: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  cost: string;
  tags: string[];
  photos: PhotoUpload[];
  ingredients?: string[];
  recipe?: string;
  tips?: string;
}

interface PhotoUpload {
  id: string;
  uri?: string;
  uploaded: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  image: string;
  cuisine: string[];
}

const experienceTypes = [
  { id: 'cooking', label: 'Experiência Culinária', icon: ChefHat, color: '#FF6B35', description: 'Aulas de culinária, workshops' },
  { id: 'tasting', label: 'Degustação', icon: Star, color: '#FFA500', description: 'Vinhos, queijos, pratos especiais' },
  { id: 'market', label: 'Mercado Local', icon: MapPin, color: '#10B981', description: 'Tours pelos mercados tradicionais' },
  { id: 'street-food', label: 'Comida de Rua', icon: Users, color: '#3B82F6', description: 'Descoberta de comida de rua' },
  { id: 'home-cooking', label: 'Cozinha Caseira', icon: ChefHat, color: '#8B5CF6', description: 'Experiências em casa' },
  { id: 'food-tour', label: 'Tour Gastronómico', icon: MapPin, color: '#EF4444', description: 'Tours por vários restaurantes' },
];

const popularTags = [
  'tradicional', 'fusion', 'vegetariano', 'vegano', 'picante', 'doce',
  'salgado', 'fresco', 'caseiro', 'gourmet', 'económico', 'premium',
  'rápido', 'demorado', 'família', 'romântico', 'amigos', 'solo',
  'autêntico', 'moderno', 'clássico', 'inovador', 'sazonal', 'local'
];

export default function AddExperienceScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [restaurantSearch, setRestaurantSearch] = useState('');
  
  const [experience, setExperience] = useState<FoodExperience>({
    title: '',
    description: '',
    experienceType: '',
    location: '',
    date: '',
    participants: 1,
    duration: '',
    difficulty: 'Fácil',
    cost: '',
    tags: [],
    photos: [
      { id: '1', uploaded: false },
      { id: '2', uploaded: false },
      { id: '3', uploaded: false },
      { id: '4', uploaded: false },
    ],
    ingredients: [],
    recipe: '',
    tips: '',
  });

  // Filter restaurants based on search
  const filteredRestaurants = featuredRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(restaurantSearch.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(restaurantSearch.toLowerCase()) ||
    restaurant.cuisine.some(c => c.toLowerCase().includes(restaurantSearch.toLowerCase()))
  );

  const handleSubmit = async () => {
    if (!validateExperience()) return;

    setLoading(true);
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Experiência Partilhada!',
        'A sua experiência gastronómica foi partilhada com sucesso na comunidade.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao partilhar a experiência. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const validateExperience = () => {
    if (!experience.title.trim()) {
      Alert.alert('Erro', 'Título da experiência é obrigatório');
      return false;
    }
    if (!experience.description.trim()) {
      Alert.alert('Erro', 'Descrição é obrigatória');
      return false;
    }
    if (!experience.experienceType) {
      Alert.alert('Erro', 'Selecione o tipo de experiência');
      return false;
    }
    if (!experience.location.trim()) {
      Alert.alert('Erro', 'Localização é obrigatória');
      return false;
    }
    return true;
  };

  const simulatePhotoUpload = (photoId: string) => {
    setExperience(prev => ({
      ...prev,
      photos: prev.photos.map(photo =>
        photo.id === photoId 
          ? { ...photo, uploaded: true, uri: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400' }
          : photo
      )
    }));
  };

  const toggleTag = (tag: string) => {
    setExperience(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const addCustomTag = (customTag: string) => {
    if (customTag.trim() && !experience.tags.includes(customTag.trim())) {
      setExperience(prev => ({
        ...prev,
        tags: [...prev.tags, customTag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setExperience(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const selectRestaurant = (restaurant: Restaurant) => {
    setExperience(prev => ({
      ...prev,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      location: restaurant.address, // Auto-fill location
    }));
    setShowRestaurantModal(false);
    setRestaurantSearch('');
  };

  const clearRestaurant = () => {
    setExperience(prev => ({
      ...prev,
      restaurantId: undefined,
      restaurantName: undefined,
      location: '', // Clear location when removing restaurant
    }));
  };

  const renderExperienceTypes = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tipo de Experiência *</Text>
      <Text style={styles.sectionSubtitle}>
        Selecione o tipo que melhor descreve a sua experiência
      </Text>
      <View style={styles.typeGrid}>
        {experienceTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = experience.experienceType === type.id;
          
          return (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                isSelected && { backgroundColor: type.color + '20', borderColor: type.color }
              ]}
              onPress={() => setExperience(prev => ({ ...prev, experienceType: type.id }))}
            >
              <IconComponent 
                size={28} 
                color={isSelected ? type.color : '#6B7280'} 
              />
              <Text style={[
                styles.typeText,
                isSelected && { color: type.color, fontFamily: 'Inter-SemiBold' }
              ]}>
                {type.label}
              </Text>
              <Text style={[
                styles.typeDescription,
                isSelected && { color: type.color }
              ]}>
                {type.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderRestaurantSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Restaurante (Opcional)</Text>
      <Text style={styles.sectionSubtitle}>
        Associe a sua experiência a um restaurante específico
      </Text>
      
      {experience.restaurantId ? (
        <View style={styles.selectedRestaurant}>
          <View style={styles.selectedRestaurantInfo}>
            <UserAvatar 
              imageUri={featuredRestaurants.find(r => r.id === experience.restaurantId)?.image}
              size={50}
            />
            <View style={styles.selectedRestaurantDetails}>
              <Text style={styles.selectedRestaurantName}>{experience.restaurantName}</Text>
              <Text style={styles.selectedRestaurantAddress}>
                {featuredRestaurants.find(r => r.id === experience.restaurantId)?.address}
              </Text>
            </View>
            <Badge text="Selecionado" variant="success" size="small" />
          </View>
          <View style={styles.restaurantActions}>
            <TouchableOpacity 
              style={styles.changeRestaurantButton}
              onPress={() => setShowRestaurantModal(true)}
            >
              <Text style={styles.changeRestaurantText}>Alterar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.removeRestaurantButton}
              onPress={clearRestaurant}
            >
              <X size={16} color="#EF4444" />
              <Text style={styles.removeRestaurantText}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.selectRestaurantButton}
          onPress={() => setShowRestaurantModal(true)}
        >
          <Search size={20} color="#FF6B35" />
          <Text style={styles.selectRestaurantText}>Selecionar Restaurante</Text>
          <Plus size={16} color="#FF6B35" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderRestaurantModal = () => (
    <Modal
      visible={showRestaurantModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowRestaurantModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.restaurantModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Restaurante</Text>
            <TouchableOpacity onPress={() => setShowRestaurantModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar restaurantes..."
                value={restaurantSearch}
                onChangeText={setRestaurantSearch}
                placeholderTextColor="#9CA3AF"
              />
              {restaurantSearch.length > 0 && (
                <TouchableOpacity onPress={() => setRestaurantSearch('')}>
                  <X size={16} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Restaurant List */}
          <FlatList
            data={filteredRestaurants}
            keyExtractor={(item) => item.id}
            style={styles.restaurantList}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.restaurantItem}
                onPress={() => selectRestaurant(item)}
              >
                <UserAvatar 
                  imageUri={item.image}
                  size={50}
                />
                <View style={styles.restaurantItemInfo}>
                  <Text style={styles.restaurantItemName}>{item.name}</Text>
                  <Text style={styles.restaurantItemAddress}>{item.address}</Text>
                  <View style={styles.restaurantItemMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#FFA500" fill="#FFA500" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <View style={styles.cuisineContainer}>
                      {item.cuisine.slice(0, 2).map((cuisine, index) => (
                        <Badge 
                          key={index} 
                          text={cuisine} 
                          variant="secondary" 
                          size="small" 
                          style={styles.cuisineBadge}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                {experience.restaurantId === item.id && (
                  <Check size={20} color="#10B981" />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.restaurantSeparator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyRestaurants}>
                <Text style={styles.emptyRestaurantsText}>
                  Nenhum restaurante encontrado
                </Text>
                <Text style={styles.emptyRestaurantsSubtext}>
                  Tente pesquisar com outros termos
                </Text>
              </View>
            )}
          />

          {/* Skip Option */}
          <TouchableOpacity 
            style={styles.skipRestaurantButton}
            onPress={() => setShowRestaurantModal(false)}
          >
            <Text style={styles.skipRestaurantText}>Continuar sem restaurante</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderPhotoUpload = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fotos da Experiência</Text>
      <Text style={styles.sectionSubtitle}>
        Adicione fotos para tornar a sua experiência mais atrativa
      </Text>
      
      <View style={styles.photoGrid}>
        {experience.photos.map((photo, index) => (
          <TouchableOpacity
            key={photo.id}
            style={[
              styles.photoUploadCard,
              photo.uploaded && styles.photoUploadCardSuccess
            ]}
            onPress={() => simulatePhotoUpload(photo.id)}
          >
            {photo.uploaded ? (
              <View style={styles.photoUploadSuccess}>
                <Image source={{ uri: photo.uri }} style={styles.uploadedPhoto} />
                <View style={styles.photoOverlay}>
                  <Text style={styles.photoNumber}>{index + 1}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.photoUploadArea}>
                <Camera size={24} color="#9CA3AF" />
                <Text style={styles.photoUploadText}>Foto {index + 1}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTagsModal = () => (
    <Modal
      visible={showTagModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowTagModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.tagsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Adicionar Tags</Text>
            <TouchableOpacity onPress={() => setShowTagModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Tags Populares</Text>
            <View style={styles.tagsGrid}>
              {popularTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagChip,
                    experience.tags.includes(tag) && styles.tagChipSelected
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[
                    styles.tagChipText,
                    experience.tags.includes(tag) && styles.tagChipTextSelected
                  ]}>
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSectionTitle}>Tags Selecionadas</Text>
            <View style={styles.selectedTags}>
              {experience.tags.map((tag) => (
                <View key={tag} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>#{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              {experience.tags.length === 0 && (
                <Text style={styles.noTagsText}>Nenhuma tag selecionada</Text>
              )}
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setShowTagModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>Concluído</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScreenLayout>
      <Header title="Partilhar Experiência" showBackButton />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título da Experiência *</Text>
            <TextInput
              style={styles.input}
              value={experience.title}
              onChangeText={(text) => setExperience(prev => ({ ...prev, title: text }))}
              placeholder="Ex: Aula de culinária moçambicana tradicional"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={experience.description}
              onChangeText={(text) => setExperience(prev => ({ ...prev, description: text }))}
              placeholder="Descreva a sua experiência gastronómica em detalhes..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Experience Type */}
        {renderExperienceTypes()}

        {/* Restaurant Selection */}
        {renderRestaurantSelection()}

        {/* Location and Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes da Experiência</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localização *</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={20} color="#9CA3AF" />
              <TextInput
                style={styles.inputWithIconText}
                value={experience.location}
                onChangeText={(text) => setExperience(prev => ({ ...prev, location: text }))}
                placeholder="Ex: Mercado Central, Maputo"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {experience.restaurantId && (
              <Text style={styles.locationNote}>
                Localização preenchida automaticamente com base no restaurante selecionado
              </Text>
            )}
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Data</Text>
              <View style={styles.inputWithIcon}>
                <Calendar size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.inputWithIconText}
                  value={experience.date}
                  onChangeText={(text) => setExperience(prev => ({ ...prev, date: text }))}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Duração</Text>
              <View style={styles.inputWithIcon}>
                <Clock size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.inputWithIconText}
                  value={experience.duration}
                  onChangeText={(text) => setExperience(prev => ({ ...prev, duration: text }))}
                  placeholder="Ex: 2 horas"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Participantes</Text>
              <View style={styles.inputWithIcon}>
                <Users size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.inputWithIconText}
                  value={experience.participants.toString()}
                  onChangeText={(text) => setExperience(prev => ({ ...prev, participants: parseInt(text) || 1 }))}
                  placeholder="1"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Custo Estimado</Text>
              <TextInput
                style={styles.input}
                value={experience.cost}
                onChangeText={(text) => setExperience(prev => ({ ...prev, cost: text }))}
                placeholder="Ex: 500 MZN"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dificuldade</Text>
            <View style={styles.difficultyButtons}>
              {['Fácil', 'Médio', 'Difícil'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    experience.difficulty === level && styles.difficultyButtonActive
                  ]}
                  onPress={() => setExperience(prev => ({ ...prev, difficulty: level as any }))}
                >
                  <Text style={[
                    styles.difficultyButtonText,
                    experience.difficulty === level && styles.difficultyButtonTextActive
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Photos */}
        {renderPhotoUpload()}

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <Text style={styles.sectionSubtitle}>
            Adicione tags para ajudar outros a encontrar a sua experiência
          </Text>
          
          <TouchableOpacity 
            style={styles.addTagsButton}
            onPress={() => setShowTagModal(true)}
          >
            <Tag size={20} color="#FF6B35" />
            <Text style={styles.addTagsButtonText}>
              {experience.tags.length > 0 
                ? `${experience.tags.length} tags selecionadas` 
                : 'Adicionar tags'
              }
            </Text>
            <Plus size={16} color="#FF6B35" />
          </TouchableOpacity>

          {experience.tags.length > 0 && (
            <View style={styles.selectedTagsPreview}>
              {experience.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} text={`#${tag}`} variant="secondary" size="small" />
              ))}
              {experience.tags.length > 3 && (
                <Badge text={`+${experience.tags.length - 3}`} variant="secondary" size="small" />
              )}
            </View>
          )}
        </View>

        {/* Optional Recipe/Tips */}
        {(experience.experienceType === 'cooking' || experience.experienceType === 'home-cooking') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Receita e Dicas (Opcional)</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ingredientes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={experience.ingredients?.join('\n')}
                onChangeText={(text) => setExperience(prev => ({ 
                  ...prev, 
                  ingredients: text.split('\n').filter(i => i.trim()) 
                }))}
                placeholder="Liste os ingredientes principais (um por linha)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Receita/Processo</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={experience.recipe}
                onChangeText={(text) => setExperience(prev => ({ ...prev, recipe: text }))}
                placeholder="Descreva o processo de preparação..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dicas e Truques</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={experience.tips}
                onChangeText={(text) => setExperience(prev => ({ ...prev, tips: text }))}
                placeholder="Partilhe dicas úteis para outros..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size={20} color="white" />
          ) : (
            <>
              <Upload size={20} color="white" />
              <Text style={styles.submitButtonText}>Partilhar Experiência</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modals */}
      {renderTagsModal()}
      {renderRestaurantModal()}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWithIconText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  locationNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    marginTop: 4,
    fontStyle: 'italic',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  typeText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
  },
  typeDescription: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  selectedRestaurant: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
  },
  selectedRestaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedRestaurantDetails: {
    flex: 1,
    marginLeft: 12,
  },
  selectedRestaurantName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  selectedRestaurantAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  restaurantActions: {
    flexDirection: 'row',
    gap: 12,
  },
  changeRestaurantButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeRestaurantText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  removeRestaurantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  removeRestaurantText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  selectRestaurantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderWidth: 2,
    borderColor: '#FFE5D9',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  selectRestaurantText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: '#FF6B35',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  difficultyButtonTextActive: {
    color: 'white',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoUploadCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  photoUploadCardSuccess: {
    borderColor: '#10B981',
    borderStyle: 'solid',
  },
  photoUploadArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  photoUploadText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  photoUploadSuccess: {
    flex: 1,
    position: 'relative',
  },
  uploadedPhoto: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  addTagsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderWidth: 1,
    borderColor: '#FFE5D9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addTagsButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF6B35',
  },
  selectedTagsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  submitContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  restaurantModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  tagsModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  restaurantList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  restaurantItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantItemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  restaurantItemAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  restaurantItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  cuisineContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  cuisineBadge: {
    marginRight: 0,
  },
  restaurantSeparator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  emptyRestaurants: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyRestaurantsText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  emptyRestaurantsSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  skipRestaurantButton: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipRestaurantText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 20,
    marginBottom: 12,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  tagChipSelected: {
    backgroundColor: '#FF6B35',
  },
  tagChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  tagChipTextSelected: {
    color: 'white',
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    minHeight: 40,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedTagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'white',
    marginRight: 6,
  },
  noTagsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  modalCloseButton: {
    backgroundColor: '#FF6B35',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
});