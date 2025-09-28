import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Platform, ImageBackground } from 'react-native';
import ScreenLayout from '@/components/layouts/ScreenLayout';
import { getColor } from '@/theme/colors';
import { useRouter } from 'expo-router';
import { AnonymousAuthStorage } from '@/services/auth';
import { useTranslation } from 'react-i18next';

export default function WelcomeScreen() {
    const { t } = useTranslation();

    const router = useRouter();

    async function handleContinueAsGuest() {
        await AnonymousAuthStorage.setAnonymous();
        router.replace('/preferences');
    }

    return (
        <ScreenLayout backgroundColor={getColor('bg.default')} edges={['bottom']}>
            <ImageBackground
                source={require('@/assets/images/background/background_1.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.container}>
                    <View style={styles.topBar}>
                        <View style={styles.brandRow}>
                            <Image
                                source={require('@/assets/images/logo.png')}
                                resizeMode="contain"
                                style={styles.logo}
                                accessibilityIgnoresInvertColors
                                accessible
                                accessibilityLabel="App logo"
                            />
                            <Text style={styles.brandName}>Menuz</Text>
                        </View>
                        <Pressable
                            accessibilityRole="button"
                            style={({ pressed }) => [
                                styles.ghostButton,
                                pressed && { opacity: 0.7 },
                            ]}
                            onPress={() => handleContinueAsGuest()}
                        >
                            <Text style={styles.ghostButtonText}>{t('welcome.continueAsGuest')}</Text>
                        </Pressable>
                    </View>

                    <View style={styles.body}>
                        <View style={styles.content}>
                            <Text style={styles.title}>{t('welcome.title')}</Text>
                            <Text style={styles.subtitle}>
                                {t('welcome.subtitle')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Pressable
                            onPress={() => router.navigate("/register")}
                            accessibilityRole="button"
                            style={({ pressed }) => [
                                styles.primaryButton,
                                pressed && styles.primaryButtonPressed,
                            ]}
                        >
                            <Text style={styles.primaryButtonText}>{t('welcome.start')}</Text>
                        </Pressable>

                        <View style={styles.signInRow}>
                            <Text style={styles.signInMuted}>{t('welcome.alreadyHaveAccount')}</Text>
                            <Pressable onPress={() => router.navigate("/login")} accessibilityRole="button">
                                <Text style={styles.signInLink}>{t('welcome.login')}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.select({ ios: 64, android: 24, default: 44 }),
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    logo: {
        width: 28,
        height: 28,
    },
    brandName: {
        color: getColor('fg.primary'),
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    ghostButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    ghostButtonText: {
        color: getColor('fg.primary'),
        fontSize: 14,
        fontWeight: '600',
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 350
    },
    content: {
        alignItems: 'center',
    },
    title: {
        color: getColor('fg.primary'),
        fontSize: 28,
        lineHeight: 34,
        fontWeight: '800',
        textAlign: 'center',
    },
    subtitle: {
        marginTop: 12,
        color: getColor('fg.muted'),
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    primaryButton: {
        backgroundColor: getColor('action.primary'),
        borderRadius: 999,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonPressed: {
        opacity: 0.9,
    },
    primaryButtonText: {
        color: getColor('fg.inverse'),
        fontSize: 16,
        fontWeight: '700',
    },
    signInRow: {
        marginTop: 12,
        gap: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInMuted: {
        color: getColor('fg.primary'),
        fontSize: 15,
    },
    signInLink: {
        color: getColor('action.primary'),
        fontSize: 15,
        fontWeight: '600',
    },
});
