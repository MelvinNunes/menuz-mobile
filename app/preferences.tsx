import { ScreenLayout } from "@/components";
import { getColor } from "@/theme/colors";
import { Text, View } from "react-native";

export default function UserOnboardingPreferencesScreen() {
    return (
        <ScreenLayout backgroundColor={getColor('bg.default')} edges={['top', 'bottom']}>
            <View>
                <Text>Preferences</Text>
            </View>
        </ScreenLayout>
    )
}