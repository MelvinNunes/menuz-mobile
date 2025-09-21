import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

interface RatingBadgeProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  textColor?: string;
}

export default function RatingBadge({ 
  rating, 
  size = 'medium',
  backgroundColor = '#10B981',
  textColor = 'white'
}: RatingBadgeProps) {
  const sizeStyles = {
    small: { padding: 4, fontSize: 12, iconSize: 12 },
    medium: { padding: 6, fontSize: 14, iconSize: 16 },
    large: { padding: 8, fontSize: 16, iconSize: 18 }
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor,
        paddingHorizontal: currentSize.padding + 2,
        paddingVertical: currentSize.padding
      }
    ]}>
      <Star size={currentSize.iconSize} color="#FFA500" fill="#FFA500" />
      <Text style={[
        styles.text, 
        { 
          color: textColor,
          fontSize: currentSize.fontSize,
          marginLeft: currentSize.padding / 2
        }
      ]}>
        {rating}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
  },
});