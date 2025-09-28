import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Camera, Plus, X, Clock, MapPin, Phone, Mail, Globe, DollarSign, ChefHat, Navigation, Map } from 'lucide-react-native';
import ScreenLayout from '@/components/layouts/ScreenLayout';
import Header from '@/components/ui/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import LocationPicker from '@/components/ui/LocationPicker';

interface RestaurantSubmission {
  name: string;
  address: string;
  coordinates?: { latitude: number; longitude: number };
  phone: string;
  email: string;
  website: string;
  cuisineTypes: string[];
  priceRange: string;
  description: string;
  operatingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  menuItems: MenuItem[];
  photos: PhotoUpload[];
  agreedToTerms: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  dietaryLabels: string[];
}

interface PhotoUpload {
  id: string;
  type: 'exterior' | 'interior' | 'dish' | 'menu';
  uri?: string;
  uploaded: boolean;
}

const cuisineOptions = [
  'Moçambicana', 'Portuguesa', 'Italiana', 'Chinesa', 'Indiana', 'Francesa',
  'Mediterrânica', 'Frutos do Mar', 'Grelhados', 'Vegetariana', 'Fusion', 'Outras'
];

const priceRanges = [
  { value: '$', label: '$ - Económico (até 200 MZN)' },
  { value: '$$', label: '$$ - Moderado (200-500 MZN)' },
  { value: '$$$', label: '$$$ - Caro (500-1000 MZN)' },
  { value: '$$$$', label: '$$$$ - Muito Caro (1000+ MZN)' }
];

const menuCategories = [
  'Entradas', 'Pratos Principais', 'Sobremesas', 'Bebidas', 'Petiscos', 'Saladas'
];

const dietaryLabels = [
  'Vegetariano', 'Vegano', 'Sem Glúten', 'Halal', 'Kosher', 'Picante', 'Sem Lactose'
];

const daysOfWeek = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
];

export default function SuggestRestaurantScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [submission, setSubmission] = useState<RestaurantSubmission>({
    name: '',
    address: '',
    coordinates: undefined,
    phone: '',
    email: '',
    website: '',
    cuisineTypes: [],
    priceRange: '',
    description: '',
    operatingHours: daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day.key]: { open: '09:00', close: '22:00', closed: false }
    }), {}),
    menuItems: [],
    photos: [
      { id: '1', type: 'exterior', uploaded: false },
      { id: '2', type: 'interior', uploaded: false },
      { id: '3', type: 'dish', uploaded: false },
      { id: '4', type: 'menu', uploaded: false }
    ],
    agreedToTerms: false
  });

  const handleSubmit = async () => {
    if (!validateSubmission()) return;

    setLoading(true);
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Submissão Enviada!',
        'A sua sugestão de restaurante foi enviada com sucesso. A nossa equipa irá analisá-la nos próximos 5 dias úteis.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao enviar a submissão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const validateSubmission = () => {
    if (!submission.name.trim()) {
      Alert.alert('Erro', 'Nome do restaurante é obrigatório');
      return false;
    }
    if (!submission.address.trim()) {
      Alert.alert('Erro', 'Endereço é obrigatório');
      return false;
    }
    if (!submission.phone.trim()) {
      Alert.alert('Erro', 'Telefone é obrigatório');
      return false;
    }
    if (submission.cuisineTypes.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um tipo de culinária');
      return false;
    }
    if (!submission.priceRange) {
      Alert.alert('Erro', 'Selecione uma faixa de preço');
      return false;
    }
    if (!submission.agreedToTerms) {
      Alert.alert('Erro', 'Deve aceitar os termos e condições');
      return false;
    }
    return true;
  };

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      price: '',
      category: 'Pratos Principais',
      dietaryLabels: []
    };
    setSubmission(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, newItem]
    }));
  };

  const updateMenuItem = (id: string, field: keyof MenuItem, value: any) => {
    setSubmission(prev => ({
      ...prev,
      menuItems: prev.menuItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeMenuItem = (id: string) => {
    setSubmission(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter(item => item.id !== id)
    }));
  };

  const toggleCuisineType = (cuisine: string) => {
    setSubmission(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter(c => c !== cuisine)
        : [...prev.cuisineTypes, cuisine]
    }));
  };

  const toggleDietaryLabel = (itemId: string, label: string) => {
    updateMenuItem(itemId, 'dietaryLabels',
      submission.menuItems.find(item => item.id === itemId)?.dietaryLabels.includes(label)
        ? submission.menuItems.find(item => item.id === itemId)?.dietaryLabels.filter(l => l !== label)
        : [...(submission.menuItems.find(item => item.id === itemId)?.dietaryLabels || []), label]
    );
  };

  const simulatePhotoUpload = (photoId: string) => {
    if (Platform.OS === 'web') {
      // Web simulation - in real app, would use file input
      Alert.alert('Funcionalidade de Câmara', 'No ambiente web, esta funcionalidade seria implementada com input de ficheiro.');
      return;
    }

    setSubmission(prev => ({
      ...prev,
      photos: prev.photos.map(photo =>
        photo.id === photoId
          ? { ...photo, uploaded: true, uri: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400' }
          : photo
      )
    }));
  };

  const handleLocationChange = (location: string, coordinates?: { latitude: number; longitude: number }) => {
    setSubmission(prev => ({
      ...prev,
      address: location,
      coordinates: coordinates
    }));
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      // Web geolocation API
      if (!navigator.geolocation) {
        Alert.alert('Erro', 'Geolocalização não é suportada neste navegador');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Simulate reverse geocoding for web
            const locationName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setSubmission(prev => ({
              ...prev,
              address: locationName,
              coordinates: { latitude, longitude }
            }));
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível obter o endereço da localização atual');
          }
        },
        (error) => {
          Alert.alert('Erro', 'Não foi possível obter a localização atual');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      // Native location would be implemented here
      Alert.alert('Funcionalidade de Localização', 'Funcionalidade de localização seria implementada para dispositivos móveis.');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <View key={i} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep > i + 1 && styles.stepCompleted,
            currentStep === i + 1 && styles.stepActive
          ]}>
            <Text style={[
              styles.stepNumber,
              (currentStep > i + 1 || currentStep === i + 1) && styles.stepNumberActive
            ]}>
              {i + 1}
            </Text>
          </View>
          {i < totalSteps - 1 && (
            <View style={[
              styles.stepLine,
              currentStep > i + 1 && styles.stepLineCompleted
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Informações Básicas</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Restaurante *</Text>
        <TextInput
          style={styles.input}
          value={submission.name}
          onChangeText={(text) => setSubmission(prev => ({ ...prev, name: text }))}
          placeholder="Ex: Restaurante Costa do Sol"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Localização do Restaurante *</Text>
        <Text style={styles.helperText}>
          Selecione a localização exata do restaurante para ajudar os clientes a encontrá-lo
        </Text>

        {/* Location Picker Integration */}
        <View style={styles.locationPickerContainer}>
          <LocationPicker
            location={submission.address || 'Selecionar localização'}
            onLocationChange={handleLocationChange}
            containerStyle={styles.locationPicker}
          />
        </View>

        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
        >
          <Navigation size={20} color="#FF6B35" />
          <Text style={styles.currentLocationText}>Usar Localização Atual</Text>
        </TouchableOpacity>

        {/* Manual Address Input */}
        <View style={styles.manualAddressContainer}>
          <Text style={styles.manualAddressLabel}>Ou digite o endereço manualmente:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={submission.address}
            onChangeText={(text) => setSubmission(prev => ({ ...prev, address: text }))}
            placeholder="Rua, número, bairro, cidade"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Coordinates Display */}
        {submission.coordinates && (
          <View style={styles.coordinatesDisplay}>
            <MapPin size={16} color="#10B981" />
            <Text style={styles.coordinatesText}>
              Coordenadas: {submission.coordinates.latitude.toFixed(6)}, {submission.coordinates.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Telefone *</Text>
        <TextInput
          style={styles.input}
          value={submission.phone}
          onChangeText={(text) => setSubmission(prev => ({ ...prev, phone: text }))}
          placeholder="+258 XX XXX XXXX"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={submission.email}
          onChangeText={(text) => setSubmission(prev => ({ ...prev, email: text }))}
          placeholder="contato@restaurante.co.mz"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={submission.website}
          onChangeText={(text) => setSubmission(prev => ({ ...prev, website: text }))}
          placeholder="www.restaurante.co.mz"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  const renderCuisineAndPricing = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Culinária e Preços</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tipos de Culinária *</Text>
        <Text style={styles.helperText}>Selecione todos os tipos aplicáveis</Text>
        <View style={styles.optionsGrid}>
          {cuisineOptions.map((cuisine) => (
            <TouchableOpacity
              key={cuisine}
              style={[
                styles.optionChip,
                submission.cuisineTypes.includes(cuisine) && styles.optionChipSelected
              ]}
              onPress={() => toggleCuisineType(cuisine)}
            >
              <Text style={[
                styles.optionChipText,
                submission.cuisineTypes.includes(cuisine) && styles.optionChipTextSelected
              ]}>
                {cuisine}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Faixa de Preço *</Text>
        {priceRanges.map((range) => (
          <TouchableOpacity
            key={range.value}
            style={[
              styles.priceOption,
              submission.priceRange === range.value && styles.priceOptionSelected
            ]}
            onPress={() => setSubmission(prev => ({ ...prev, priceRange: range.value }))}
          >
            <View style={[
              styles.radioButton,
              submission.priceRange === range.value && styles.radioButtonSelected
            ]} />
            <Text style={styles.priceOptionText}>{range.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição Breve</Text>
        <Text style={styles.helperText}>Máximo 200 caracteres</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={submission.description}
          onChangeText={(text) => {
            if (text.length <= 200) {
              setSubmission(prev => ({ ...prev, description: text }));
            }
          }}
          placeholder="Descreva o ambiente, especialidades, ou características únicas..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
        />
        <Text style={styles.characterCount}>
          {submission.description.length}/200
        </Text>
      </View>
    </View>
  );

  const renderOperatingHours = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Horários de Funcionamento</Text>

      {daysOfWeek.map((day) => (
        <View key={day.key} style={styles.dayContainer}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayLabel}>{day.label}</Text>
            <TouchableOpacity
              style={styles.closedToggle}
              onPress={() => setSubmission(prev => ({
                ...prev,
                operatingHours: {
                  ...prev.operatingHours,
                  [day.key]: {
                    ...prev.operatingHours[day.key],
                    closed: !prev.operatingHours[day.key].closed
                  }
                }
              }))}
            >
              <Text style={[
                styles.closedToggleText,
                submission.operatingHours[day.key].closed && styles.closedToggleTextActive
              ]}>
                {submission.operatingHours[day.key].closed ? 'Fechado' : 'Aberto'}
              </Text>
            </TouchableOpacity>
          </View>

          {!submission.operatingHours[day.key].closed && (
            <View style={styles.timeInputs}>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Abertura</Text>
                <TextInput
                  style={styles.timeField}
                  value={submission.operatingHours[day.key].open}
                  onChangeText={(text) => setSubmission(prev => ({
                    ...prev,
                    operatingHours: {
                      ...prev.operatingHours,
                      [day.key]: { ...prev.operatingHours[day.key], open: text }
                    }
                  }))}
                  placeholder="09:00"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Encerramento</Text>
                <TextInput
                  style={styles.timeField}
                  value={submission.operatingHours[day.key].close}
                  onChangeText={(text) => setSubmission(prev => ({
                    ...prev,
                    operatingHours: {
                      ...prev.operatingHours,
                      [day.key]: { ...prev.operatingHours[day.key], close: text }
                    }
                  }))}
                  placeholder="22:00"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderMenuItems = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Itens do Menu</Text>
      <Text style={styles.stepSubtitle}>Adicione alguns pratos principais (opcional)</Text>

      {submission.menuItems.map((item) => (
        <View key={item.id} style={styles.menuItemCard}>
          <View style={styles.menuItemHeader}>
            <Text style={styles.menuItemTitle}>Item do Menu</Text>
            <TouchableOpacity
              onPress={() => removeMenuItem(item.id)}
              style={styles.removeButton}
            >
              <X size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Prato</Text>
            <TextInput
              style={styles.input}
              value={item.name}
              onChangeText={(text) => updateMenuItem(item.id, 'name', text)}
              placeholder="Ex: Camarão Grelhado"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={item.description}
              onChangeText={(text) => updateMenuItem(item.id, 'description', text)}
              placeholder="Descrição do prato..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.menuItemRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Preço (MZN)</Text>
              <TextInput
                style={styles.input}
                value={item.price}
                onChangeText={(text) => updateMenuItem(item.id, 'price', text)}
                placeholder="150"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categorySelector}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Etiquetas Dietéticas</Text>
            <View style={styles.optionsGrid}>
              {dietaryLabels.map((label) => (
                <TouchableOpacity
                  key={label}
                  style={[
                    styles.dietaryChip,
                    item.dietaryLabels.includes(label) && styles.dietaryChipSelected
                  ]}
                  onPress={() => toggleDietaryLabel(item.id, label)}
                >
                  <Text style={[
                    styles.dietaryChipText,
                    item.dietaryLabels.includes(label) && styles.dietaryChipTextSelected
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addMenuItem}>
        <Plus size={20} color="#FF6B35" />
        <Text style={styles.addButtonText}>Adicionar Item do Menu</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPhotoUpload = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Fotos do Restaurante</Text>
      <Text style={styles.stepSubtitle}>
        Adicione fotos de alta qualidade (JPG/PNG, min 1000x750px, máx 5MB cada)
      </Text>

      <View style={styles.photoGrid}>
        {submission.photos.map((photo) => (
          <View key={photo.id} style={styles.photoUploadCard}>
            <View style={styles.photoUploadHeader}>
              <Text style={styles.photoUploadTitle}>
                {photo.type === 'exterior' && 'Exterior'}
                {photo.type === 'interior' && 'Interior'}
                {photo.type === 'dish' && 'Prato Principal'}
                {photo.type === 'menu' && 'Menu'}
              </Text>
              {photo.uploaded && (
                <Badge text="Carregado" variant="success" size="small" />
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.photoUploadArea,
                photo.uploaded && styles.photoUploadAreaSuccess
              ]}
              onPress={() => simulatePhotoUpload(photo.id)}
            >
              <Camera size={32} color={photo.uploaded ? "#10B981" : "#9CA3AF"} />
              <Text style={[
                styles.photoUploadText,
                photo.uploaded && styles.photoUploadTextSuccess
              ]}>
                {photo.uploaded ? 'Foto Carregada' : 'Tocar para Adicionar'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.termsContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setSubmission(prev => ({ ...prev, agreedToTerms: !prev.agreedToTerms }))}
        >
          <View style={[
            styles.checkbox,
            submission.agreedToTerms && styles.checkboxChecked
          ]}>
            {submission.agreedToTerms && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={styles.termsText}>
            Concordo que as fotos enviadas podem ser utilizadas pela aplicação para fins promocionais
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.noticeContainer}>
        <Text style={styles.noticeText}>
          Todas as submissões serão analisadas pela nossa equipa no prazo de 5 dias úteis.
          Os restaurantes aprovados aparecerão na aplicação principal.
        </Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderBasicInfo();
      case 2: return renderCuisineAndPricing();
      case 3: return renderOperatingHours();
      case 4: return renderMenuItems();
      case 5: return renderPhotoUpload();
      default: return renderBasicInfo();
    }
  };

  return (
    <ScreenLayout>
      <Header title="Sugerir Restaurante" showBackButton />

      {renderStepIndicator()}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={() => setCurrentStep(prev => prev - 1)}
          >
            <Text style={styles.prevButtonText}>Anterior</Text>
          </TouchableOpacity>
        )}

        {currentStep < totalSteps ? (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={() => setCurrentStep(prev => prev + 1)}
          >
            <Text style={styles.nextButtonText}>Próximo</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size={20} color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Enviar Sugestão</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    backgroundColor: '#10B981',
  },
  stepActive: {
    backgroundColor: '#FF6B35',
  },
  stepNumber: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  stepLineCompleted: {
    backgroundColor: '#10B981',
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
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
  characterCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  // Location-specific styles
  locationPickerContainer: {
    marginBottom: 16,
  },
  locationPicker: {
    backgroundColor: 'white',
    borderColor: '#E5E7EB',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    borderWidth: 1,
    borderColor: '#FFE5D9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  currentLocationText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  manualAddressContainer: {
    marginTop: 8,
  },
  manualAddressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  coordinatesDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  coordinatesText: {
    marginLeft: 6,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionChipSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  optionChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  optionChipTextSelected: {
    color: 'white',
  },
  priceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  priceOptionSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF7F5',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FF6B35',
  },
  priceOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  dayContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  closedToggle: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  closedToggleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  closedToggleTextActive: {
    color: '#EF4444',
  },
  timeInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  timeField: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    textAlign: 'center',
  },
  menuItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuItemTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  removeButton: {
    padding: 4,
  },
  menuItemRow: {
    flexDirection: 'row',
  },
  categorySelector: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    textAlign: 'center',
  },
  dietaryChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  dietaryChipSelected: {
    backgroundColor: '#10B981',
  },
  dietaryChipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  dietaryChipTextSelected: {
    color: 'white',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  photoUploadCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  photoUploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoUploadTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  photoUploadArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 24,
    alignItems: 'center',
  },
  photoUploadAreaSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  photoUploadText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  photoUploadTextSuccess: {
    color: '#10B981',
  },
  termsContainer: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  checkmark: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
  },
  noticeContainer: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
  },
  noticeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E40AF',
    lineHeight: 20,
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: '#F3F4F6',
  },
  nextButton: {
    backgroundColor: '#FF6B35',
  },
  submitButton: {
    backgroundColor: '#10B981',
  },
  prevButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});