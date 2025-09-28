import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { Search, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  selectedLocation: string;
  onLocationChange?: (location: string, coordinates?: { latitude: number; longitude: number }) => void;
  onSearchPress?: () => void;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  selectedLocation,
  onLocationChange,
  onSearchPress
}: HeroSectionProps) {
  return (
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              <View style={styles.sparkleContainer}>
                <Sparkles size={24} color="#FFD700" fill="#FFD700" />
              </View>
            </View>

            <Text style={styles.subtitle}>{subtitle}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onSearchPress}
                activeOpacity={0.9}
              >
                <View style={styles.buttonIconContainer}>
                  <Search size={22} color="white" />
                </View>
                <Text style={styles.primaryButtonText}>Explorar Restaurantes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 400,
    justifyContent: 'center',
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    minHeight: 400,
    justifyContent: 'space-between',
    paddingVertical: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  locationSection: {
    alignItems: 'flex-start',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    opacity: 0.9,
  },
  locationPicker: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  mainContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  sparkleContainer: {
    marginLeft: 12,
    transform: [{ rotate: '15deg' }],
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
    maxWidth: width * 0.85,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    width: width * 0.8,
    maxWidth: 320,
  },
  buttonIconContainer: {
    marginRight: 12,
  },
  primaryButtonText: {
    fontSize: 17,
    fontFamily: 'Inter-Bold',
    color: 'white',
    letterSpacing: -0.2,
  },
});