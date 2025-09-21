import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Flame, Leaf, Wheat, Fish, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { Badge } from '@/components';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  dietary?: string[];
  popular?: boolean;
  spicyLevel?: number;
  allergens?: string[];
  ingredients?: string[];
}

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  onItemPress?: (item: MenuItem) => void;
}

export default function MenuSection({
  title,
  items,
  onItemPress,
}: MenuSectionProps) {
  const getDietaryIcon = (dietary: string) => {
    switch (dietary) {
      case 'vegetarian':
        return Leaf;
      case 'vegan':
        return Leaf;
      case 'gluten-free':
        return Wheat;
      case 'seafood':
        return Fish;
      default:
        return null;
    }
  };

  const getDietaryColor = (dietary: string) => {
    switch (dietary) {
      case 'vegetarian':
        return '#10B981';
      case 'vegan':
        return '#059669';
      case 'gluten-free':
        return '#F59E0B';
      case 'seafood':
        return '#3B82F6';
      case 'spicy':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getDietaryLabel = (dietary: string) => {
    switch (dietary) {
      case 'vegetarian':
        return 'Vegetariano';
      case 'vegan':
        return 'Vegano';
      case 'gluten-free':
        return 'Sem Glúten';
      case 'seafood':
        return 'Frutos do Mar';
      case 'halal':
        return 'Halal';
      case 'kosher':
        return 'Kosher';
      default:
        return dietary;
    }
  };

  const renderSpicyLevel = (level: number) => {
    return (
      <View style={styles.spicyContainer}>
        <View style={styles.spicyLabelContainer}>
          <Flame size={14} color="#EF4444" />
          <Text style={styles.spicyLabel}>Picante</Text>
        </View>
        <View style={styles.spicyDots}>
          {[1, 2, 3].map((dot) => (
            <View
              key={dot}
              style={[
                styles.spicyDot,
                { backgroundColor: dot <= level ? '#EF4444' : '#E5E7EB' }
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderAllergens = (allergens: string[]) => {
    if (!allergens || allergens.length === 0) return null;

    return (
      <View style={styles.allergensContainer}>
        <View style={styles.allergenHeader}>
          <AlertTriangle size={14} color="#F59E0B" />
          <Text style={styles.allergenLabel}>Alergénios:</Text>
        </View>
        <Text style={styles.allergenText}>
          {allergens.join(', ')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionDivider} />
      </View>
      
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.menuItem}
          onPress={() => onItemPress?.(item)}
          activeOpacity={0.8}
        >
          <View style={styles.itemContent}>
            {/* Header with name and popular badge */}
            <View style={styles.itemHeader}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              {item.popular && (
                <Badge text="Popular" variant="warning" size="small" style={styles.popularBadge} />
              )}
            </View>
            
            {/* Description with ingredients */}
            <Text style={styles.itemDescription} numberOfLines={3}>
              {item.description}
              {item.ingredients && item.ingredients.length > 0 && (
                <Text style={styles.ingredientsText}>
                  {'\n'}Ingredientes principais: {item.ingredients.slice(0, 3).join(', ')}
                  {item.ingredients.length > 3 && '...'}
                </Text>
              )}
            </Text>
            
            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.itemPrice}>{item.price} MZN</Text>
            </View>

            {/* Dietary tags and spicy level */}
            <View style={styles.tagsContainer}>
              {item.dietary && item.dietary.length > 0 && (
                <View style={styles.dietaryTags}>
                  {item.dietary.slice(0, 3).map((tag, index) => {
                    const IconComponent = getDietaryIcon(tag);
                    return (
                      <View
                        key={index}
                        style={[
                          styles.dietaryTag,
                          { backgroundColor: getDietaryColor(tag) + '15', borderColor: getDietaryColor(tag) }
                        ]}
                      >
                        {IconComponent && (
                          <IconComponent size={12} color={getDietaryColor(tag)} />
                        )}
                        <Text style={[styles.dietaryTagText, { color: getDietaryColor(tag) }]}>
                          {getDietaryLabel(tag)}
                        </Text>
                      </View>
                    );
                  })}
                  {item.dietary.length > 3 && (
                    <View style={styles.moreTagsIndicator}>
                      <Text style={styles.moreTagsText}>+{item.dietary.length - 3}</Text>
                    </View>
                  )}
                </View>
              )}
              
              {item.spicyLevel && item.spicyLevel > 0 && (
                renderSpicyLevel(item.spicyLevel)
              )}
            </View>

            {/* Allergens information */}
            {renderAllergens(item.allergens)}
          </View>
          
          {/* High-quality food image */}
          {item.image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              {item.popular && (
                <View style={styles.imagePopularOverlay}>
                  <Text style={styles.imagePopularText}>★</Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: '#FF6B35',
    width: 40,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemContent: {
    flex: 1,
    paddingRight: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    flex: 1,
    lineHeight: 26,
  },
  popularBadge: {
    marginLeft: 8,
    marginTop: 2,
  },
  itemDescription: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 12,
  },
  ingredientsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  priceContainer: {
    marginBottom: 16,
  },
  itemPrice: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  tagsContainer: {
    gap: 12,
  },
  dietaryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietaryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  dietaryTagText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  moreTagsIndicator: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  moreTagsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  spicyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  spicyLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spicyLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  spicyDots: {
    flexDirection: 'row',
    gap: 3,
  },
  spicyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  allergensContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  allergenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  allergenLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  allergenText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  imagePopularOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F59E0B',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  imagePopularText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
});