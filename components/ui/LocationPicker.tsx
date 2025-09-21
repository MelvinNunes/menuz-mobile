import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Platform, ScrollView, Dimensions } from 'react-native';
import { MapPin, Navigation, X, Search, Check, Map, Plus } from 'lucide-react-native';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

interface LocationPickerProps {
  location: string;
  onLocationChange?: (location: string, coordinates?: { latitude: number; longitude: number }) => void;
  containerStyle?: any;
}

interface LocationOption {
  id: string;
  name: string;
  address: string;
  coordinates?: { latitude: number; longitude: number };
  type: 'current' | 'saved' | 'search' | 'map';
}

interface MapCoordinate {
  latitude: number;
  longitude: number;
}

const savedLocations: LocationOption[] = [
  {
    id: '1',
    name: 'Centro de Maputo',
    address: 'Av. Julius Nyerere, Maputo',
    coordinates: { latitude: -25.9692, longitude: 32.5732 },
    type: 'saved'
  },
  {
    id: '2',
    name: 'Costa do Sol',
    address: 'Av. Marginal, Costa do Sol',
    coordinates: { latitude: -25.9342, longitude: 32.6052 },
    type: 'saved'
  },
  {
    id: '3',
    name: 'Polana',
    address: 'Bairro da Polana, Maputo',
    coordinates: { latitude: -25.9553, longitude: 32.5892 },
    type: 'saved'
  },
  {
    id: '4',
    name: 'Sommerschield',
    address: 'Bairro Sommerschield, Maputo',
    coordinates: { latitude: -25.9445, longitude: 32.5998 },
    type: 'saved'
  },
  {
    id: '5',
    name: 'Catembe',
    address: 'Catembe, Maputo',
    coordinates: { latitude: -25.9897, longitude: 32.5732 },
    type: 'saved'
  },
  {
    id: '6',
    name: 'Matola',
    address: 'Cidade da Matola',
    coordinates: { latitude: -25.9622, longitude: 32.4589 },
    type: 'saved'
  },
  {
    id: '7',
    name: 'Aeroporto Internacional de Maputo',
    address: 'Aeroporto de Mavalane, Maputo',
    coordinates: { latitude: -25.9208, longitude: 32.5726 },
    type: 'saved'
  },
  {
    id: '8',
    name: 'Universidade Eduardo Mondlane',
    address: 'Av. Julius Nyerere, Campus Principal',
    coordinates: { latitude: -25.9576, longitude: 32.5845 },
    type: 'saved'
  },
  {
    id: '9',
    name: 'Mercado Central',
    address: 'Av. 25 de Setembro, Centro',
    coordinates: { latitude: -25.9658, longitude: 32.5692 },
    type: 'saved'
  },
  {
    id: '10',
    name: 'Marginal de Maputo',
    address: 'Av. Marginal, Maputo Bay',
    coordinates: { latitude: -25.9612, longitude: 32.5892 },
    type: 'saved'
  }
];

export default function LocationPicker({ 
  location, 
  onLocationChange, 
  containerStyle 
}: LocationPickerProps) {
  const [showModal, setShowModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationOption | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [mapCenter, setMapCenter] = useState<MapCoordinate>({ latitude: -25.9692, longitude: 32.5732 });
  const [selectedMapLocation, setSelectedMapLocation] = useState<MapCoordinate | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      // Web geolocation API
      if (!navigator.geolocation) {
        Alert.alert('Erro', 'Geolocalização não é suportada neste navegador');
        return;
      }

      setLoadingLocation(true);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding simulation for web
            const locationName = await reverseGeocode(latitude, longitude);
            const currentLoc: LocationOption = {
              id: 'current',
              name: 'Localização Atual',
              address: locationName,
              coordinates: { latitude, longitude },
              type: 'current'
            };
            
            setCurrentLocation(currentLoc);
            setMapCenter({ latitude, longitude });
            setLoadingLocation(false);
          } catch (error) {
            setLoadingLocation(false);
            Alert.alert('Erro', 'Não foi possível obter o endereço da localização atual');
          }
        },
        (error) => {
          setLoadingLocation(false);
          Alert.alert('Erro', 'Não foi possível obter a localização atual');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      // Native location API
      try {
        setLoadingLocation(true);
        
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        const { latitude, longitude } = location.coords;
        
        // Reverse geocoding
        const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        
        if (reverseGeocodedAddress.length > 0) {
          const address = reverseGeocodedAddress[0];
          const locationName = `${address.street || ''} ${address.streetNumber || ''}`.trim() || 
                             `${address.district || address.city || 'Localização Atual'}`;
          
          const currentLoc: LocationOption = {
            id: 'current',
            name: 'Localização Atual',
            address: locationName,
            coordinates: { latitude, longitude },
            type: 'current'
          };
          
          setCurrentLocation(currentLoc);
          setMapCenter({ latitude, longitude });
        }
        
        setLoadingLocation(false);
      } catch (error) {
        setLoadingLocation(false);
        Alert.alert('Erro', 'Não foi possível obter a localização atual');
      }
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    // Simulate reverse geocoding for web
    // In a real app, you would use a geocoding service like Google Maps API
    const maputoCenter = { lat: -25.9692, lng: 32.5732 };
    const distance = Math.sqrt(
      Math.pow(latitude - maputoCenter.lat, 2) + Math.pow(longitude - maputoCenter.lng, 2)
    );
    
    if (distance < 0.05) {
      return 'Centro de Maputo';
    } else if (distance < 0.1) {
      return 'Maputo';
    } else {
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const handleLocationSelect = (locationOption: LocationOption) => {
    setSelectedLocation(locationOption.address);
    onLocationChange?.(locationOption.address, locationOption.coordinates);
    setShowModal(false);
  };

  const openMapSelection = () => {
    setShowModal(false);
    setShowMapModal(true);
  };

  const handleMapLocationSelect = async () => {
    if (!selectedMapLocation) {
      Alert.alert('Erro', 'Por favor, selecione uma localização no mapa');
      return;
    }

    try {
      const locationName = await reverseGeocode(selectedMapLocation.latitude, selectedMapLocation.longitude);
      const mapLocation: LocationOption = {
        id: 'map-selected',
        name: 'Localização Selecionada',
        address: locationName,
        coordinates: selectedMapLocation,
        type: 'map'
      };

      handleLocationSelect(mapLocation);
      setShowMapModal(false);
      setSelectedMapLocation(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter o endereço da localização selecionada');
    }
  };

  const renderInteractiveMap = () => (
    <Modal
      visible={showMapModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowMapModal(false)}
    >
      <View style={styles.mapModalOverlay}>
        <View style={styles.mapModalContainer}>
          {/* Map Header */}
          <View style={styles.mapHeader}>
            <TouchableOpacity onPress={() => setShowMapModal(false)}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Selecionar no Mapa</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Interactive Map Area */}
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              {/* Map Grid Background */}
              <View style={styles.mapGrid}>
                {Array.from({ length: 20 }, (_, i) => (
                  <View key={`h-${i}`} style={[styles.gridLine, styles.horizontalLine, { top: i * 20 }]} />
                ))}
                {Array.from({ length: 15 }, (_, i) => (
                  <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: i * 25 }]} />
                ))}
              </View>

              {/* Maputo Landmarks */}
              <View style={styles.landmarksContainer}>
                {savedLocations.slice(0, 6).map((landmark, index) => (
                  <TouchableOpacity
                    key={landmark.id}
                    style={[
                      styles.landmark,
                      {
                        left: `${20 + (index % 3) * 30}%`,
                        top: `${25 + Math.floor(index / 3) * 35}%`,
                      }
                    ]}
                    onPress={() => setSelectedMapLocation(landmark.coordinates!)}
                  >
                    <View style={[
                      styles.landmarkPin,
                      selectedMapLocation?.latitude === landmark.coordinates?.latitude && 
                      selectedMapLocation?.longitude === landmark.coordinates?.longitude && 
                      styles.selectedLandmarkPin
                    ]}>
                      <MapPin size={16} color="white" />
                    </View>
                    <Text style={styles.landmarkLabel}>{landmark.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tap to Select Overlay */}
              <TouchableOpacity
                style={styles.mapTouchArea}
                onPress={(event) => {
                  const { locationX, locationY } = event.nativeEvent;
                  const mapWidth = width - 40;
                  const mapHeight = 300;
                  
                  // Convert touch coordinates to lat/lng (simplified)
                  const lat = -25.9692 + (locationY / mapHeight - 0.5) * 0.1;
                  const lng = 32.5732 + (locationX / mapWidth - 0.5) * 0.1;
                  
                  setSelectedMapLocation({ latitude: lat, longitude: lng });
                }}
              >
                {selectedMapLocation && (
                  <View style={[
                    styles.selectedPin,
                    {
                      left: `${((selectedMapLocation.longitude - 32.5732) / 0.1 + 0.5) * 100}%`,
                      top: `${((selectedMapLocation.latitude + 25.9692) / 0.1 + 0.5) * 100}%`,
                    }
                  ]}>
                    <View style={styles.selectedPinInner}>
                      <MapPin size={20} color="white" />
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              {/* Instructions */}
              <View style={styles.mapInstructions}>
                <Text style={styles.instructionsText}>
                  Toque no mapa para selecionar uma localização
                </Text>
              </View>
            </View>
          </View>

          {/* Selected Location Info */}
          {selectedMapLocation && (
            <View style={styles.selectedLocationInfo}>
              <View style={styles.selectedLocationDetails}>
                <MapPin size={20} color="#FF6B35" />
                <View style={styles.selectedLocationText}>
                  <Text style={styles.selectedLocationTitle}>Localização Selecionada</Text>
                  <Text style={styles.selectedLocationCoords}>
                    {selectedMapLocation.latitude.toFixed(4)}, {selectedMapLocation.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Map Actions */}
          <View style={styles.mapActions}>
            <TouchableOpacity
              style={styles.cancelMapButton}
              onPress={() => {
                setShowMapModal(false);
                setSelectedMapLocation(null);
              }}
            >
              <Text style={styles.cancelMapButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmMapButton,
                !selectedMapLocation && styles.confirmMapButtonDisabled
              ]}
              onPress={handleMapLocationSelect}
              disabled={!selectedMapLocation}
            >
              <Text style={[
                styles.confirmMapButtonText,
                !selectedMapLocation && styles.confirmMapButtonTextDisabled
              ]}>
                Confirmar Localização
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderLocationModal = () => (
    <Modal
      visible={showModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Fixed Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Localização</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView 
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Current Location */}
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Localização Atual</Text>
              <TouchableOpacity 
                style={styles.currentLocationButton}
                onPress={getCurrentLocation}
                disabled={loadingLocation}
              >
                <View style={styles.locationOptionContent}>
                  <View style={[styles.locationIcon, { backgroundColor: '#EFF6FF' }]}>
                    <Navigation size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>
                      {loadingLocation ? 'Obtendo localização...' : 'Usar Localização Atual'}
                    </Text>
                    {currentLocation && (
                      <Text style={styles.locationAddress}>{currentLocation.address}</Text>
                    )}
                  </View>
                </View>
                {currentLocation && (
                  <Check size={20} color="#10B981" />
                )}
              </TouchableOpacity>

              {currentLocation && (
                <TouchableOpacity 
                  style={styles.useCurrentButton}
                  onPress={() => handleLocationSelect(currentLocation)}
                >
                  <Text style={styles.useCurrentButtonText}>Usar Esta Localização</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Map Selection */}
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Selecionar no Mapa</Text>
              <TouchableOpacity 
                style={styles.mapSelectionButton}
                onPress={openMapSelection}
              >
                <View style={styles.locationOptionContent}>
                  <View style={[styles.locationIcon, { backgroundColor: '#FFF7F5' }]}>
                    <Map size={20} color="#FF6B35" />
                  </View>
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>Escolher no Mapa</Text>
                    <Text style={styles.locationAddress}>Toque para abrir o mapa interativo</Text>
                  </View>
                </View>
                <View style={styles.mapSelectionArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Saved Locations */}
            <View style={[styles.locationSection, styles.lastSection]}>
              <Text style={styles.sectionTitle}>Localizações Sugeridas</Text>
              <Text style={styles.sectionSubtitle}>
                {savedLocations.length} localizações populares em Maputo
              </Text>
              {savedLocations.map((locationOption) => (
                <TouchableOpacity
                  key={locationOption.id}
                  style={[
                    styles.locationOption,
                    selectedLocation === locationOption.address && styles.selectedLocationOption
                  ]}
                  onPress={() => handleLocationSelect(locationOption)}
                >
                  <View style={styles.locationOptionContent}>
                    <View style={[styles.locationIcon, { backgroundColor: '#F0F9FF' }]}>
                      <MapPin size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{locationOption.name}</Text>
                      <Text style={styles.locationAddress}>{locationOption.address}</Text>
                    </View>
                  </View>
                  {selectedLocation === locationOption.address && (
                    <Check size={20} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <TouchableOpacity 
        style={[styles.container, containerStyle]} 
        onPress={() => setShowModal(true)}
      >
        <View style={styles.locationDisplay}>
          <MapPin size={20} color="#FF6B35" />
          <Text style={styles.text} numberOfLines={1}>{selectedLocation}</Text>
        </View>
        <View style={styles.arrow} />
      </TouchableOpacity>

      {renderLocationModal()}
      {renderInteractiveMap()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalScrollView: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  locationSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastSection: {
    borderBottomWidth: 0,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE5D9',
    elevation: 2,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapSelectionArrow: {
    backgroundColor: '#FF6B35',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedLocationOption: {
    backgroundColor: '#F0F9FF',
    borderColor: '#3B82F6',
  },
  locationOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  useCurrentButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  useCurrentButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  // Map Modal Styles
  mapModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapModalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: width - 40,
    maxHeight: height * 0.8,
    overflow: 'hidden',
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mapTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  headerSpacer: {
    width: 24,
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#F0F9FF',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E0F2FE',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  horizontalLine: {
    left: 0,
    right: 0,
    height: 1,
  },
  verticalLine: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  landmarksContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  landmark: {
    position: 'absolute',
    alignItems: 'center',
  },
  landmarkPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedLandmarkPin: {
    backgroundColor: '#FF6B35',
    transform: [{ scale: 1.2 }],
  },
  landmarkLabel: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    maxWidth: 80,
  },
  mapTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  selectedPin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPinInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: 'white',
  },
  mapInstructions: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'white',
    textAlign: 'center',
  },
  selectedLocationInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedLocationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedLocationText: {
    marginLeft: 12,
    flex: 1,
  },
  selectedLocationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  selectedLocationCoords: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  mapActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  cancelMapButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelMapButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  confirmMapButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
  },
  confirmMapButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  confirmMapButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  confirmMapButtonTextDisabled: {
    color: '#9CA3AF',
  },
});