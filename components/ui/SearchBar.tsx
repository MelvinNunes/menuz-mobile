import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, TextInputProps, Animated } from 'react-native';
import { Search, X, Sparkles } from 'lucide-react-native';

interface SearchBarProps extends TextInputProps {
  onPress?: () => void;
  editable?: boolean;
  containerStyle?: any;
  showClearButton?: boolean;
  onClear?: () => void;
  loading?: boolean;
}

const SearchBar = forwardRef<TextInput, SearchBarProps>(({
  onPress,
  editable = true,
  containerStyle,
  showClearButton = false,
  onClear,
  loading = false,
  value,
  ...textInputProps
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const focusAnim = React.useRef(new Animated.Value(0)).current;
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  React.useEffect(() => {
    if (loading) {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      shimmer.start();
      return () => shimmer.stop();
    }
  }, [loading]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E7EB', '#FF6B35'],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F9FAFB', '#FFFFFF'],
  });

  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05, 0.15],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={[
      styles.container, 
      { 
        borderColor, 
        backgroundColor,
        shadowOpacity,
      }, 
      containerStyle
    ]}>
      <Component 
        style={styles.content}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.iconContainer}>
          {loading ? (
            <Animated.View style={{ opacity: shimmerOpacity }}>
              <Sparkles size={20} color="#FF6B35" />
            </Animated.View>
          ) : (
            <Search size={20} color={isFocused ? "#FF6B35" : "#9CA3AF"} />
          )}
        </View>
        
        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          editable={editable && !onPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          {...textInputProps}
        />
        
        {showClearButton && value && value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <X size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        
        {isFocused && (
          <View style={styles.focusIndicator} />
        )}
      </Component>
    </Animated.View>
  );
});

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'relative',
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    letterSpacing: -0.1,
  },
  clearButton: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  focusIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
});

export default SearchBar;