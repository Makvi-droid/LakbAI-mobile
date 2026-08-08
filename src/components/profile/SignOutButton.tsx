import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function SignOutButton() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          const { error } = await signOut();
          setLoading(false);

          if (error) {
            Alert.alert('Sign out failed', error.message);
            return;
          }
          router.replace('/(auth)/loginScreen');
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      disabled={loading}
      activeOpacity={0.85}
      className="flex-row items-center justify-center gap-2 bg-white border-[1.5px] border-[#FDE2DA] rounded-2xl mx-5 mt-5 py-4"
    >
      {loading ? (
        <ActivityIndicator color="#FF7A45" />
      ) : (
        <>
          <Ionicons name="log-out-outline" size={18} color="#FF3B30" />
          <Text className="text-[#FF3B30] text-[15px] font-bold">Sign out</Text>
        </>
      )}
    </TouchableOpacity>
  );
}