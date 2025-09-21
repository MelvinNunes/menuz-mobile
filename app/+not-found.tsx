import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Chrome as Home } from 'lucide-react-native';
import { ScreenLayout, EmptyState } from '@/components';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ScreenLayout>
        <EmptyState
          icon={Home}
          title="Página não encontrada"
          subtitle="A página que procura não existe ou foi movida."
          buttonText="Voltar ao Início"
          onButtonPress={() => {}}
          iconColor="#FF6B35"
        />
        <Link href="/" asChild>
          <TouchableOpacity style={styles.hiddenButton}>
            <Text>Hidden Link</Text>
          </TouchableOpacity>
        </Link>
      </ScreenLayout>
    </>
  );
}

const styles = StyleSheet.create({
  hiddenButton: {
    position: 'absolute',
    opacity: 0,
  },
});