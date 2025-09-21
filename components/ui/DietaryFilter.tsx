import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Leaf, Wheat, Fish, Beef, Coffee } from 'lucide-react-native';

interface DietaryOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface DietaryFilterProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  style?: any;
}

const dietaryOptions: DietaryOption[] = [
  {
    id: 'vegetarian',
    label: 'Vegetariano',
    icon: Leaf,
    color: '#10B981',
  },
  {
    id: 'vegan',
    label: 'Vegano',
    icon: Leaf,
    color: '#059669',
  },
  {
    id: 'gluten-free',
    label: 'Sem Glúten',
    icon: Wheat,
    color: '#F59E0B',
  },
  {
    id: 'seafood',
    label: 'Frutos do Mar',
    icon: Fish,
    color: '#3B82F6',
  },
  {
    id: 'halal',
    label: 'Halal',
    icon: Beef,
    color: '#8B5CF6',
  },
  {
    id: 'kosher',
    label: 'Kosher',
    icon: Coffee,
    color: '#6366F1',
  },
];

export default function DietaryFilter({
  selectedFilters,
  onFilterChange,
  style
}: DietaryFilterProps) {
  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    
    onFilterChange(newFilters);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Preferências Alimentares</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {dietaryOptions.map((option) => {
          const isSelected = selectedFilters.includes(option.id);
          const IconComponent = option.icon;
          
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterChip,
                isSelected && { 
                  backgroundColor: option.color,
                  borderColor: option.color 
                }
              ]}
              onPress={() => toggleFilter(option.id)}
            >
              <IconComponent 
                size={16} 
                color={isSelected ? 'white' : option.color} 
              />
              <Text style={[
                styles.filterText,
                isSelected && styles.filterTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  filtersContainer: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  filterTextSelected: {
    color: 'white',
  },
});