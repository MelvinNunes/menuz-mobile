import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { Video as LucideIcon, ChevronDown } from 'lucide-react-native';

interface FilterButtonProps {
  label: string;
  icon?: LucideIcon;
  isActive?: boolean;
  onPress?: () => void;
  showArrow?: boolean;
  disabled?: boolean;
  style?: any;
}

export default function FilterButton({
  label,
  icon: Icon,
  isActive = false,
  onPress,
  showArrow = false,
  disabled = false,
  style
}: FilterButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const backgroundAnim = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(backgroundAnim, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (isActive) {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      glow.start();
      return () => glow.stop();
    }
  }, [isActive]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#FF6B35'],
  });

  const borderColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E7EB', '#FF6B35'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      {isActive && (
        <Animated.View style={[
          styles.glowEffect,
          { opacity: glowOpacity }
        ]} />
      )}
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        <Animated.View style={[
          styles.container,
          { 
            backgroundColor,
            borderColor,
          },
          disabled && styles.disabled
        ]}>
          {Icon && (
            <Icon 
              size={16} 
              color={isActive ? "white" : "#374151"} 
            />
          )}
          <Text style={[
            styles.text,
            isActive && styles.activeText,
            Icon && styles.textWithIcon,
            disabled && styles.disabledText
          ]}>
            {label}
          </Text>
          {showArrow && (
            <ChevronDown 
              size={14} 
              color={isActive ? "white" : "#9CA3AF"}
              style={styles.arrow}
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: '#FF6B35',
    borderRadius: 28,
    zIndex: -1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    minHeight: 44,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    letterSpacing: -0.1,
  },
  activeText: {
    color: 'white',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  textWithIcon: {
    marginLeft: 8,
  },
  arrow: {
    marginLeft: 6,
  },
});