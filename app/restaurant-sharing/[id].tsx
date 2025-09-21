import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { QrCode, Share, Camera, X } from 'lucide-react-native';
import { featuredRestaurants, mockMenuItems } from '@/data/mockData';
import { ScreenLayout, Header } from '@/components';
import QRCodeGenerator from '@/components/sharing/QRCodeGenerator';
import QRCodeScanner from '@/components/sharing/QRCodeScanner';
import SocialSharingCard from '@/components/sharing/SocialSharingCard';

export default function RestaurantSharingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'share'>('qr');

  useEffect(() => {
    if (id) {
      const found = featuredRestaurants.find(r => r.id === id);
      setRestaurant(found);
    }
  }, [id]);

  if (!restaurant) {
    return (
      <ScreenLayout>
        <Header title="Partilhar Restaurante" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Restaurante não encontrado</Text>
        </View>
      </ScreenLayout>
    );
  }

  const generateQRValue = () => {
    return `https://menuz.co.mz/restaurant/${restaurant.id}`;
  };

  const getFeaturedDish = () => {
    // Get a popular dish from the menu
    const allItems = [
      ...mockMenuItems.starters,
      ...mockMenuItems.mains,
      ...mockMenuItems.desserts
    ];
    const popularDish = allItems.find(item => item.popular);
    
    if (popularDish) {
      return {
        name: popularDish.name,
        image: popularDish.image || restaurant.image,
        description: popularDish.description
      };
    }
    
    return undefined;
  };

  const handleShare = (platform: string) => {
    console.log(`Shared to ${platform}`);
  };

  const handleSave = (uri: string) => {
    console.log(`Saved image: ${uri}`);
  };

  const handleQRScan = (data: string) => {
    console.log(`Scanned QR: ${data}`);
  };

  const renderQRSection = () => (
    <View style={styles.tabContent}>
      <View style={styles.qrSection}>
        <Text style={styles.sectionTitle}>Código QR do Restaurante</Text>
        <Text style={styles.sectionSubtitle}>
          Partilhe este código QR para que outros possam aceder rapidamente ao menu digital
        </Text>
        
        <View style={styles.qrContainer}>
          <QRCodeGenerator
            value={generateQRValue()}
            size={200}
            backgroundColor="white"
            color="#FF6B35"
            enableLinearGradient={true}
            linearGradient={['#FF6B35', '#FF8A65']}
            quietZone={10}
          />
        </View>

        <View style={styles.qrInfo}>
          <Text style={styles.qrInfoTitle}>Como usar:</Text>
          <View style={styles.qrSteps}>
            <Text style={styles.qrStep}>1. Mostre este código QR aos clientes</Text>
            <Text style={styles.qrStep}>2. Eles digitalizam com a câmara do telemóvel</Text>
            <Text style={styles.qrStep}>3. Acesso instantâneo ao menu digital</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => setShowQRScanner(true)}
        >
          <Camera size={20} color="white" />
          <Text style={styles.scanButtonText}>Testar Scanner QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderShareSection = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Cartão de Partilha Social</Text>
      <Text style={styles.sectionSubtitle}>
        Crie um cartão visual atrativo para partilhar nas redes sociais
      </Text>
      
      <SocialSharingCard
        restaurant={restaurant}
        featuredDish={getFeaturedDish()}
        onShare={handleShare}
        onSave={handleSave}
      />
    </View>
  );

  return (
    <ScreenLayout>
      <Header title="Partilhar Restaurante" showBackButton />
      
      <View style={styles.container}>
        {/* Restaurant Header */}
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'qr' && styles.activeTab]}
            onPress={() => setActiveTab('qr')}
          >
            <QrCode size={20} color={activeTab === 'qr' ? '#FF6B35' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'qr' && styles.activeTabText]}>
              Código QR
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'share' && styles.activeTab]}
            onPress={() => setActiveTab('share')}
          >
            <Share size={20} color={activeTab === 'share' ? '#FF6B35' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'share' && styles.activeTabText]}>
              Cartão Social
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {activeTab === 'qr' ? renderQRSection() : renderShareSection()}
        </ScrollView>
      </View>

      {/* QR Scanner Modal */}
      <Modal
        visible={showQRScanner}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <QRCodeScanner
          onClose={() => setShowQRScanner(false)}
          onScan={handleQRScan}
        />
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  restaurantHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  restaurantName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FF6B35',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  qrSection: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 32,
  },
  qrInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrInfoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  qrSteps: {
    gap: 8,
  },
  qrStep: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  scanButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});