export const promotionalBanners = [
  {
    id: '1',
    title: 'Dia de Pizza!',
    discount: '10%',
    description: 'desconto',
    image:
      'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    title: 'Seafood Special',
    discount: '15%',
    description: 'desconto',
    image:
      'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    title: 'Happy Hour',
    discount: '20%',
    description: 'desconto em bebidas',
    image:
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

// Quick Suggestions Categories
export const quickSuggestionsCategories = [
  {
    id: 'hamburgers',
    name: 'HAMBURGERS',
    icon: '🍔',
    color: '#FF6B35',
  },
  {
    id: 'drinks',
    name: 'BEBIDAS',
    icon: '🥤',
    color: '#3B82F6',
  },
  {
    id: 'pizzas',
    name: 'PIZZAS',
    icon: '🍕',
    color: '#10B981',
  },
  {
    id: 'desserts',
    name: 'SOBREMESAS',
    icon: '🍰',
    color: '#8B5CF6',
  },
  {
    id: 'vegetables',
    name: 'VEGETAIS',
    icon: '🥗',
    color: '#059669',
  },
  {
    id: 'chicken',
    name: 'FRANGO',
    icon: '🍗',
    color: '#DC2626',
  },
  {
    id: 'fish',
    name: 'PEIXE',
    icon: '🐟',
    color: '#0891B2',
  },
  {
    id: 'juices',
    name: 'SUMOS',
    icon: '🧃',
    color: '#EA580C',
  },
];

// Most Explored Restaurants (Mozambican context)
export const mostExploredRestaurants = [
  {
    id: '1',
    name: "Galito's Maputo",
    cuisine: 'Frango Grelhado',
    rating: 4.4,
    reviewCount: 312,
    distance: '2.1km',
    priceRange: 'MT 200-400',
    image:
      'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    name: 'Pizzaria Italiano',
    cuisine: 'Pizza & Massas',
    rating: 4.6,
    reviewCount: 189,
    distance: '1.5km',
    priceRange: 'MT 300-600',
    image:
      'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    name: 'Ocean Basket',
    cuisine: 'Frutos do Mar',
    rating: 4.2,
    reviewCount: 156,
    distance: '3.2km',
    priceRange: 'MT 400-800',
    image:
      'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

// Nearest Restaurants
export const nearestRestaurants = [
  {
    id: '4',
    name: 'Café Sol',
    cuisine: 'Café & Pastéis',
    distance: '0.4km',
    image:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '5',
    name: 'Burger King Maputo',
    cuisine: 'Fast Food',
    distance: '0.6km',
    image:
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '6',
    name: 'Restaurante Costa do Sol',
    cuisine: 'Cozinha Moçambicana',
    distance: '0.8km',
    image:
      'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

// Mozambique-specific restaurant categories
export const mozambiqueCategories = [
  {
    id: 'localChains',
    name: 'Cadeias Locais',
    icon: '🏪',
    color: '#FF6B35',
  },
  {
    id: 'traditional',
    name: 'Tradicional',
    icon: '🏛️',
    color: '#8B5CF6',
  },
  {
    id: 'seafood',
    name: 'Frutos do Mar',
    icon: '🐟',
    color: '#0891B2',
  },
  {
    id: 'fastFood',
    name: 'Fast Food',
    icon: '🍔',
    color: '#DC2626',
  },
  {
    id: 'cafes',
    name: 'Cafés',
    icon: '☕',
    color: '#EA580C',
  },
];

export const featuredRestaurants = [
  {
    id: '1',
    name: 'Nome do restaurante',
    address: 'Av. Julius Nyerere 1234, Maputo',
    rating: 4.3,
    reviewCount: 150,
    distance: '2,3 km distante',
    priceRange: '100 MZN',
    hasPromotion: true,
    image:
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    cuisine: ['Mediterranean', 'Seafood', 'Portuguese'],
    dietary: ['vegetarian', 'gluten-free'],
    openingHours: {
      wednesday: '17:00-20:00',
      thursday: '17:00-21:00',
      friday: '17:00-21:00',
      saturday: '17:00-21:00',
      sunday: '17:00-20:00',
    },
    phone: '+258 21 123 456',
    website: 'www.restaurante.co.mz',
  },
  {
    id: '2',
    name: 'Restaurante Costa do Sol',
    address: 'Av. Marginal 567, Maputo',
    rating: 4.5,
    reviewCount: 230,
    distance: '1,8 km distante',
    priceRange: '150 MZN',
    hasPromotion: false,
    image:
      'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=800',
    cuisine: ['Seafood', 'Mozambican', 'Grilled'],
    dietary: ['seafood'],
    phone: '+258 21 234 567',
    website: 'www.costadosol.co.mz',
  },
  {
    id: '3',
    name: 'Piri Piri Palace',
    address: 'Rua da Paz 890, Maputo',
    rating: 4.1,
    reviewCount: 180,
    distance: '3,1 km distante',
    priceRange: '80 MZN',
    hasPromotion: true,
    image:
      'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=800',
    cuisine: ['Portuguese', 'Grilled', 'Chicken'],
    dietary: ['halal'],
    phone: '+258 21 345 678',
    website: 'www.piripiripalace.co.mz',
  },
];

export const mockMenuItems = {
  starters: [
    {
      id: '1',
      name: 'Camarão Grelhado',
      description:
        'Camarões frescos grelhados com alho e ervas aromáticas, servidos com molho de manteiga e limão. Uma entrada perfeita para os amantes de frutos do mar.',
      price: 120,
      image:
        'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
      dietary: ['seafood'],
      popular: true,
      ingredients: [
        'Camarão fresco',
        'Alho',
        'Ervas aromáticas',
        'Manteiga',
        'Limão',
      ],
      allergens: ['Crustáceos'],
    },
    {
      id: '2',
      name: 'Samosas de Carne',
      description:
        'Samosas tradicionais com recheio de carne temperada e especiarias, servidas com chutney de manga. Crocantes por fora e suculentas por dentro.',
      price: 85,
      dietary: ['halal'],
      spicyLevel: 2,
      ingredients: ['Carne de vaca', 'Cebola', 'Especiarias', 'Massa filo'],
      allergens: ['Glúten'],
    },
    {
      id: '3',
      name: 'Salada Tropical',
      description:
        'Mistura de folhas verdes frescas com manga, abacate e molho de coco. Uma opção refrescante e nutritiva para começar a refeição.',
      price: 95,
      image:
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      dietary: ['vegetarian', 'vegan', 'gluten-free'],
      ingredients: ['Folhas verdes', 'Manga', 'Abacate', 'Coco', 'Azeite'],
      allergens: [],
    },
  ],
  mains: [
    {
      id: '4',
      name: 'Lagosta Grelhada',
      description:
        'Lagosta fresca grelhada com manteiga de ervas e especiarias, acompanhada de arroz de coco e legumes salteados. Um prato premium para ocasiões especiais.',
      price: 450,
      image:
        'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      dietary: ['seafood'],
      popular: true,
      ingredients: [
        'Lagosta fresca',
        'Manteiga',
        'Ervas',
        'Arroz',
        'Coco',
        'Legumes',
      ],
      allergens: ['Crustáceos'],
    },
    {
      id: '5',
      name: 'Frango Piri Piri',
      description:
        'Frango grelhado no estilo português tradicional com molho piri piri picante, servido com batatas assadas e salada mista. Um clássico da culinária lusófona.',
      price: 180,
      dietary: ['halal'],
      spicyLevel: 3,
      popular: true,
      image:
        'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Frango', 'Piri piri', 'Batatas', 'Azeite', 'Alho'],
      allergens: [],
    },
    {
      id: '6',
      name: 'Curry Vegetariano',
      description:
        'Curry rico em leite de coco com legumes da época e especiarias aromáticas, servido com arroz basmati. Uma explosão de sabores vegetarianos.',
      price: 140,
      dietary: ['vegetarian', 'vegan'],
      spicyLevel: 2,
      image:
        'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: [
        'Legumes da época',
        'Leite de coco',
        'Especiarias',
        'Arroz basmati',
      ],
      allergens: [],
    },
  ],
  desserts: [
    {
      id: '7',
      name: 'Pudim de Coco',
      description:
        'Pudim tradicional de coco com calda de caramelo, preparado com leite de coco fresco e ovos. Uma sobremesa cremosa e irresistível.',
      price: 65,
      dietary: ['vegetarian'],
      image:
        'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Leite de coco', 'Ovos', 'Açúcar', 'Baunilha'],
      allergens: ['Ovos', 'Lactose'],
    },
    {
      id: '8',
      name: 'Gelado Tropical',
      description:
        'Gelado artesanal de frutas tropicais com manga fresca e maracujá, sem adição de conservantes. Refrescante e natural.',
      price: 55,
      dietary: ['vegetarian', 'gluten-free'],
      image:
        'https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Manga', 'Maracujá', 'Açúcar', 'Água'],
      allergens: [],
    },
  ],
};

export const mockReviews = [
  {
    id: '1',
    user: {
      name: 'Kelly Blackwell',
      avatar:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      reviewCount: 5,
    },
    rating: 5,
    date: 'há 2 dias',
    text: 'There was a new server, Lonna i believe, and she was great. Food, ambiance always A+. The seafood platter was absolutely incredible!',
    images: [
      'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=300',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=300',
    ],
    helpful: 12,
    replies: 2,
    isHelpful: false,
  },
  {
    id: '2',
    user: {
      name: 'Maria Fernandes',
      avatar:
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
      reviewCount: 12,
    },
    rating: 4,
    date: 'há 1 semana',
    text: 'Amazing seafood and great service. The atmosphere is perfect for a romantic dinner. Will definitely come back! The piri piri chicken was a bit too spicy for my taste though.',
    helpful: 8,
    replies: 1,
    isHelpful: true,
  },
  {
    id: '3',
    user: {
      name: 'João Silva',
      avatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      reviewCount: 8,
    },
    rating: 5,
    date: 'há 2 semanas',
    text: 'Best restaurant in Maputo! The piri piri chicken is incredible and the staff is very friendly. Great value for money and the portions are generous.',
    images: [
      'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=300',
    ],
    helpful: 15,
    replies: 3,
    isHelpful: false,
  },
];

export const mockPhotos = {
  food: [
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=400',
  ],
  outdoor: [
    'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  ],
};

// User preferences and dietary restrictions
export const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetariano', icon: 'Leaf' },
  { id: 'vegan', label: 'Vegano', icon: 'Leaf' },
  { id: 'gluten-free', label: 'Sem Glúten', icon: 'Wheat' },
  { id: 'seafood', label: 'Frutos do Mar', icon: 'Fish' },
  { id: 'halal', label: 'Halal', icon: 'Beef' },
  { id: 'kosher', label: 'Kosher', icon: 'Coffee' },
];

// User data structure
export const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  avatar:
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  reviewsCount: 12,
  photosCount: 35,
  favoritesCount: 8,
  dietaryPreferences: ['vegetarian', 'gluten-free'],
  location: 'Maputo, Moçambique',
  joinDate: '2023-01-15',
};
