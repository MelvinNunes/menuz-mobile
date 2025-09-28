import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { getColor } from '@/theme/colors';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    style?: any;
    textStyle?: any;
    icon?: React.ReactNode;
}

export default function PrimaryButton({
    title,
    onPress,
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon
}: PrimaryButtonProps) {
    const getBackgroundColor = () => {
        if (disabled || loading) return getColor('fg.muted');
        return getColor('action.primary');
    };

    const getTextColor = () => {
        if (disabled || loading) return getColor('fg.inverse');
        return getColor('fg.inverse');
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                },
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={getColor('fg.inverse')}
                        style={styles.loader}
                    />
                ) : (
                    icon && <View style={styles.iconContainer}>{icon}</View>
                )}

                <Text style={[
                    styles.text,
                    { color: getTextColor() },
                    textStyle
                ]}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        elevation: 4,
        shadowColor: getColor('action.primary'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
        letterSpacing: -0.2,
    },
    iconContainer: {
        marginRight: 8,
    },
    loader: {
        marginRight: 8,
    },
});
