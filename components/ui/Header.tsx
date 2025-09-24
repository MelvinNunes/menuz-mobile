import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getColor } from '@/theme/colors';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
  backgroundColor?: string;
  titleColor?: string;
  showSuggestButton?: boolean;
}

export default function Header({
  title,
  showBackButton = false,
  rightComponent,
  onBackPress,
  backgroundColor = getColor('bg.elevated'),
  titleColor = getColor('fg.primary'),
  showSuggestButton = false
}: HeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleSuggestPress = () => {
    router.push('/suggest-restaurant');
  };

  const renderRightComponent = () => {
    if (rightComponent) {
      return rightComponent;
    }

    if (showSuggestButton) {
      return (
        <TouchableOpacity onPress={handleSuggestPress} style={styles.suggestButton}>
          <Plus size={20} color={getColor('action.primary')} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.spacer} />;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {showBackButton ? (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft size={24} color={getColor('fg.primary')} />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        <View style={styles.titleUnderline} />
      </View>

      {renderRightComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: getColor('bg.subtle'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    ...Platform.select({
      ios: {
        paddingTop: 16,
      },
    }),
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  titleUnderline: {
    width: 40,
    height: 3,
    backgroundColor: getColor('action.primary'),
    borderRadius: 2,
    marginTop: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: getColor('bg.subtle'),
    borderWidth: 1,
    borderColor: getColor('border.default'),
  },
  spacer: {
    width: 40,
  },
  suggestButton: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: getColor('action.secondary'),
    borderWidth: 2,
    borderColor: getColor('border.default'),
    elevation: 2,
    shadowColor: getColor('action.primary'),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});