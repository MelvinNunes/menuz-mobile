import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScreenLayout, FormInput, PrimaryButton } from '@/components';
import { getColor } from '@/theme/colors';
import { useToast } from '@/hooks/useToast';
import { registerSchema, RegisterFormData } from '@/schemas/register.schema';

export default function RegisterScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { showToast } = useToast();

    const nameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            // TODO: Replace with actual registration service
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock registration logic
            if (data.email && data.password) {
                showToast(t('auth.register.success'), 'success');

                // Navigate to preferences screen
                router.replace('/preferences');
            } else {
                showToast(t('auth.register.networkError'), 'error');
            }
        } catch {
            showToast(t('auth.register.networkError'), 'error');
        }
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: t('auth.register.title'),
                    headerShown: true,
                    headerShadowVisible: false,
                    headerBackTitle: t('buttons.back'),
                    headerStyle: {
                        backgroundColor: getColor('bg.elevated'),
                    },
                    headerTintColor: getColor('fg.primary'),
                    headerTitleStyle: {
                        fontFamily: 'Inter-Bold',
                        fontSize: 18,
                    },
                }}
            />
            <ScreenLayout backgroundColor={getColor('bg.default')} edges={['bottom']}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={[styles.subtitle, { color: getColor('fg.muted') }]}>
                                    {t('auth.register.subtitle')}
                                </Text>
                            </View>

                            <View style={styles.form}>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <FormInput
                                            ref={nameRef}
                                            label={t('auth.register.name')}
                                            placeholder={t('auth.register.namePlaceholder')}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.name ? t(errors.name.message || '') : undefined}
                                            icon="user"
                                            autoCapitalize="words"
                                            autoCorrect={false}
                                            returnKeyType="next"
                                            onSubmitEditing={() => emailRef.current?.focus()}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <FormInput
                                            ref={emailRef}
                                            label={t('auth.register.email')}
                                            placeholder={t('auth.register.emailPlaceholder')}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.email ? t(errors.email.message || '') : undefined}
                                            icon="mail"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            returnKeyType="next"
                                            onSubmitEditing={() => passwordRef.current?.focus()}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <FormInput
                                            ref={passwordRef}
                                            label={t('auth.register.password')}
                                            placeholder={t('auth.register.passwordPlaceholder')}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.password ? t(errors.password.message || '') : undefined}
                                            icon="lock"
                                            showPasswordToggle
                                            secureTextEntry
                                            returnKeyType="next"
                                            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <FormInput
                                            ref={confirmPasswordRef}
                                            label={t('auth.register.confirmPassword')}
                                            placeholder={t('auth.register.confirmPasswordPlaceholder')}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.confirmPassword ? t(errors.confirmPassword.message || '') : undefined}
                                            icon="lock"
                                            showPasswordToggle
                                            secureTextEntry
                                            returnKeyType="done"
                                            onSubmitEditing={handleSubmit(onSubmit)}
                                        />
                                    )}
                                />

                                <PrimaryButton
                                    title={isSubmitting ? t('auth.register.loading') : t('auth.register.registerButton')}
                                    onPress={handleSubmit(onSubmit)}
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                    style={styles.registerButton}
                                />
                            </View>

                            <View style={styles.footer}>
                                <View style={styles.loginPrompt}>
                                    <Text style={[styles.loginText, { color: getColor('fg.muted') }]}>
                                        {t('auth.register.haveAccount')}
                                    </Text>
                                    <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
                                        <Text style={[styles.loginLink, { color: getColor('action.primary') }]}>
                                            {t('auth.register.login')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ScreenLayout>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: -0.2,
    },
    form: {
        marginBottom: 32,
    },
    registerButton: {
        marginBottom: 24,
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    loginPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    loginText: {
        fontSize: 15,
        fontFamily: 'Inter-Medium',
        marginRight: 8,
        letterSpacing: -0.2,
    },
    loginLink: {
        fontSize: 15,
        fontFamily: 'Inter-Bold',
        letterSpacing: -0.2,
    },
});