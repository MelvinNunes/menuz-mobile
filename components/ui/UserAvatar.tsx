import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface UserAvatarProps {
  imageUri?: string;
  initials?: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
  showBadge?: boolean;
  badgeColor?: string;
}

export default function UserAvatar({
  imageUri,
  initials,
  size = 48,
  backgroundColor = '#FF6B35',
  textColor = 'white',
  onPress,
  showBadge = false,
  badgeColor = '#10B981'
}: UserAvatarProps) {
  const Component = onPress ? TouchableOpacity : View;
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <Component onPress={onPress} style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={[styles.image, avatarStyle]} />
      ) : (
        <View style={[styles.placeholder, avatarStyle, { backgroundColor }]}>
          <Text style={[styles.initials, { color: textColor, fontSize: size * 0.4 }]}>
            {initials}
          </Text>
        </View>
      )}
      {showBadge && (
        <View style={[
          styles.badge, 
          { 
            backgroundColor: badgeColor,
            width: size * 0.35,
            height: size * 0.35,
            borderRadius: size * 0.175,
            bottom: 0,
            right: 0
          }
        ]}>
          <Text style={[styles.badgeText, { fontSize: size * 0.25 }]}>✓</Text>
        </View>
      )}
    </Component>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontFamily: 'Inter-SemiBold',
  },
  badge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
});