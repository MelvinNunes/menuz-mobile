import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  CircleHelp as HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Star,
  Shield,
  CreditCard,
  Users,
  MapPin,
  Settings,
  Bug,
  Lightbulb
} from 'lucide-react-native';
import ScreenLayout from '@/components/layouts/ScreenLayout';
import Header from '@/components/ui/Header';
import Badge from '@/components/ui/Badge';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  popular?: boolean;
}

interface SupportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  items: FAQItem[];
}

const supportCategories: SupportCategory[] = [
  {
    id: 'account',
    title: 'Conta e Perfil',
    description: 'Gestão da conta, perfil e configurações',
    icon: Users,
    color: '#3B82F6',
    items: [
      {
        id: 'account-1',
        question: 'Como posso alterar as informações do meu perfil?',
        answer: 'Vá ao seu perfil, toque no ícone de configurações no canto superior direito e selecione "Editar Perfil". Pode alterar o seu nome, foto, email e outras informações pessoais.',
        category: 'account',
        popular: true
      },
      {
        id: 'account-2',
        question: 'Como posso eliminar a minha conta?',
        answer: 'Para eliminar a sua conta, vá a Configurações > Privacidade e Conta > Eliminar Conta. Note que esta ação é irreversível e todos os seus dados serão permanentemente removidos.',
        category: 'account'
      },
      {
        id: 'account-3',
        question: 'Esqueci-me da minha senha. Como posso recuperá-la?',
        answer: 'Na tela de login, toque em "Esqueceu a senha?" e siga as instruções. Enviaremos um email com instruções para redefinir a sua senha.',
        category: 'account',
        popular: true
      }
    ]
  },
  {
    id: 'restaurants',
    title: 'Restaurantes e Avaliações',
    description: 'Informações sobre restaurantes, avaliações e favoritos',
    icon: Star,
    color: '#FF6B35',
    items: [
      {
        id: 'restaurants-1',
        question: 'Como posso adicionar um restaurante aos favoritos?',
        answer: 'Toque no ícone de coração na página do restaurante ou na lista de restaurantes. Os restaurantes favoritos aparecerão na aba "Favoritos".',
        category: 'restaurants',
        popular: true
      },
      {
        id: 'restaurants-2',
        question: 'Como posso escrever uma avaliação?',
        answer: 'Visite a página do restaurante e toque em "Escrever Avaliação". Pode dar uma classificação de 1 a 5 estrelas e escrever um comentário sobre a sua experiência.',
        category: 'restaurants',
        popular: true
      },
      {
        id: 'restaurants-3',
        question: 'Posso editar ou eliminar a minha avaliação?',
        answer: 'Sim! Vá a "Minhas Avaliações" no seu perfil, encontre a avaliação que deseja modificar e use os botões "Editar" ou "Eliminar".',
        category: 'restaurants'
      },
      {
        id: 'restaurants-4',
        question: 'Como posso sugerir um novo restaurante?',
        answer: 'Use o botão "Sugerir Restaurante" disponível em várias partes da aplicação. Preencha as informações do restaurante e a nossa equipa irá analisá-las.',
        category: 'restaurants'
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacidade e Segurança',
    description: 'Proteção de dados e configurações de privacidade',
    icon: Shield,
    color: '#8B5CF6',
    items: [
      {
        id: 'privacy-1',
        question: 'Como são protegidos os meus dados pessoais?',
        answer: 'Levamos a privacidade muito a sério. Os seus dados são encriptados e nunca partilhados com terceiros sem o seu consentimento. Consulte a nossa Política de Privacidade para mais detalhes.',
        category: 'privacy',
        popular: true
      },
      {
        id: 'privacy-2',
        question: 'Posso controlar quem vê as minhas avaliações?',
        answer: 'Todas as avaliações são públicas por defeito. No entanto, pode ajustar as configurações de privacidade nas definições da conta.',
        category: 'privacy'
      },
      {
        id: 'privacy-3',
        question: 'Como posso reportar conteúdo inadequado?',
        answer: 'Toque nos três pontos em qualquer post ou avaliação e selecione "Reportar". A nossa equipa irá analisar o conteúdo reportado.',
        category: 'privacy'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Problemas Técnicos',
    description: 'Resolução de problemas e bugs da aplicação',
    icon: Bug,
    color: '#EF4444',
    items: [
      {
        id: 'technical-1',
        question: 'A aplicação está lenta ou não responde. O que posso fazer?',
        answer: 'Tente fechar e reabrir a aplicação. Se o problema persistir, reinicie o dispositivo ou verifique se tem a versão mais recente da aplicação.',
        category: 'technical',
        popular: true
      },
      {
        id: 'technical-2',
        question: 'As fotos não estão a carregar. Como resolver?',
        answer: 'Verifique a sua ligação à internet. Se estiver usando dados móveis, certifique-se de que tem dados suficientes. Também pode tentar limpar a cache da aplicação.',
        category: 'technical'
      },
      {
        id: 'technical-3',
        question: 'Como posso reportar um bug?',
        answer: 'Use o formulário de contacto abaixo ou envie um email para suporte@tasteofmaputo.co.mz com detalhes do problema e screenshots se possível.',
        category: 'technical'
      }
    ]
  }
];

const contactMethods = [
  {
    id: 'email',
    title: 'Email',
    subtitle: 'suporte@tasteofmaputo.co.mz',
    description: 'Resposta em até 24 horas',
    icon: Mail,
    color: '#3B82F6',
    action: () => Linking.openURL('mailto:suporte@tasteofmaputo.co.mz')
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    subtitle: '+258 84 123 4567',
    description: 'Segunda a Sexta, 9h-17h',
    icon: MessageCircle,
    color: '#10B981',
    action: () => Linking.openURL('https://wa.me/258841234567')
  },
  {
    id: 'phone',
    title: 'Telefone',
    subtitle: '+258 21 123 456',
    description: 'Segunda a Sexta, 9h-17h',
    icon: Phone,
    color: '#FF6B35',
    action: () => Linking.openURL('tel:+258211234567')
  }
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleFAQToggle = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleContactMethod = (method: typeof contactMethods[0]) => {
    try {
      method.action();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir esta opção de contacto.');
    }
  };

  const getFilteredFAQs = () => {
    if (selectedCategory === 'all') {
      return supportCategories.flatMap(category => category.items);
    }
    if (selectedCategory === 'popular') {
      return supportCategories.flatMap(category => category.items).filter(item => item.popular);
    }
    const category = supportCategories.find(cat => cat.id === selectedCategory);
    return category ? category.items : [];
  };

  const renderCategoryFilter = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>Categorias</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedCategory === 'all' && styles.filterChipActive
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[
            styles.filterChipText,
            selectedCategory === 'all' && styles.filterChipTextActive
          ]}>
            Todas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedCategory === 'popular' && styles.filterChipActive
          ]}
          onPress={() => setSelectedCategory('popular')}
        >
          <Star size={16} color={selectedCategory === 'popular' ? 'white' : '#FF6B35'} />
          <Text style={[
            styles.filterChipText,
            selectedCategory === 'popular' && styles.filterChipTextActive
          ]}>
            Populares
          </Text>
        </TouchableOpacity>

        {supportCategories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterChip,
                isSelected && { backgroundColor: category.color }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <IconComponent
                size={16}
                color={isSelected ? 'white' : category.color}
              />
              <Text style={[
                styles.filterChipText,
                isSelected && styles.filterChipTextActive
              ]}>
                {category.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderFAQItem = (item: FAQItem) => {
    const isExpanded = expandedFAQ === item.id;
    const category = supportCategories.find(cat => cat.id === item.category);

    return (
      <View key={item.id} style={styles.faqItem}>
        <TouchableOpacity
          style={styles.faqQuestion}
          onPress={() => handleFAQToggle(item.id)}
        >
          <View style={styles.faqQuestionContent}>
            <Text style={styles.faqQuestionText}>{item.question}</Text>
            <View style={styles.faqQuestionMeta}>
              {item.popular && (
                <Badge text="Popular" variant="warning" size="small" />
              )}
              {category && (
                <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
                  <Text style={[styles.categoryBadgeText, { color: category.color }]}>
                    {category.title}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <ChevronDown
            size={20}
            color="#6B7280"
            style={[
              styles.chevron,
              isExpanded && styles.chevronExpanded
            ]}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.faqAnswer}>
            <Text style={styles.faqAnswerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderContactMethods = () => (
    <View style={styles.contactSection}>
      <Text style={styles.sectionTitle}>Entre em Contacto</Text>
      <Text style={styles.sectionSubtitle}>
        Não encontrou a resposta que procurava? A nossa equipa está aqui para ajudar!
      </Text>

      {contactMethods.map((method) => {
        const IconComponent = method.icon;

        return (
          <TouchableOpacity
            key={method.id}
            style={styles.contactMethod}
            onPress={() => handleContactMethod(method)}
          >
            <View style={[styles.contactIcon, { backgroundColor: method.color + '20' }]}>
              <IconComponent size={24} color={method.color} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>{method.title}</Text>
              <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
              <Text style={styles.contactDescription}>{method.description}</Text>
            </View>
            <ExternalLink size={20} color="#9CA3AF" />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderAppInfo = () => (
    <View style={styles.appInfoSection}>
      <Text style={styles.sectionTitle}>Informações da Aplicação</Text>

      <View style={styles.appInfoGrid}>
        <View style={styles.appInfoItem}>
          <Text style={styles.appInfoLabel}>Versão</Text>
          <Text style={styles.appInfoValue}>1.0.0</Text>
        </View>
        <View style={styles.appInfoItem}>
          <Text style={styles.appInfoLabel}>Última Atualização</Text>
          <Text style={styles.appInfoValue}>Janeiro 2024</Text>
        </View>
      </View>

      <View style={styles.legalLinks}>
        <TouchableOpacity style={styles.legalLink}>
          <Text style={styles.legalLinkText}>Termos de Serviço</Text>
          <ExternalLink size={16} color="#FF6B35" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.legalLink}>
          <Text style={styles.legalLinkText}>Política de Privacidade</Text>
          <ExternalLink size={16} color="#FF6B35" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.legalLink}>
          <Text style={styles.legalLinkText}>Sobre Nós</Text>
          <ExternalLink size={16} color="#FF6B35" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenLayout>
      <Header title="Ajuda e Suporte" showBackButton />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeIcon}>
            <HelpCircle size={32} color="#FF6B35" />
          </View>
          <Text style={styles.welcomeTitle}>Como podemos ajudar?</Text>
          <Text style={styles.welcomeSubtitle}>
            Encontre respostas rápidas para as suas dúvidas ou entre em contacto connosco
          </Text>
        </View>

        {/* Category Filter */}
        {renderCategoryFilter()}

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
          <Text style={styles.sectionSubtitle}>
            {getFilteredFAQs().length} pergunta{getFilteredFAQs().length !== 1 ? 's' : ''} encontrada{getFilteredFAQs().length !== 1 ? 's' : ''}
          </Text>

          <View style={styles.faqList}>
            {getFilteredFAQs().map(renderFAQItem)}
          </View>
        </View>

        {/* Contact Methods */}
        {renderContactMethods()}

        {/* App Info */}
        {renderAppInfo()}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  welcomeSection: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  quickActionsSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
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
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  filterSection: {
    backgroundColor: 'white',
    paddingVertical: 16,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 6,
  },
  filterChipTextActive: {
    color: 'white',
  },
  faqSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  faqList: {
    gap: 16,
  },
  faqItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  faqQuestionContent: {
    flex: 1,
  },
  faqQuestionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
    lineHeight: 22,
  },
  faqQuestionMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  chevron: {
    marginLeft: 12,
    marginTop: 2,
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: 'white',
  },
  faqAnswerText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
  },
  contactSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF6B35',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  appInfoSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 20,
  },
  appInfoGrid: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  appInfoItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  appInfoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  appInfoValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  legalLinks: {
    gap: 12,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  legalLinkText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF6B35',
  },
});