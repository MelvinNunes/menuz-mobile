import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Share, Download, Instagram, Facebook, Twitter, MapPin, Star, Clock } from 'lucide-react-native';
import ViewShot from 'react-native-view-shot';
import QRCodeGenerator from './QRCodeGenerator';
import RatingBadge from '@/components/ui/RatingBadge';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  address: string;
  cuisine: string[];
  phone: string;
  openingHours?: any;
}

interface SocialSharingCardProps {
  restaurant: Restaurant;
  featuredDish?: {
    name: string;
    image: string;
    description: string;
  };
  onShare?: (platform: string) => void;
  onSave?: (uri: string) => void;
}

export default function SocialSharingCard({
  restaurant,
  featuredDish,
  onShare,
  onSave
}: SocialSharingCardProps) {
  const viewShotRef = useRef<ViewShot>(null);

  const generateQRValue = () => {
    return `https://menuz.co.mz/restaurant/${restaurant.id}`;
  };

  const getOperatingHours = () => {
    if (!restaurant.openingHours) return 'Consulte horários';

    const today = new Date().getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = days[today];

    if (restaurant.openingHours[todayKey]) {
      return restaurant.openingHours[todayKey];
    }

    return 'Consulte horários';
  };

  const captureCard = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        return uri;
      }
    } catch (error) {
      console.error('Error capturing card:', error);
      alert('Não foi possível capturar a imagem do cartão');
    }
    return null;
  };

  const handleShare = async (platform: string) => {
    const uri = await captureCard();
    if (uri) {
      if (Platform.OS === 'web') {
        // Web sharing implementation
        if (navigator.share) {
          try {
            await navigator.share({
              title: `${restaurant.name} - Menuz`,
              text: `Confira este restaurante incrível: ${restaurant.name}`,
              url: generateQRValue(),
            });
          } catch (error) {
            console.log('Error sharing:', error);
          }
        } else {
          // Fallback for web browsers without native sharing
          const shareData = {
            title: `${restaurant.name} - Menuz`,
            text: `Confira este restaurante incrível: ${restaurant.name}`,
            url: generateQRValue(),
          };

          // Copy to clipboard as fallback
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert('Copiado!');
          }
        }
      } else {
        // Mobile sharing
        try {
          await navigator.share({
            url: uri,
            title: `${restaurant.name} - Menuz`,
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      }

      onShare?.(platform);
    }
  };

  const handleSave = async () => {
    const uri = await captureCard();
    if (uri) {
      onSave?.(uri);
      alert('Sucesso!');
    }
  };

  const handlePlatformShare = (platform: string) => {
    const baseUrl = generateQRValue();
    const text = `Confira este restaurante incrível: ${restaurant.name}`;

    let shareUrl = '';

    switch (platform) {
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll use the general share
        handleShare('instagram');
        return;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(baseUrl)}`;
        break;
      default:
        handleShare(platform);
        return;
    }

    if (Platform.OS === 'web') {
      window.open(shareUrl, '_blank');
    } else {
      handleShare(platform);
    }
  };

  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
        <View style={styles.card}>
          {/* Header with branding */}
          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <Text style={styles.brandName}>Menuz</Text>
              <Text style={styles.brandTagline}>Descubra os sabores de Maputo</Text>
            </View>
            <View style={styles.qrContainer}>
              <QRCodeGenerator
                value={generateQRValue()}
                size={80}
                backgroundColor="white"
                color="#FF6B35"
                enableLinearGradient={true}
                linearGradient={['#FF6B35', '#FF8A65']}
                quietZone={5}
              />
            </View>
          </View>

          {/* Restaurant Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: featuredDish?.image || restaurant.image }}
              style={styles.restaurantImage}
            />
            <View style={styles.imageOverlay}>
              <RatingBadge rating={restaurant.rating} size="medium" />
            </View>
          </View>

          {/* Restaurant Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.restaurantName} numberOfLines={2}>
              {restaurant.name}
            </Text>

            {featuredDish ? (
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>Destaque: {featuredDish.name}</Text>
                <Text style={styles.dishDescription} numberOfLines={2}>
                  {featuredDish.description}
                </Text>
              </View>
            ) : (
              <Text style={styles.cuisineTypes}>
                {restaurant.cuisine.slice(0, 3).join(' • ')}
              </Text>
            )}

            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Star size={14} color="#FFA500" fill="#FFA500" />
                <Text style={styles.metaText}>
                  {restaurant.rating} ({restaurant.reviewCount}+ avaliações)
                </Text>
              </View>

              <View style={styles.metaItem}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.metaText} numberOfLines={1}>
                  {restaurant.address}
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Clock size={14} color="#10B981" />
                <Text style={styles.metaText}>
                  {getOperatingHours()}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Digitalize o QR code para ver o menu completo
            </Text>
            <Text style={styles.websiteText}>
              menuz.co.mz
            </Text>
          </View>
        </View>
      </ViewShot>

      {/* Sharing Controls */}
      <View style={styles.sharingControls}>
        <Text style={styles.sharingTitle}>Partilhar Cartão</Text>

        <View style={styles.platformButtons}>
          <TouchableOpacity
            style={[styles.platformButton, styles.instagramButton]}
            onPress={() => handlePlatformShare('instagram')}
          >
            <Instagram size={20} color="white" />
            <Text style={styles.platformButtonText}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.platformButton, styles.facebookButton]}
            onPress={() => handlePlatformShare('facebook')}
          >
            <Facebook size={20} color="white" />
            <Text style={styles.platformButtonText}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.platformButton, styles.twitterButton]}
            onPress={() => handlePlatformShare('twitter')}
          >
            <Twitter size={20} color="white" />
            <Text style={styles.platformButtonText}>Twitter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShare('general')}
          >
            <Share size={20} color="#FF6B35" />
            <Text style={styles.actionButtonText}>Partilhar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSave}
          >
            <Download size={20} color="#FF6B35" />
            <Text style={styles.actionButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    width: 350,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF6B35',
  },
  brandContainer: {
    flex: 1,
  },
  brandName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.9)',
  },
  qrContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  infoContainer: {
    padding: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 12,
    lineHeight: 30,
  },
  dishInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFF7F5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  dishName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
  cuisineTypes: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 16,
  },
  metaInfo: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
  },
  footer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  websiteText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  sharingControls: {
    marginTop: 24,
  },
  sharingTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  platformButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  platformButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  instagramButton: {
    backgroundColor: '#E4405F',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  twitterButton: {
    backgroundColor: '#1DA1F2',
  },
  platformButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FF6B35',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
});