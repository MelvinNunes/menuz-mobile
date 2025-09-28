import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { AnonymousAuthStorage } from '@/services/auth';
import { OnboardingStorage } from '@/services/preferences';
import LoadingChef from '@/components/ui/LoadingChef';

const loadingMessages = [
    "Checking your preferences...",
    "Loading your profile...",
    "Almost ready..."
];

export default function IndexScreen() {
    const router = useRouter();

    useEffect(() => {
        checkInitialRoute();
    }, []);

    const checkInitialRoute = async () => {
        try {
            const [isAnonymous, hasCompletedOnboarding] = await Promise.all([
                AnonymousAuthStorage.isAnonymous(),
                OnboardingStorage.isCompleted()
            ]);

            // First-time users (not anonymous and no onboarding) → Welcome
            if (!isAnonymous && !hasCompletedOnboarding) {
                router.replace('/welcome');
                return;
            }

            // Users who need onboarding (anonymous or auth without onboarding) → Preferences  
            if (!hasCompletedOnboarding) {
                router.replace('/welcome');
                return;
            }

            // Users with completed onboarding → Main app
            router.replace('/(tabs)');

        } catch (error) {
            console.error('Error checking initial route:', error);
            // Default to welcome screen on error
            router.replace('/welcome');
        }
    };

    return <LoadingChef loadingMessages={loadingMessages} />;
}