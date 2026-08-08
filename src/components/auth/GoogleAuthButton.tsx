import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  label?: string;
  disabled?: boolean;
};

export default function GoogleAuthButton({ label = 'Continue with Google', disabled }: Props) {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    const { session, error } = await signInWithGoogle();
    setLoading(false);

    if (error) {
      Alert.alert('Google sign-in failed', error.message);
      return;
    }

    // Web: the tab already navigated to Google and back through
    // /auth-callback, which does its own router.replace — nothing to do
    // here (this code may not even run before the page unloads).
    //
    // Native: openAuthSessionAsync returns control directly to this
    // function with the session already set, so we navigate explicitly.
    if (Platform.OS !== 'web' && session) {
      router.replace('/(tabs)');
    }
  };

  return (
    <TouchableOpacity
      style={styles.googleButton}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#4285F4" />
      ) : (
        <>
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleButtonText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E5E9F0',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  googleIcon: { fontSize: 18, fontWeight: 'bold', color: '#4285F4' },
  googleButtonText: { color: '#374151', fontSize: 15, fontWeight: '600' },
});