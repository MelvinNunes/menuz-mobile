import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';

interface EngagementButtonProps {
  icon: LucideIcon;
  count: number;
  isActive?: boolean;
  onPress?: () => void;
  activeColor?: string;
  inactiveColor?: string;
}

export default function EngagementButton({
  icon: Icon,
  count,
  isActive = false,
  onPress,
  activeColor = '#FF6B35',
  inactiveColor = '#6B7280'
}: EngagementButtonProps) {
  const iconColor = isActive ? activeColor : inactiveColor;
  const textColor = isActive ? activeColor : inactiveColor;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon 
        size={20} 
        color={iconColor} 
        fill={isActive ? iconColor : 'transparent'}
      />
      <Text style={[styles.text, { color: textColor }]}>
        {count}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});