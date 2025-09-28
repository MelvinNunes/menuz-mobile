import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScreenLayout, FormInput, PrimaryButton } from '@/components';
import { getColor } from '@/theme/colors';
import { useToast } from '@/hooks/useToast';
import { clearAnonymousUserStatus } from '@/services/auth';
import { loginSchema, LoginFormData } from '@/schemas/login.schema';

export default function LoginScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { showToast } = useToast();

    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            // TODO: Replace with actual authentication service
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock authentication logic
            if (data.email === 'demo@menuz.com' && data.password === 'password') {
                // Clear anonymous user status since user is now authenticated
                await clearAnonymousUserStatus();

                showToast(t('auth.login.loading'), 'success');

                // Navigate to main app
                router.replace('/(tabs)');
            } else {
                showToast(t('auth.login.invalidCredentials'), 'error');
            }
        } catch (error) {
            showToast(t('auth.login.networkError'), 'error');
        }
    };

    const handleForgotPassword = () => {
        Alert.alert(
            t('auth.login.forgotPassword'),
            'Funcionalidade em desenvolvimento. Em breve você poderá redefinir sua senha.',
            [{ text: 'OK' }]
        );
    };

    const handleRegister = () => {
        router.push('/register');
    };


    return (
        <>
            <Stack.Screen
                options={{
                    title: t('auth.login.title'),
                    headerShown: true,
                    headerShadowVisible: false,
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
                                    {t('auth.login.subtitle')}
                                </Text>
                            </View>

                            <View style={styles.form}>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <FormInput
                                            ref={emailRef}
                                            label={t('auth.login.email')}
                                            placeholder={t('auth.login.emailPlaceholder')}
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
                                            label={t('auth.login.password')}
                                            placeholder={t('auth.login.passwordPlaceholder')}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.password ? t(errors.password.message || '') : undefined}
                                            icon="lock"
                                            showPasswordToggle
                                            secureTextEntry
                                            returnKeyType="done"
                                            onSubmitEditing={handleSubmit(onSubmit)}
                                        />
                                    )}
                                />

                                <TouchableOpacity
                                    onPress={handleForgotPassword}
                                    style={styles.forgotPassword}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.forgotPasswordText, { color: getColor('action.primary') }]}>
                                        {t('auth.login.forgotPassword')}
                                    </Text>
                                </TouchableOpacity>

                                <PrimaryButton
                                    title={isSubmitting ? t('auth.login.loading') : t('auth.login.loginButton')}
                                    onPress={handleSubmit(onSubmit)}
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                    style={styles.loginButton}
                                />
                            </View>

                            <View style={styles.footer}>
                                <View style={styles.registerPrompt}>
                                    <Text style={[styles.registerText, { color: getColor('fg.muted') }]}>
                                        {t('auth.login.noAccount')}
                                    </Text>
                                    <TouchableOpacity onPress={handleRegister} activeOpacity={0.7}>
                                        <Text style={[styles.registerLink, { color: getColor('action.primary') }]}>
                                            {t('auth.login.register')}
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 32,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        letterSpacing: -0.1,
    },
    loginButton: {
        marginBottom: 24,
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    registerPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    registerText: {
        fontSize: 15,
        fontFamily: 'Inter-Medium',
        marginRight: 8,
        letterSpacing: -0.2,
    },
    registerLink: {
        fontSize: 15,
        fontFamily: 'Inter-Bold',
        letterSpacing: -0.2,
    },
});