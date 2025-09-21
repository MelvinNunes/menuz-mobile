import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, TextInput, Dimensions, RefreshControl } from 'react-native';
import { Heart, MessageCircle, Share, Star, MapPin, Plus, TrendingUp, Search, Filter, Users, Camera, MoveHorizontal as MoreHorizontal, ChefHat, Clock, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { 
  ScreenLayout, 
  Header, 
  FilterButton, 
  UserAvatar, 
  RatingBadge, 
  EngagementButton,
  LoadingSpinner,
  Badge
} from '@/components';

const { width } = Dimensions.get('window');

interface CommunityPost {
  id: string;
  type: 'review' | 'experience';
  user: {
    name: string;
    avatar: string;
    verified: boolean;
    followers: number;
    level: 'Novato' | 'Explorador' | 'Crítico' | 'Especialista';
  };
  restaurant?: {
    name: string;
    location: string;
    rating: number;
  };
  experience?: {
    title: string;
    type: string;
    location: string;
    duration: string;
    participants: number;
    difficulty: string;
  };
  content: {
    text: string;
    images: string[];
    rating?: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    liked: boolean;
    bookmarked: boolean;
  };
  timestamp: string;
  tags: string[];
  featured?: boolean;
}

const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    type: 'review',
    user: {
      name: 'Maria Santos',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      verified: true,
      followers: 1250,
      level: 'Especialista'
    },
    restaurant: {
      name: 'Restaurante Costa do Sol',
      location: 'Av. Marginal, Maputo',
      rating: 4.5
    },
    content: {
      text: 'Acabei de experimentar o camarão grelhado mais incrível! A apresentação estava perfeita e o sabor... sem palavras! 🦐✨ O chef realmente superou as expectativas. O ambiente romântico com vista para o mar tornou a experiência ainda mais especial.',
      images: [
        'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 5
    },
    engagement: {
      likes: 89,
      comments: 12,
      shares: 5,
      liked: false,
      bookmarked: true
    },
    timestamp: 'há 2 horas',
    tags: ['seafood', 'romantic', 'must-try'],
    featured: true
  },
  {
    id: '2',
    type: 'experience',
    user: {
      name: 'João Fernandes',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      verified: false,
      followers: 340,
      level: 'Explorador'
    },
    experience: {
      title: 'Aula de Culinária Tradicional Moçambicana',
      type: 'Experiência Culinária',
      location: 'Casa da Cultura, Maputo',
      duration: '3 horas',
      participants: 8,
      difficulty: 'Médio'
    },
    content: {
      text: 'Que experiência incrível! Aprendi a fazer matapa autêntico com uma chef local. O processo é mais complexo do que imaginava, mas o resultado foi fantástico. Recomendo vivamente para quem quer conhecer a verdadeira culinária moçambicana! 👩‍🍳🇲🇿',
      images: [
        'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    engagement: {
      likes: 67,
      comments: 15,
      shares: 8,
      liked: true,
      bookmarked: false
    },
    timestamp: 'há 4 horas',
    tags: ['traditional', 'cooking-class', 'cultural', 'matapa']
  },
  {
    id: '3',
    type: 'review',
    user: {
      name: 'Ana Costa',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
      verified: true,
      followers: 890,
      level: 'Crítico'
    },
    restaurant: {
      name: 'Piri Piri Palace',
      location: 'Rua da Paz, Maputo',
      rating: 4.2
    },
    content: {
      text: 'O frango piri piri aqui é autêntico! Tempero perfeito, nem muito picante nem suave demais. O ambiente familiar torna a experiência ainda melhor. Recomendo para quem quer sabor tradicional português em Maputo.',
      images: [
        'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4
    },
    engagement: {
      likes: 45,
      comments: 8,
      shares: 3,
      liked: false,
      bookmarked: false
    },
    timestamp: 'há 6 horas',
    tags: ['traditional', 'family-friendly', 'spicy']
  },
  {
    id: '4',
    type: 'experience',
    user: {
      name: 'Carlos Mendes',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200',
      verified: false,
      followers: 156,
      level: 'Novato'
    },
    experience: {
      title: 'Tour Gastronómico no Mercado Central',
      type: 'Tour Gastronómico',
      location: 'Mercado Central, Maputo',
      duration: '2 horas',
      participants: 6,
      difficulty: 'Fácil'
    },
    content: {
      text: 'Primeira vez num tour gastronómico e adorei! Descobri tantos sabores novos e aprendi sobre ingredientes locais que nunca tinha visto. A guia era muito conhecedora e simpática. Uma forma fantástica de conhecer a cultura local! 🥭🌶️',
      images: [
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    engagement: {
      likes: 34,
      comments: 6,
      shares: 2,
      liked: false,
      bookmarked: true
    },
    timestamp: 'há 1 dia',
    tags: ['market-tour', 'local-culture', 'beginner-friendly']
  },
  {
    id: '5',
    type: 'experience',
    user: {
      name: 'Sofia Almeida',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      verified: true,
      followers: 2100,
      level: 'Especialista'
    },
    experience: {
      title: 'Degustação de Vinhos e Queijos',
      type: 'Degustação',
      location: 'Wine Bar Maputo',
      duration: '1.5 horas',
      participants: 4,
      difficulty: 'Fácil'
    },
    content: {
      text: 'Noite perfeita de degustação! Experimentámos 5 vinhos diferentes harmonizados com queijos artesanais. O sommelier explicou cada combinação de forma muito interessante. Ambiente íntimo e romântico. Perfeito para casais! 🍷🧀',
      images: [
        'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    engagement: {
      likes: 78,
      comments: 11,
      shares: 7,
      liked: true,
      bookmarked: true
    },
    timestamp: 'há 1 dia',
    tags: ['wine-tasting', 'romantic', 'couples', 'premium'],
    featured: true
  }
];

const trendingTopics = [
  { name: 'Cooking Classes', posts: 23, trending: true },
  { name: 'Market Tours', posts: 18, trending: true },
  { name: 'Seafood Weekend', posts: 45, trending: false },
  { name: 'Wine Tasting', posts: 15, trending: true },
  { name: 'Street Food', posts: 32, trending: false },
  { name: 'Traditional Recipes', posts: 28, trending: true }
];

export default function CommunityScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState(mockCommunityPosts);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'reviews', label: 'Avaliações', icon: Star },
    { key: 'experiences', label: 'Experiências', icon: ChefHat },
    { key: 'trending', label: 'Em Alta', icon: TrendingUp },
    { key: 'following', label: 'Seguindo', icon: Users },
    { key: 'nearby', label: 'Próximo', icon: MapPin }
  ];

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                liked: !post.engagement.liked,
                likes: post.engagement.liked 
                  ? post.engagement.likes - 1 
                  : post.engagement.likes + 1
              }
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                bookmarked: !post.engagement.bookmarked
              }
            }
          : post
      )
    );
  };

  const handleRestaurantPress = (restaurantName: string) => {
    router.push('/restaurant/1');
  };

  const handleUserPress = (userId: string) => {
    console.log('Navigate to user:', userId);
  };

  const handleAddExperience = () => {
    router.push('/add-experience');
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const getUserLevelColor = (level: string) => {
    switch (level) {
      case 'Novato': return '#10B981';
      case 'Explorador': return '#3B82F6';
      case 'Crítico': return '#F59E0B';
      case 'Especialista': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getExperienceTypeIcon = (type: string) => {
    switch (type) {
      case 'Experiência Culinária': return ChefHat;
      case 'Degustação': return Star;
      case 'Tour Gastronómico': return MapPin;
      default: return ChefHat;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return '#10B981';
      case 'Médio': return '#F59E0B';
      case 'Difícil': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderSearchSection = () => (
    <View style={styles.searchSection}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar posts, experiências, restaurantes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterIconButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersSection}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <FilterButton
            key={filter.key}
            label={filter.label}
            icon={filter.icon}
            isActive={activeFilter === filter.key}
            onPress={() => setActiveFilter(filter.key)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsSection}>
      <Text style={styles.quickActionsTitle}>Partilhar com a Comunidade</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={handleAddExperience}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#FFF7F5' }]}>
            <ChefHat size={24} color="#FF6B35" />
          </View>
          <Text style={styles.quickActionText}>Experiência Gastronómica</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionCard}
          onPress={() => router.push('/search')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#F0F9FF' }]}>
            <Star size={24} color="#3B82F6" />
          </View>
          <Text style={styles.quickActionText}>Avaliar Restaurante</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPost = (item: CommunityPost) => (
    <View style={[styles.postCard, item.featured && styles.featuredPost]}>
      {item.featured && (
        <View style={styles.featuredBadge}>
          <Star size={12} color="white" fill="white" />
          <Text style={styles.featuredText}>Destacado</Text>
        </View>
      )}

      {/* User Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => handleUserPress(item.user.name)}
        >
          <UserAvatar 
            imageUri={item.user.avatar}
            showBadge={item.user.verified}
            size={48}
          />
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{item.user.name}</Text>
              <Badge 
                text={item.user.level} 
                variant="secondary" 
                size="small"
                style={[styles.levelBadge, { backgroundColor: getUserLevelColor(item.user.level) + '20' }]}
              />
            </View>
            <Text style={styles.userFollowers}>{item.user.followers.toLocaleString()} seguidores</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.postMeta}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Restaurant Info (for reviews) */}
      {item.type === 'review' && item.restaurant && (
        <TouchableOpacity 
          style={styles.restaurantInfo}
          onPress={() => handleRestaurantPress(item.restaurant!.name)}
        >
          <MapPin size={16} color="#FF6B35" />
          <Text style={styles.restaurantName}>{item.restaurant.name}</Text>
          <RatingBadge rating={item.restaurant.rating} size="small" />
        </TouchableOpacity>
      )}

      {/* Experience Info (for experiences) */}
      {item.type === 'experience' && item.experience && (
        <View style={styles.experienceInfo}>
          <View style={styles.experienceHeader}>
            <View style={styles.experienceTypeContainer}>
              {(() => {
                const IconComponent = getExperienceTypeIcon(item.experience!.type);
                return <IconComponent size={16} color="#FF6B35" />;
              })()}
              <Text style={styles.experienceType}>{item.experience.type}</Text>
            </View>
            <Badge 
              text={item.experience.difficulty} 
              variant="secondary" 
              size="small"
              style={{ backgroundColor: getDifficultyColor(item.experience.difficulty) + '20' }}
            />
          </View>
          <Text style={styles.experienceTitle}>{item.experience.title}</Text>
          <View style={styles.experienceDetails}>
            <View style={styles.experienceDetailItem}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.experienceDetailText}>{item.experience.location}</Text>
            </View>
            <View style={styles.experienceDetailItem}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.experienceDetailText}>{item.experience.duration}</Text>
            </View>
            <View style={styles.experienceDetailItem}>
              <Users size={14} color="#6B7280" />
              <Text style={styles.experienceDetailText}>{item.experience.participants} pessoas</Text>
            </View>
          </View>
        </View>
      )}

      {/* Content */}
      <Text style={styles.postText}>{item.content.text}</Text>

      {/* User Rating (for reviews) */}
      {item.type === 'review' && item.content.rating && (
        <View style={styles.userRating}>
          <Text style={styles.ratingLabel}>Avaliação:</Text>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={16} 
                color="#FFA500" 
                fill={star <= item.content.rating! ? "#FFA500" : "transparent"} 
              />
            ))}
          </View>
          <Text style={styles.ratingValue}>{item.content.rating}/5</Text>
        </View>
      )}

      {/* Images */}
      {item.content.images.length > 0 && (
        <View style={styles.imageContainer}>
          {item.content.images.length === 1 ? (
            <TouchableOpacity style={styles.singleImageContainer}>
              <Image source={{ uri: item.content.images[0] }} style={styles.singleImage} />
              <View style={styles.imageOverlay}>
                <Camera size={20} color="white" />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.multipleImages}>
              <TouchableOpacity style={styles.mainImageContainer}>
                <Image source={{ uri: item.content.images[0] }} style={styles.mainImage} />
                <View style={styles.imageOverlay}>
                  <Camera size={16} color="white" />
                </View>
              </TouchableOpacity>
              <View style={styles.secondaryImages}>
                {item.content.images.slice(1, 3).map((image, index) => (
                  <TouchableOpacity key={index} style={styles.secondaryImageContainer}>
                    <Image source={{ uri: image }} style={styles.secondaryImage} />
                    {index === 1 && item.content.images.length > 3 && (
                      <View style={styles.moreImagesOverlay}>
                        <Text style={styles.moreImagesText}>+{item.content.images.length - 3}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <TouchableOpacity key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Engagement */}
      <View style={styles.engagementContainer}>
        <EngagementButton
          icon={Heart}
          count={item.engagement.likes}
          isActive={item.engagement.liked}
          onPress={() => handleLike(item.id)}
        />
        <EngagementButton
          icon={MessageCircle}
          count={item.engagement.comments}
        />
        <EngagementButton
          icon={Share}
          count={item.engagement.shares}
        />
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={() => handleBookmark(item.id)}
        >
          <Heart 
            size={20} 
            color={item.engagement.bookmarked ? "#FF6B35" : "#6B7280"} 
            fill={item.engagement.bookmarked ? "#FF6B35" : "transparent"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenLayout>
      {/* Header */}
      <Header title="Comunidade" />

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
          />
        }
      >
        {/* Search Section */}
        {renderSearchSection()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Filters */}
        {renderFilters()}

        {/* Posts Feed */}
        <View style={styles.feedContainer}>
          <View style={styles.feedHeader}>
            <Text style={styles.feedTitle}>Feed da Comunidade</Text>
            <Text style={styles.feedSubtitle}>Descubra experiências gastronómicas e avaliações</Text>
          </View>

          {posts.map((post, index) => (
            <View key={post.id}>
              {renderPost(post)}
              {index < posts.length - 1 && <View style={styles.postSeparator} />}
            </View>
          ))}

          {loading && (
            <View style={styles.loadingContainer}>
              <LoadingSpinner size={32} color="#FF6B35" />
              <Text style={styles.loadingText}>Carregando mais posts...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  filterIconButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textAlign: 'center',
  },
  filtersSection: {
    paddingVertical: 8,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  trendingSection: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  trendingList: {
    paddingHorizontal: 20,
  },
  trendingTopic: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    minWidth: 120,
  },
  trendingTopicHot: {
    backgroundColor: '#FFF7F5',
    borderColor: '#FFE5D9',
  },
  trendingBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  trendingNameHot: {
    color: '#FF6B35',
  },
  trendingCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  trendingCountHot: {
    color: '#FF6B35',
  },
  feedContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  feedHeader: {
    marginBottom: 20,
  },
  feedTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  feedSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  featuredPost: {
    borderWidth: 2,
    borderColor: '#FFE5D9',
  },
  featuredBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  featuredText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  postSeparator: {
    height: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  userFollowers: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  postMeta: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  moreButton: {
    padding: 4,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  restaurantName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  experienceInfo: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  experienceTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceType: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  experienceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 12,
  },
  experienceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  experienceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceDetailText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  postText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  userRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  imageContainer: {
    marginBottom: 16,
  },
  singleImageContainer: {
    position: 'relative',
  },
  singleImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 6,
  },
  multipleImages: {
    flexDirection: 'row',
    gap: 8,
  },
  mainImageContainer: {
    flex: 2,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  secondaryImages: {
    flex: 1,
    gap: 8,
  },
  secondaryImageContainer: {
    position: 'relative',
  },
  secondaryImage: {
    width: '100%',
    height: 96,
    borderRadius: 12,
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  engagementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bookmarkButton: {
    padding: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});