import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, Settings, Heart, Star, Bell, CircleHelp as HelpCircle, LogOut, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import ScreenLayout from '@/components/layouts/ScreenLayout';
import Header from '@/components/ui/Header';
import UserAvatar from '@/components/ui/UserAvatar';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    reviewsCount: 12,
    photosCount: 35,
    favoritesCount: 8,
  });

  const menuItems = [
    {
      icon: Heart,
      title: 'Meus Favoritos',
      subtitle: `${user.favoritesCount} restaurantes salvos`,
      onPress: () => router.push('/favorites'),
    },
    {
      icon: Star,
      title: 'Minhas Avaliações',
      subtitle: `${user.reviewsCount} avaliações feitas`,
      onPress: () => router.push('/my-reviews'),
    },
    {
      icon: Plus,
      title: 'Sugerir Restaurante',
      subtitle: 'Adicionar novo restaurante à plataforma',
      onPress: () => router.push('/suggest-restaurant'),
    },
    {
      icon: Bell,
      title: 'Notificações',
      subtitle: 'Preferências de notificação',
      onPress: () => router.push('/notification-preferences'),
    },
    {
      icon: Settings,
      title: 'Configurações',
      subtitle: 'Privacidade e conta',
      onPress: () => { },
    },
    {
      icon: HelpCircle,
      title: 'Ajuda e Suporte',
      subtitle: 'FAQ e contacto',
      onPress: () => router.push('/help-support'),
    },
  ];

  const handleSignOut = () => {
    router.push('/welcome');
  };

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header title="Perfil" />

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <UserAvatar
              imageUri={user.avatar}
              size={80}
            />
            <TouchableOpacity style={styles.editButton}>
              <Settings size={16} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.reviewsCount}</Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.photosCount}</Text>
              <Text style={styles.statLabel}>Fotos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.favoritesCount}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <item.icon size={24} color="#FF6B35" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.menuArrow} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Terminar Sessão</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Taste of Maputo v1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  userSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  menuSection: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF7F5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  menuArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftColor: '#9CA3AF',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    marginBottom: 16,
  },
  signOutText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  versionInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});