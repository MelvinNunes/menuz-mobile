import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Calendar, Clock, Tag, MapPin, Share } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { promotionalBanners } from '@/data/mockData';
import { ScreenLayout, Header, LoadingSpinner } from '@/components';

const { width, height } = Dimensions.get('window');

interface PromotionDetails {
  id: string;
  title: string;
  discount: string;
  description: string;
  image: string;
  fullDescription: string;
  terms: string[];
  validFrom: string;
  validUntil: string;
  locations: string[];
  category: string;
  originalPrice?: number;
  discountedPrice?: number;
  maxRedemptions?: number;
  currentRedemptions?: number;
}

const mockPromotionDetails: PromotionDetails[] = [
  {
    id: '1',
    title: 'Dia de Pizza Especial',
    discount: '10%',
    description: 'Desconto em todas as pizzas',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fullDescription: 'Desfrute de um desconto incrível de 10% em todas as nossas deliciosas pizzas artesanais. Feitas com ingredientes frescos e massa preparada diariamente, nossas pizzas são perfeitas para qualquer ocasião.',
    terms: [
      'Válido apenas para pizzas do menu regular',
      'Não cumulativo com outras promoções',
      'Válido para consumo no local e takeaway',
      'Desconto aplicado automaticamente no checkout',
      'Sujeito a disponibilidade de ingredientes'
    ],
    validFrom: '2024-01-15',
    validUntil: '2024-01-31',
    locations: ['Maputo Centro', 'Costa do Sol', 'Polana'],
    category: 'Comida Italiana',
    originalPrice: 250,
    discountedPrice: 225,
    maxRedemptions: 1000,
    currentRedemptions: 342
  },
  {
    id: '2',
    title: 'Seafood Weekend Special',
    discount: '15%',
    description: 'Desconto em pratos de frutos do mar',
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fullDescription: 'Mergulhe numa experiência gastronómica única com 15% de desconto em todos os nossos pratos de frutos do mar frescos. Do camarão grelhado à lagosta, temos os melhores sabores do oceano.',
    terms: [
      'Válido apenas aos fins de semana (Sexta a Domingo)',
      'Aplicável a todos os pratos de frutos do mar',
      'Reservas recomendadas',
      'Não válido em feriados públicos',
      'Desconto não aplicável a bebidas'
    ],
    validFrom: '2024-01-12',
    validUntil: '2024-02-29',
    locations: ['Costa do Sol', 'Catembe'],
    category: 'Frutos do Mar',
    originalPrice: 450,
    discountedPrice: 383,
    maxRedemptions: 500,
    currentRedemptions: 127
  },
  {
    id: '3',
    title: 'Happy Hour Especial',
    discount: '20%',
    description: 'Desconto em bebidas',
    image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200',
    fullDescription: 'Relaxe após um longo dia com 20% de desconto em todas as bebidas durante o nosso Happy Hour. Cocktails premium, cervejas artesanais e vinhos selecionados com preços especiais.',
    terms: [
      'Válido das 17h às 19h, Segunda a Quinta',
      'Aplicável a todas as bebidas alcoólicas',
      'Máximo 3 bebidas por pessoa',
      'Não válido em bebidas premium',
      'Idade mínima 18 anos'
    ],
    validFrom: '2024-01-10',
    validUntil: '2024-03-31',
    locations: ['Maputo Centro', 'Polana', 'Sommerschield'],
    category: 'Bebidas',
    originalPrice: 150,
    discountedPrice: 120,
    maxRedemptions: 2000,
    currentRedemptions: 856
  }
];

export default function PromotionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [promotion, setPromotion] = useState<PromotionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedeemed, setIsRedeemed] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    loadPromotionDetails();
    animateIn();
  }, [id]);

  const loadPromotionDetails = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundPromotion = mockPromotionDetails.find(p => p.id === id);
      if (foundPromotion) {
        setPromotion(foundPromotion);
      } else {
        setError('Promoção não encontrada');
      }
    } catch (err) {
      setError('Erro ao carregar detalhes da promoção');
    } finally {
      setLoading(false);
    }
  };

  const animateIn = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
    });
  };

  const handleClose = () => {
    animateOut();
  };

  const handleRedeem = () => {
    setIsRedeemed(true);
    // Implement redemption logic here
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share promotion');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getProgressPercentage = () => {
    if (!promotion?.maxRedemptions || !promotion?.currentRedemptions) return 0;
    return (promotion.currentRedemptions / promotion.maxRedemptions) * 100;
  };

  if (loading) {
    return (
      <ScreenLayout backgroundColor="rgba(0,0,0,0.5)">
        <Animated.View style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          }
        ]}>
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={40} color="#FF6B35" />
            <Text style={styles.loadingText}>Carregando promoção...</Text>
          </View>
        </Animated.View>
      </ScreenLayout>
    );
  }

  if (error || !promotion) {
    return (
      <ScreenLayout backgroundColor="rgba(0,0,0,0.5)">
        <Animated.View style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          }
        ]}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Ops!</Text>
            <Text style={styles.errorText}>{error || 'Promoção não encontrada'}</Text>
            <TouchableOpacity style={styles.errorButton} onPress={handleClose}>
              <Text style={styles.errorButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout backgroundColor="rgba(0,0,0,0.5)">
      <Animated.View style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        }
      ]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes da Promoção</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Share size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <Animated.View style={[
            styles.imageContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <Image source={{ uri: promotion.image }} style={styles.heroImage} />
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{promotion.discount}</Text>
              <Text style={styles.discountLabel}>OFF</Text>
            </View>
          </Animated.View>

          {/* Title and Category */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{promotion.title}</Text>
            <View style={styles.categoryBadge}>
              <Tag size={14} color="#FF6B35" />
              <Text style={styles.categoryText}>{promotion.category}</Text>
            </View>
          </View>

          {/* Price Information */}
          {promotion.originalPrice && promotion.discountedPrice && (
            <View style={styles.priceSection}>
              <Text style={styles.originalPrice}>{promotion.originalPrice} MZN</Text>
              <Text style={styles.discountedPrice}>{promotion.discountedPrice} MZN</Text>
              <Text style={styles.savings}>
                Poupa {promotion.originalPrice - promotion.discountedPrice} MZN
              </Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{promotion.fullDescription}</Text>
          </View>

          {/* Validity Period */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Período de Validade</Text>
            <View style={styles.dateContainer}>
              <View style={styles.dateItem}>
                <Calendar size={16} color="#10B981" />
                <Text style={styles.dateText}>
                  De {formatDate(promotion.validFrom)}
                </Text>
              </View>
              <View style={styles.dateItem}>
                <Clock size={16} color="#EF4444" />
                <Text style={styles.dateText}>
                  Até {formatDate(promotion.validUntil)}
                </Text>
              </View>
            </View>
          </View>

          {/* Locations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localizações Válidas</Text>
            {promotion.locations.map((location, index) => (
              <View key={index} style={styles.locationItem}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.locationText}>{location}</Text>
              </View>
            ))}
          </View>

          {/* Redemption Progress */}
          {promotion.maxRedemptions && promotion.currentRedemptions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Disponibilidade</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${getProgressPercentage()}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {promotion.currentRedemptions} de {promotion.maxRedemptions} utilizadas
                </Text>
              </View>
            </View>
          )}

          {/* Terms and Conditions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Termos e Condições</Text>
            {promotion.terms.map((term, index) => (
              <View key={index} style={styles.termItem}>
                <Text style={styles.termBullet}>•</Text>
                <Text style={styles.termText}>{term}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.bottomAction}>
          <TouchableOpacity 
            style={[
              styles.redeemButton,
              isRedeemed && styles.redeemedButton
            ]}
            onPress={handleRedeem}
            disabled={isRedeemed}
          >
            <Text style={[
              styles.redeemButtonText,
              isRedeemed && styles.redeemedButtonText
            ]}>
              {isRedeemed ? 'Promoção Resgatada!' : 'Resgatar Agora'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  discountText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  discountLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginTop: -4,
  },
  titleSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  originalPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  discountedPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginRight: 12,
  },
  savings: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  dateContainer: {
    gap: 12,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  termBullet: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginRight: 8,
    marginTop: 2,
  },
  termText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomAction: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  redeemButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  redeemedButton: {
    backgroundColor: '#10B981',
  },
  redeemButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  redeemedButtonText: {
    color: 'white',
  },
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});