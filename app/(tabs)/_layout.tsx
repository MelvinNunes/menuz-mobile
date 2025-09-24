import { Tabs } from 'expo-router';
import { Home, Search, Heart, User, ForkKnife } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { getColor } from '@/theme/colors';

export default function TabLayout() {
  const router = useRouter();
  const isIos = Platform.OS === 'ios';
  const iosVersionMajor = isIos
    ? parseInt(String(Platform.Version).split('.')[0], 10)
    : 0;
  const useNativeTabs = isIos && iosVersionMajor >= 26;

  const handleSearchTabPress = () => {
    router.push(`/search`);
  };

  // if (useNativeTabs) {
  //   return (
  //     <NativeTabs>
  //       <NativeTabs.Trigger name="index">
  //         <Icon sf={{ default: 'house', selected: 'house.fill' }} selectedColor={getColor('action.primary')} />
  //         <Label selectedStyle={{ color: getColor('action.primary') }}>Início</Label>
  //       </NativeTabs.Trigger>
  //       <NativeTabs.Trigger name="search" role="search">
  //         <Icon sf="magnifyingglass" selectedColor={getColor('action.primary')} />
  //         <Label selectedStyle={{ color: getColor('action.primary') }}>Pesquisar</Label>
  //       </NativeTabs.Trigger>
  //       <NativeTabs.Trigger name="explore">
  //         <Icon sf={{ default: 'fork.knife', selected: 'fork.knife.circle.fill' }} selectedColor={getColor('action.primary')} />
  //         <Label selectedStyle={{ color: getColor('action.primary') }}>Explorar</Label>
  //       </NativeTabs.Trigger>
  //       <NativeTabs.Trigger name="favorites">
  //         <Icon sf={{ default: 'heart', selected: 'heart.fill' }} selectedColor={getColor('action.primary')} />
  //         <Label selectedStyle={{ color: getColor('action.primary') }}>Favoritos</Label>
  //       </NativeTabs.Trigger>
  //     </NativeTabs>
  //   );
  // }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: getColor('action.primary'),
        tabBarInactiveTintColor: getColor('fg.muted'),
        tabBarStyle: {
          backgroundColor: getColor('bg.elevated'),
          borderTopWidth: 1,
          borderTopColor: getColor('border.subtle'),
          paddingTop: Platform.OS === 'ios' ? 8 : 4,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 90 : 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Pesquisar',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleSearchTabPress();
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ size, color }) => (
            <ForkKnife size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}