import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Star, Calendar, CreditCard as Edit3, Trash2, Filter, ChevronDown, Camera, X, Plus, RefreshCw } from 'lucide-react-native';
import { 
  ScreenLayout, 
  Header, 
  EmptyState, 
  LoadingSpinner, 
  Toast, 
  UserAvatar,
  Badge
} from '@/components';
import { useToast } from '@/hooks/useToast';

interface UserReview {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  rating: number;
  reviewText: string;
  dateSubmitted: string;
  photos: string[];
  helpful: number;
  replies: number;
  isEdited?: boolean;
  editedDate?: string;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

const mockUserReviews: UserReview[] = [
  {
    id: '1',
    restaurantId: '1',
    restaurantName: 'Restaurante Costa do Sol',
    restaurantImage: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    reviewText: 'Experiência absolutamente incrível! O camarão grelhado estava perfeito, com temperos equilibrados e apresentação impecável. O atendimento foi excepcional e o ambiente muito acolhedor. Definitivamente voltarei em breve!',
    dateSubmitted: '2024-01-15',
    photos: [
      'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    helpful: 12,
    replies: 3,
  },
  {
    id: '2',
    restaurantId: '2',
    restaurantName: 'Piri Piri Palace',
    restaurantImage: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4,
    reviewText: 'Frango piri piri autêntico e saboroso! O tempero estava no ponto certo, nem muito picante nem suave demais. Ambiente familiar e acolhedor. Apenas o tempo de espera foi um pouco longo.',
    dateSubmitted: '2024-01-10',
    photos: [
      'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    helpful: 8,
    replies: 1,
    isEdited: true,
    editedDate: '2024-01-12',
  },
  {
    id: '3',
    restaurantId: '3',
    restaurantName: 'Café Central',
    restaurantImage: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 3,
    reviewText: 'Café decente no centro da cidade. O cappuccino estava bom, mas nada de especial. O ambiente é agradável para trabalhar, mas o serviço poderia ser mais rápido.',
    dateSubmitted: '2024-01-05',
    photos: [],
    helpful: 4,
    replies: 0,
  },
  {
    id: '4',
    restaurantId: '1',
    restaurantName: 'Restaurante Costa do Sol',
    restaurantImage: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    reviewText: 'Segunda visita e continua excelente! Desta vez experimentei a lagosta grelhada - simplesmente divinal. O chef realmente sabe o que está fazendo.',
    dateSubmitted: '2023-12-20',
    photos: [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    helpful: 15,
    replies: 2,
  },
  {
    id: '5',
    restaurantId: '2',
    restaurantName: 'Piri Piri Palace',
    restaurantImage: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4,
    reviewText: 'Voltei novamente e a qualidade mantém-se consistente. O frango continua delicioso e o atendimento melhorou bastante desde a última visita.',
    dateSubmitted: '2023-12-15',
    photos: [],
    helpful: 6,
    replies: 0,
  },
  {
    id: '6',
    restaurantId: '4',
    restaurantName: 'Bistro Maputo',
    restaurantImage: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    reviewText: 'Descoberta incrível! Este bistro tem uma atmosfera única e a comida é excepcional. O chef claramente tem paixão pelo que faz. Recomendo vivamente!',
    dateSubmitted: '2023-12-10',
    photos: [
      'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    helpful: 20,
    replies: 5,
  },
  {
    id: '7',
    restaurantId: '5',
    restaurantName: 'Tasca do Zé',
    restaurantImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4,
    reviewText: 'Ambiente tradicional e comida caseira deliciosa. O bacalhau à Brás estava perfeito e o atendimento muito simpático. Preços justos para a qualidade oferecida.',
    dateSubmitted: '2023-12-05',
    photos: [],
    helpful: 9,
    replies: 1,
  },
  {
    id: '8',
    restaurantId: '6',
    restaurantName: 'Sushi Zen',
    restaurantImage: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    reviewText: 'Melhor sushi de Maputo! Peixe fresco, apresentação impecável e sabores autênticos. O chef tem verdadeiro talento. Ambiente moderno e relaxante.',
    dateSubmitted: '2023-11-28',
    photos: [
      'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    helpful: 18,
    replies: 4,
  },
  {
    id: '9',
    restaurantId: '7',
    restaurantName: 'Pizzaria Bella Vista',
    restaurantImage: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 3,
    reviewText: 'Pizza razoável, mas nada de extraordinário. A massa estava boa, mas os ingredientes poderiam ser de melhor qualidade. Serviço rápido e preços acessíveis.',
    dateSubmitted: '2023-11-20',
    photos: [],
    helpful: 5,
    replies: 0,
  },
  {
    id: '10',
    restaurantId: '8',
    restaurantName: 'Churrasqueira do Sul',
    restaurantImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4,
    reviewText: 'Carne de excelente qualidade e bem temperada. O ambiente é simples mas acolhedor. As porções são generosas e o preço é justo. Recomendo o picanha.',
    dateSubmitted: '2023-11-15',
    photos: [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    helpful: 11,
    replies: 2,
  },
  {
    id: '11',
    restaurantId: '9',
    restaurantName: 'Café da Esquina',
    restaurantImage: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4,
    reviewText: 'Café acolhedor com ótimas opções de pequeno-almoço. Os croissants são frescos e o café é aromático. Perfeito para começar o dia ou para uma pausa relaxante.',
    dateSubmitted: '2023-11-10',
    photos: [],
    helpful: 7,
    replies: 1,
  },
  {
    id: '12',
    restaurantId: '10',
    restaurantName: 'Marisqueira Atlântico',
    restaurantImage: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
    reviewText: 'Frutos do mar fresquíssimos e preparação impecável. A cataplana de marisco estava divinal. Vista para o mar e ambiente romântico. Perfeito para ocasiões especiais.',
    dateSubmitted: '2023-11-05',
    photos: [
      'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    helpful: 22,
    replies: 6,
  },
];

export default function MyReviewsScreen() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [allReviews, setAllReviews] = useState<UserReview[]>([]);
  const [displayedReviews, setDisplayedReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortModal, setShowSortModal] = useState(false);
  const [editingReview, setEditingReview] = useState<UserReview | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  
  const reviewsPerLoad = 5;

  useEffect(() => {
    loadInitialReviews();
  }, []);

  useEffect(() => {
    // Reset displayed reviews when sort changes
    const sorted = sortReviews(allReviews, sortBy);
    setDisplayedReviews(sorted.slice(0, reviewsPerLoad));
    setHasMoreReviews(sorted.length > reviewsPerLoad);
  }, [sortBy, allReviews]);

  const loadInitialReviews = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sorted = sortReviews(mockUserReviews, sortBy);
      setAllReviews(mockUserReviews);
      setDisplayedReviews(sorted.slice(0, reviewsPerLoad));
      setHasMoreReviews(sorted.length > reviewsPerLoad);
    } catch (error) {
      showToast('Erro ao carregar avaliações', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreReviews = async () => {
    if (loadingMore || !hasMoreReviews) return;

    try {
      setLoadingMore(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const sorted = sortReviews(allReviews, sortBy);
      const currentLength = displayedReviews.length;
      const nextBatch = sorted.slice(currentLength, currentLength + reviewsPerLoad);
      
      setDisplayedReviews(prev => [...prev, ...nextBatch]);
      setHasMoreReviews(currentLength + nextBatch.length < sorted.length);
    } catch (error) {
      showToast('Erro ao carregar mais avaliações', 'error');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      // Simulate refresh API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sorted = sortReviews(allReviews, sortBy);
      setDisplayedReviews(sorted.slice(0, reviewsPerLoad));
      setHasMoreReviews(sorted.length > reviewsPerLoad);
      showToast('Avaliações atualizadas', 'success');
    } catch (error) {
      showToast('Erro ao atualizar avaliações', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const sortReviews = (reviews: UserReview[], sortOption: SortOption): UserReview[] => {
    return [...reviews].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime();
        case 'oldest':
          return new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
  };

  const handleEditReview = (review: UserReview) => {
    setEditingReview(review);
    setEditText(review.reviewText);
    setEditRating(review.rating);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;

    try {
      const updatedAllReviews = allReviews.map(review =>
        review.id === editingReview.id
          ? {
              ...review,
              reviewText: editText,
              rating: editRating,
              isEdited: true,
              editedDate: new Date().toISOString().split('T')[0],
            }
          : review
      );
      
      const updatedDisplayedReviews = displayedReviews.map(review =>
        review.id === editingReview.id
          ? {
              ...review,
              reviewText: editText,
              rating: editRating,
              isEdited: true,
              editedDate: new Date().toISOString().split('T')[0],
            }
          : review
      );
      
      setAllReviews(updatedAllReviews);
      setDisplayedReviews(updatedDisplayedReviews);
      setShowEditModal(false);
      setEditingReview(null);
      showToast('Avaliação atualizada com sucesso', 'success');
    } catch (error) {
      showToast('Erro ao atualizar avaliação', 'error');
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    Alert.alert(
      'Eliminar Avaliação',
      'Tem certeza que deseja eliminar esta avaliação? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedAllReviews = allReviews.filter(review => review.id !== reviewId);
              const updatedDisplayedReviews = displayedReviews.filter(review => review.id !== reviewId);
              
              setAllReviews(updatedAllReviews);
              setDisplayedReviews(updatedDisplayedReviews);
              
              // Update hasMoreReviews status
              const sorted = sortReviews(updatedAllReviews, sortBy);
              setHasMoreReviews(updatedDisplayedReviews.length < sorted.length);
              
              showToast('Avaliação eliminada com sucesso', 'success');
            } catch (error) {
              showToast('Erro ao eliminar avaliação', 'error');
            }
          },
        },
      ]
    );
  };

  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      loadMoreReviews();
    }
  }, [loadingMore, hasMoreReviews]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderStarsRating = (rating: number, size: number = 16, interactive: boolean = false) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            disabled={!interactive}
            onPress={() => interactive && setEditRating(star)}
          >
            <Star 
              size={size} 
              color="#FFA500" 
              fill={star <= rating ? "#FFA500" : "transparent"} 
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReviewCard = (item: UserReview) => (
    <View key={item.id} style={styles.reviewCard}>
      {/* Restaurant Info */}
      <TouchableOpacity 
        style={styles.restaurantHeader}
        onPress={() => router.push(`/restaurant/${item.restaurantId}`)}
      >
        <UserAvatar 
          imageUri={item.restaurantImage}
          size={50}
        />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <View style={styles.ratingContainer}>
            {renderStarsRating(item.rating)}
            <Text style={styles.ratingText}>{item.rating}/5</Text>
          </View>
        </View>
        {item.isEdited && (
          <Badge text="Editado" variant="secondary" size="small" />
        )}
      </TouchableOpacity>

      {/* Review Content */}
      <Text style={styles.reviewText}>{item.reviewText}</Text>

      {/* Photos */}
      {item.photos.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.photosContainer}
          contentContainerStyle={styles.photosContent}
        >
          {item.photos.map((photo, index) => (
            <View key={index} style={styles.photoWrapper}>
              <UserAvatar
                imageUri={photo}
                size={80}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {/* Review Meta */}
      <View style={styles.reviewMeta}>
        <View style={styles.dateContainer}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.dateText}>
            {formatDate(item.dateSubmitted)}
            {item.isEdited && item.editedDate && (
              <Text style={styles.editedText}> • Editado em {formatDate(item.editedDate)}</Text>
            )}
          </Text>
        </View>
        
        <View style={styles.engagementStats}>
          <Text style={styles.statText}>{item.helpful} úteis</Text>
          <Text style={styles.statText}>•</Text>
          <Text style={styles.statText}>{item.replies} respostas</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditReview(item)}
        >
          <Edit3 size={16} color="#FF6B35" />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteReview(item.id)}
        >
          <Trash2 size={16} color="#EF4444" />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoadMoreIndicator = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadMoreContainer}>
        <LoadingSpinner size={24} color="#FF6B35" />
        <Text style={styles.loadMoreText}>Carregando mais avaliações...</Text>
      </View>
    );
  };

  const renderEndOfListMessage = () => {
    if (hasMoreReviews || displayedReviews.length === 0) return null;
    
    return (
      <View style={styles.endOfListContainer}>
        <Text style={styles.endOfListText}>
          {displayedReviews.length === 1 
            ? 'Visualizou a sua única avaliação' 
            : `Visualizou todas as suas ${displayedReviews.length} avaliações`}
        </Text>
      </View>
    );
  };

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSortModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        onPress={() => setShowSortModal(false)}
      >
        <View style={styles.sortModal}>
          <Text style={styles.modalTitle}>Ordenar por</Text>
          
          {[
            { key: 'newest', label: 'Mais recentes' },
            { key: 'oldest', label: 'Mais antigas' },
            { key: 'highest', label: 'Maior avaliação' },
            { key: 'lowest', label: 'Menor avaliação' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortOption,
                sortBy === option.key && styles.sortOptionActive
              ]}
              onPress={() => {
                setSortBy(option.key as SortOption);
                setShowSortModal(false);
              }}
            >
              <Text style={[
                styles.sortOptionText,
                sortBy === option.key && styles.sortOptionTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowEditModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.editModal}>
          <View style={styles.editModalHeader}>
            <Text style={styles.modalTitle}>Editar Avaliação</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.editLabel}>Avaliação</Text>
          {renderStarsRating(editRating, 24, true)}

          <Text style={styles.editLabel}>Comentário</Text>
          <TextInput
            style={styles.editTextInput}
            value={editText}
            onChangeText={setEditText}
            multiline
            numberOfLines={6}
            placeholder="Escreva o seu comentário..."
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.editModalActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveEdit}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEmptyState = () => (
    <EmptyState
      icon={Star}
      title="Nenhuma avaliação ainda"
      subtitle="Comece a explorar restaurantes e partilhe as suas experiências com a comunidade"
      buttonText="Explorar Restaurantes"
      onButtonPress={() => router.push('/search')}
      iconColor="#FF6B35"
    />
  );

  if (loading) {
    return (
      <ScreenLayout>
        <Header title="Minhas Avaliações" showBackButton />
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={40} color="#FF6B35" />
          <Text style={styles.loadingText}>Carregando avaliações...</Text>
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

      <Header title="Minhas Avaliações" showBackButton />

      {allReviews.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={400}
          refreshControl={
            <View style={styles.refreshControl}>
              {refreshing && (
                <View style={styles.refreshIndicator}>
                  <LoadingSpinner size={20} color="#FF6B35" />
                </View>
              )}
            </View>
          }
        >
          {/* Stats Header */}
          <View style={styles.statsHeader}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{allReviews.length}</Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {(allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Média</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {allReviews.reduce((sum, r) => sum + r.helpful, 0)}
              </Text>
              <Text style={styles.statLabel}>Úteis</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={styles.sortButton}
              onPress={() => setShowSortModal(true)}
            >
              <Filter size={16} color="#6B7280" />
              <Text style={styles.sortButtonText}>
                {sortBy === 'newest' && 'Mais recentes'}
                {sortBy === 'oldest' && 'Mais antigas'}
                {sortBy === 'highest' && 'Maior avaliação'}
                {sortBy === 'lowest' && 'Menor avaliação'}
              </Text>
              <ChevronDown size={16} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw 
                size={16} 
                color={refreshing ? "#9CA3AF" : "#6B7280"} 
                style={refreshing ? styles.spinning : undefined}
              />
            </TouchableOpacity>
          </View>

          {/* Reviews List */}
          <View style={styles.reviewsList}>
            {displayedReviews.map((review, index) => (
              <View key={review.id}>
                {renderReviewCard(review)}
                {index < displayedReviews.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
            
            {/* Load More Indicator */}
            {renderLoadMoreIndicator()}
            
            {/* End of List Message */}
            {renderEndOfListMessage()}
          </View>
        </ScrollView>
      )}

      {/* Modals */}
      {renderSortModal()}
      {renderEditModal()}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
  refreshControl: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  refreshIndicator: {
    paddingVertical: 10,
  },
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
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
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginTop: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    marginRight: 12,
  },
  sortButtonText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  spinning: {
    transform: [{ rotate: '180deg' }],
  },
  reviewsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#F9FAFB',
  },
  separator: {
    height: 16,
  },
  loadMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  loadMoreText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  endOfListContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  endOfListText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  reviewText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  photosContainer: {
    marginBottom: 16,
  },
  photosContent: {
    paddingRight: 20,
  },
  photoWrapper: {
    marginRight: 12,
  },
  reviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flexShrink: 1,
  },
  editedText: {
    fontStyle: 'italic',
    color: '#9CA3AF',
  },
  engagementStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF7F5',
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  deleteButtonText: {
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 40,
    minWidth: 250,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortOptionActive: {
    backgroundColor: '#FFF7F5',
  },
  sortOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  sortOptionTextActive: {
    color: '#FF6B35',
    fontFamily: 'Inter-SemiBold',
  },
  editModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    maxHeight: '80%',
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  editTextInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  editModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});