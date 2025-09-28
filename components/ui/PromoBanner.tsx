import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

interface PromoBannerProps {
  title: string;
  discount: string;
  description: string;
  image: string;
  onPress?: () => void;
  width?: number;
  height?: number;
  promotionId?: string;
}

export default function PromoBanner({
  title,
  discount,
  description,
  image,
  onPress,
  width = 300,
  height = 120,
  promotionId
}: PromoBannerProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (promotionId) {
      router.push(`/promotion/${promotionId}`);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width, height }]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.discount}>Até {discount}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  image: {
    width: '50%',
    height: '100%',
  },
  content: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: 'white',
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  discount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});