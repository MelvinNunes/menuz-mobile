import React from 'react';
import ScreenLayout from "@/components/layouts/ScreenLayout";
import { getColor } from "@/theme/colors";
import PreferencesFlow from "@/components/preferences/PreferencesFlow";

export default function UserOnboardingPreferencesScreen() {
    return (
        <ScreenLayout backgroundColor={getColor('bg.default')} edges={['top', 'bottom']}>
            <PreferencesFlow />
        </ScreenLayout>
    )
}