import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { createSessionFromUrl } from '@/lib/googleAuth';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const finish = async (url: string | null) => {
      try {
        if (!url) throw new Error('No callback URL received.');
        const session = await createSessionFromUrl(url);
        if (session) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/loginScreen');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        router.replace('/(auth)/loginScreen');
      }
    };

    if (Platform.OS === 'web') {
      // On web the whole tab navigated here, so the tokens are in the
      // current page's URL (hash or query, depending on flow type).
      finish(window.location.href);
    } else {
      // On native, expo-router mounted this screen because the OS
      // opened the app via the lakbaimobile:// / exp:// deep link.
      Linking.getInitialURL().then(finish);
    }
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1E6E8C" />
      <Text style={styles.text}>Finishing sign-in…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  text: { color: '#6B7280', fontSize: 14, marginTop: 4 },
});