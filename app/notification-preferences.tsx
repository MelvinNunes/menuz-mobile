import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  Bell,
  Star,
  Heart,
  MessageCircle,
  Users,
  MapPin,
  TrendingUp,
  Calendar,
  Clock,
  Smartphone,
  Mail,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Settings,
  Check
} from 'lucide-react-native';
import ScreenLayout from '@/components/layouts/ScreenLayout';
import Header from '@/components/ui/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Toast from '@/components/ui/Toast';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  settings: NotificationSetting[];
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface NotificationPreferences {
  categories: NotificationCategory[];
  globalSettings: {
    masterEnabled: boolean;
    quietHours: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
    soundProfile: 'default' | 'vibrate' | 'silent';
    emailDigest: {
      enabled: boolean;
      frequency: 'daily' | 'weekly' | 'never';
    };
  };
}

const defaultPreferences: NotificationPreferences = {
  categories: [
    {
      id: 'reviews',
      title: 'Avaliações e Comentários',
      description: 'Notificações sobre as suas avaliações e respostas',
      icon: Star,
      color: '#FFA500',
      settings: [
        {
          id: 'review-helpful',
          title: 'Avaliação marcada como útil',
          description: 'Quando alguém marca a sua avaliação como útil',
          enabled: true,
          pushEnabled: true,
          emailEnabled: false,
          soundEnabled: true,
          vibrationEnabled: true,
          priority: 'medium'
        },
        {
          id: 'review-reply',
          title: 'Resposta à avaliação',
          description: 'Quando alguém responde à sua avaliação',
          enabled: true,
          pushEnabled: true,
          emailEnabled: true,
          soundEnabled: true,
          vibrationEnabled: true,
          priority: 'high'
        },
        {
          id: 'review-mention',
          title: 'Menção em avaliação',
          description: 'Quando alguém o menciona numa avaliação',
          enabled: true,
          pushEnabled: true,
          emailEnabled: false,
          soundEnabled: true,
          vibrationEnabled: false,
          priority: 'medium'
        }
      ]
    },
    {
      id: 'restaurants',
      title: 'Restaurantes',
      description: 'Atualizações sobre restaurantes e promoções',
      icon: MapPin,
      color: '#FF6B35',
      settings: [
        {
          id: 'new-restaurant',
          title: 'Novo restaurante próximo',
          description: 'Quando um novo restaurante é adicionado perto de si',
          enabled: true,
          pushEnabled: true,
          emailEnabled: false,
          soundEnabled: false,
          vibrationEnabled: false,
          priority: 'low'
        },
        {
          id: 'restaurant-promotion',
          title: 'Promoções especiais',
          description: 'Ofertas e promoções dos seus restaurantes favoritos',
          enabled: true,
          pushEnabled: true,
          emailEnabled: true,
          soundEnabled: false,
          vibrationEnabled: false,
          priority: 'medium'
        },
        {
          id: 'favorite-restaurant-update',
          title: 'Atualizações dos favoritos',
          description: 'Quando os seus restaurantes favoritos têm novidades',
          enabled: true,
          pushEnabled: true,
          emailEnabled: false,
          soundEnabled: false,
          vibrationEnabled: false,
          priority: 'low'
        }
      ]
    },
    {
      id: 'recommendations',
      title: 'Recomendações',
      description: 'Sugestões personalizadas baseadas nos seus gostos',
      icon: TrendingUp,
      color: '#8B5CF6',
      settings: [
        {
          id: 'weekly-recommendations',
          title: 'Recomendações semanais',
          description: 'Sugestões de restaurantes baseadas no seu histórico',
          enabled: true,
          pushEnabled: false,
          emailEnabled: true,
          soundEnabled: false,
          vibrationEnabled: false,
          priority: 'low'
        },
        {
          id: 'similar-taste',
          title: 'Utilizadores com gostos similares',
          description: 'Quando encontramos utilizadores com preferências parecidas',
          enabled: false,
          pushEnabled: false,
          emailEnabled: true,
          soundEnabled: false,
          vibrationEnabled: false,
          priority: 'low'
        },
        {
          id: 'cuisine-recommendations',
          title: 'Novas culinárias',
          description: 'Sugestões de culinárias que ainda não experimentou',
          enabled: true,
          pushEnabled: false,
          emailEnabled: true,
          soundEnabled: false,
          vibrationEnabled: false,
          priority: 'low'
        }
      ]
    },
    {
      id: 'system',
      title: 'Sistema',
      description: 'Atualizações da aplicação e avisos importantes',
      icon: Settings,
      color: '#6B7280',
      settings: [
        {
          id: 'app-updates',
          title: 'Atualizações da aplicação',
          description: 'Quando há novas funcionalidades disponíveis',
          enabled: true,
          pushEnabled: true,
          emailEnabled: false,
          soundEnabled: false,
          vibrationEnabled: false,
          priority: 'medium'
        },
        {
          id: 'security-alerts',
          title: 'Alertas de segurança',
          description: 'Avisos importantes sobre a sua conta',
          enabled: true,
          pushEnabled: true,
          emailEnabled: true,
          soundEnabled: true,
          vibrationEnabled: true,
          priority: 'high'
        },
        {
          id: 'maintenance',
          title: 'Manutenção programada',
          description: 'Avisos sobre manutenção da aplicação',
          enabled: true,
          pushEnabled: true,
          emailEnabled: true,
          soundEnabled: false,
          vibrationEnabled: false,
          priority: 'medium'
        }
      ]
    }
  ],
  globalSettings: {
    masterEnabled: true,
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    },
    soundProfile: 'default',
    emailDigest: {
      enabled: true,
      frequency: 'weekly'
    }
  }
};

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      // Simulate loading from storage/API
      await new Promise(resolve => setTimeout(resolve, 800));
      // In a real app, you would load from AsyncStorage or API
      setPreferences(defaultPreferences);
    } catch (error) {
      showToast('Erro ao carregar preferências', 'error');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      // Simulate saving to storage/API
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you would save to AsyncStorage or API
      showToast('Preferências guardadas com sucesso', 'success');
    } catch (error) {
      showToast('Erro ao guardar preferências', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleMasterNotifications = (enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        masterEnabled: enabled
      }
    }));
  };

  const toggleCategorySetting = (categoryId: string, settingId: string, field: keyof NotificationSetting, value: any) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.map(category =>
        category.id === categoryId
          ? {
            ...category,
            settings: category.settings.map(setting =>
              setting.id === settingId
                ? { ...setting, [field]: value }
                : setting
            )
          }
          : category
      )
    }));
  };

  const toggleQuietHours = (enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        quietHours: {
          ...prev.globalSettings.quietHours,
          enabled
        }
      }
    }));
  };

  const setSoundProfile = (profile: 'default' | 'vibrate' | 'silent') => {
    setPreferences(prev => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        soundProfile: profile
      }
    }));
  };

  const setEmailDigestFrequency = (frequency: 'daily' | 'weekly' | 'never') => {
    setPreferences(prev => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        emailDigest: {
          ...prev.globalSettings.emailDigest,
          frequency
        }
      }
    }));
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Repor Predefinições',
      'Tem certeza que deseja repor todas as preferências de notificação para os valores predefinidos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Repor',
          style: 'destructive',
          onPress: () => {
            setPreferences(defaultPreferences);
            showToast('Preferências repostas para predefinições', 'success');
          }
        }
      ]
    );
  };

  const renderGlobalSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Configurações Gerais</Text>

      {/* Master Toggle */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <View style={styles.settingHeader}>
            <Bell size={20} color={preferences.globalSettings.masterEnabled ? '#10B981' : '#9CA3AF'} />
            <Text style={styles.settingTitle}>Notificações Ativas</Text>
          </View>
          <Text style={styles.settingDescription}>
            Ativar ou desativar todas as notificações
          </Text>
        </View>
        <Switch
          value={preferences.globalSettings.masterEnabled}
          onValueChange={toggleMasterNotifications}
          trackColor={{ false: '#E5E7EB', true: '#10B981' }}
          thumbColor={preferences.globalSettings.masterEnabled ? '#FFFFFF' : '#FFFFFF'}
        />
      </View>

      {/* Email Digest */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <View style={styles.settingHeader}>
            <Mail size={20} color={preferences.globalSettings.emailDigest.enabled ? '#3B82F6' : '#9CA3AF'} />
            <Text style={styles.settingTitle}>Resumo por Email</Text>
          </View>
          <Text style={styles.settingDescription}>
            Receber resumo das atividades por email
          </Text>
        </View>
      </View>

      <View style={styles.emailDigestOptions}>
        {[
          { key: 'daily', label: 'Diário' },
          { key: 'weekly', label: 'Semanal' },
          { key: 'never', label: 'Nunca' }
        ].map((option) => {
          const isSelected = preferences.globalSettings.emailDigest.frequency === option.key;

          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.emailDigestOption,
                isSelected && styles.emailDigestOptionSelected
              ]}
              onPress={() => setEmailDigestFrequency(option.key as any)}
            >
              <Text style={[
                styles.emailDigestOptionText,
                isSelected && styles.emailDigestOptionTextSelected
              ]}>
                {option.label}
              </Text>
              {isSelected && (
                <Check size={16} color="#FF6B35" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderCategorySettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categorias de Notificação</Text>
      <Text style={styles.sectionSubtitle}>
        Configure notificações específicas para cada tipo de atividade
      </Text>

      {preferences.categories.map((category) => {
        const IconComponent = category.icon;
        const isExpanded = expandedCategory === category.id;
        const enabledCount = category.settings.filter(s => s.enabled).length;

        return (
          <View key={category.id} style={styles.categoryCard}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => setExpandedCategory(isExpanded ? null : category.id)}
            >
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <IconComponent size={20} color={category.color} />
                </View>
                <View style={styles.categoryDetails}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                  <Text style={styles.categoryStatus}>
                    {enabledCount} de {category.settings.length} ativas
                  </Text>
                </View>
              </View>
              <View style={styles.categoryMeta}>
                {enabledCount > 0 && (
                  <Badge
                    text={enabledCount.toString()}
                    variant="success"
                    size="small"
                    style={styles.categoryBadge}
                  />
                )}
                <View style={[
                  styles.expandIcon,
                  isExpanded && styles.expandIconRotated
                ]}>
                  <Text style={styles.expandIconText}>▼</Text>
                </View>
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.categorySettings}>
                {category.settings.map((setting) => (
                  <View key={setting.id} style={styles.notificationSetting}>
                    <View style={styles.notificationSettingHeader}>
                      <View style={styles.notificationSettingInfo}>
                        <Text style={styles.notificationSettingTitle}>{setting.title}</Text>
                        <Text style={styles.notificationSettingDescription}>
                          {setting.description}
                        </Text>
                        <View style={styles.priorityBadge}>
                          <Badge
                            text={
                              setting.priority === 'high' ? 'Alta' :
                                setting.priority === 'medium' ? 'Média' : 'Baixa'
                            }
                            variant={
                              setting.priority === 'high' ? 'error' :
                                setting.priority === 'medium' ? 'warning' : 'secondary'
                            }
                            size="small"
                          />
                        </View>
                      </View>
                      <Switch
                        value={setting.enabled}
                        onValueChange={(value) => toggleCategorySetting(category.id, setting.id, 'enabled', value)}
                        trackColor={{ false: '#E5E7EB', true: category.color }}
                        thumbColor="#FFFFFF"
                        disabled={!preferences.globalSettings.masterEnabled}
                      />
                    </View>

                    {setting.enabled && (
                      <View style={styles.notificationChannels}>
                        <Text style={styles.channelsTitle}>Canais de Notificação:</Text>
                        <View style={styles.channelsList}>
                          <TouchableOpacity
                            style={[
                              styles.channelOption,
                              setting.pushEnabled && styles.channelOptionActive
                            ]}
                            onPress={() => toggleCategorySetting(category.id, setting.id, 'pushEnabled', !setting.pushEnabled)}
                          >
                            <Smartphone size={16} color={setting.pushEnabled ? '#FFFFFF' : '#6B7280'} />
                            <Text style={[
                              styles.channelOptionText,
                              setting.pushEnabled && styles.channelOptionTextActive
                            ]}>
                              Push
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.channelOption,
                              setting.emailEnabled && styles.channelOptionActive
                            ]}
                            onPress={() => toggleCategorySetting(category.id, setting.id, 'emailEnabled', !setting.emailEnabled)}
                          >
                            <Mail size={16} color={setting.emailEnabled ? '#FFFFFF' : '#6B7280'} />
                            <Text style={[
                              styles.channelOptionText,
                              setting.emailEnabled && styles.channelOptionTextActive
                            ]}>
                              Email
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.channelOption,
                              setting.soundEnabled && styles.channelOptionActive
                            ]}
                            onPress={() => toggleCategorySetting(category.id, setting.id, 'soundEnabled', !setting.soundEnabled)}
                          >
                            <Volume2 size={16} color={setting.soundEnabled ? '#FFFFFF' : '#6B7280'} />
                            <Text style={[
                              styles.channelOptionText,
                              setting.soundEnabled && styles.channelOptionTextActive
                            ]}>
                              Som
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.channelOption,
                              setting.vibrationEnabled && styles.channelOptionActive
                            ]}
                            onPress={() => toggleCategorySetting(category.id, setting.id, 'vibrationEnabled', !setting.vibrationEnabled)}
                          >
                            <Smartphone size={16} color={setting.vibrationEnabled ? '#FFFFFF' : '#6B7280'} />
                            <Text style={[
                              styles.channelOptionText,
                              setting.vibrationEnabled && styles.channelOptionTextActive
                            ]}>
                              Vibração
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );

  if (loading) {
    return (
      <ScreenLayout>
        <Header title="Preferências de Notificação" showBackButton />
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={40} color="#FF6B35" />
          <Text style={styles.loadingText}>Carregando preferências...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      <Header title="Preferências de Notificação" showBackButton />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Global Settings */}
        {renderGlobalSettings()}

        {/* Category Settings */}
        {renderCategorySettings()}

        {/* Reset Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opções Avançadas</Text>

          <TouchableOpacity style={styles.resetButton} onPress={resetToDefaults}>
            <Settings size={20} color="#6B7280" />
            <Text style={styles.resetButtonText}>Repor Predefinições</Text>
          </TouchableOpacity>

          <Text style={styles.resetDescription}>
            Isto irá repor todas as preferências de notificação para os valores predefinidos.
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={savePreferences}
          disabled={saving}
        >
          {saving ? (
            <LoadingSpinner size={20} color="white" />
          ) : (
            <>
              <Check size={20} color="white" />
              <Text style={styles.saveButtonText}>Guardar Preferências</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 12,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 32,
    lineHeight: 20,
  },
  soundProfileOptions: {
    marginTop: 12,
    gap: 8,
  },
  soundProfileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  soundProfileOptionSelected: {
    backgroundColor: '#FFF7F5',
    borderColor: '#FF6B35',
  },
  soundProfileOptionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  soundProfileOptionTextSelected: {
    color: '#FF6B35',
  },
  emailDigestOptions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  emailDigestOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emailDigestOptionSelected: {
    backgroundColor: '#FFF7F5',
    borderColor: '#FF6B35',
  },
  emailDigestOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 6,
  },
  emailDigestOptionTextSelected: {
    color: '#FF6B35',
  },
  categoryCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  categoryInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  categoryStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    marginRight: 0,
  },
  expandIcon: {
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  expandIconText: {
    fontSize: 12,
    color: '#6B7280',
  },
  categorySettings: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  notificationSetting: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationSettingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  notificationSettingInfo: {
    flex: 1,
  },
  notificationSettingTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  notificationSettingDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
  },
  notificationChannels: {
    marginTop: 8,
  },
  channelsTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  channelsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  channelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  channelOptionActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  channelOptionText: {
    marginLeft: 6,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  channelOptionTextActive: {
    color: '#FFFFFF',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  resetButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  resetDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 20,
  },
  saveContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
});