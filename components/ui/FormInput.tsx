import React, { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';
import { getColor } from '@/theme/colors';

interface FormInputProps extends TextInputProps {
    label: string;
    error?: string;
    containerStyle?: any;
    inputStyle?: any;
    icon?: 'mail' | 'lock' | 'user';
    showPasswordToggle?: boolean;
}

const FormInput = forwardRef<TextInput, FormInputProps>(({
    label,
    error,
    containerStyle,
    inputStyle,
    icon,
    showPasswordToggle = false,
    secureTextEntry,
    ...textInputProps
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handlePasswordToggle = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleFocus = useCallback((e: any) => {
        // Clear any pending blur timeout
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
        }
        setIsFocused(true);
        textInputProps.onFocus?.(e);
    }, [textInputProps.onFocus]);

    const handleBlur = useCallback((e: any) => {
        // Use a small timeout to ensure proper focus handling
        blurTimeoutRef.current = setTimeout(() => {
            setIsFocused(false);
        }, 100);
        textInputProps.onBlur?.(e);
    }, [textInputProps.onBlur]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
            }
        };
    }, []);

    const getIcon = () => {
        if (icon === 'mail') {
            return <Mail size={20} color={isFocused ? getColor('action.primary') : getColor('fg.muted')} />;
        }
        if (icon === 'lock') {
            return <Lock size={20} color={isFocused ? getColor('action.primary') : getColor('fg.muted')} />;
        }
        if (icon === 'user') {
            return <User size={20} color={isFocused ? getColor('action.primary') : getColor('fg.muted')} />;
        }
        return null;
    };

    const getBorderColor = () => {
        if (error) return getColor('danger.border');
        if (isFocused) return getColor('action.primary');
        return getColor('border.default');
    };

    const getBackgroundColor = () => {
        if (isFocused) return getColor('bg.elevated');
        return getColor('bg.subtle');
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={[styles.label, { color: getColor('fg.primary') }]}>
                {label}
            </Text>

            <View style={[
                styles.inputContainer,
                {
                    borderColor: getBorderColor(),
                    backgroundColor: getBackgroundColor(),
                }
            ]}>
                {icon && (
                    <View style={styles.iconContainer}>
                        {getIcon()}
                    </View>
                )}

                <TextInput
                    ref={ref}
                    style={[
                        styles.input,
                        { color: getColor('fg.primary') },
                        inputStyle
                    ]}
                    placeholderTextColor={getColor('fg.muted')}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
                    {...textInputProps}
                />

                {showPasswordToggle && (
                    <TouchableOpacity
                        onPress={handlePasswordToggle}
                        style={styles.passwordToggle}
                        activeOpacity={0.7}
                    >
                        {isPasswordVisible ? (
                            <EyeOff size={20} color={getColor('fg.muted')} />
                        ) : (
                            <Eye size={20} color={getColor('fg.muted')} />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {error && (
                <Text style={[styles.errorText, { color: getColor('danger.text') }]}>
                    {error}
                </Text>
            )}
        </View>
    );
});

FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        marginBottom: 6,
        letterSpacing: -0.2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        minHeight: 48,
    },
    iconContainer: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        letterSpacing: -0.1,
        paddingVertical: 0,
    },
    passwordToggle: {
        padding: 4,
        marginLeft: 8,
    },
    errorText: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        marginTop: 4,
        letterSpacing: -0.1,
    },
});

export default FormInput;
