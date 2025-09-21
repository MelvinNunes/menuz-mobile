import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export default function Badge({
  text,
  variant = 'primary',
  size = 'medium',
  style
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: '#FF6B35', color: 'white' };
      case 'secondary':
        return { backgroundColor: '#F3F4F6', color: '#374151' };
      case 'success':
        return { backgroundColor: '#10B981', color: 'white' };
      case 'warning':
        return { backgroundColor: '#F59E0B', color: 'white' };
      case 'error':
        return { backgroundColor: '#EF4444', color: 'white' };
      default:
        return { backgroundColor: '#FF6B35', color: 'white' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 };
      case 'medium':
        return { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 };
      case 'large':
        return { paddingHorizontal: 16, paddingVertical: 8, fontSize: 16 };
      default:
        return { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View style={[
      styles.container,
      { backgroundColor: variantStyles.backgroundColor },
      { paddingHorizontal: sizeStyles.paddingHorizontal, paddingVertical: sizeStyles.paddingVertical },
      style
    ]}>
      <Text style={[
        styles.text,
        { color: variantStyles.color, fontSize: sizeStyles.fontSize }
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});