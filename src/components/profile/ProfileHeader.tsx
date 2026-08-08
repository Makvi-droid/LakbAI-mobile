import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { ProfileInfo } from '@/hooks/useProfile';

type Props = {
  profile: ProfileInfo;
};

export default function ProfileHeader({ profile }: Props) {
  const { fullName, email, initials, avatarUrl, provider, providerLabel } = profile;

  return (
   
    <View className="rounded-b-[32px] overflow-hidden">
      <LinearGradient
        colors={['#0B3D5C', '#1E6E8C', '#3FA9A0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
     
      <View className="pt-14 pb-16 px-6 items-center">
        <View className="relative">
          <View className="w-24 h-24 rounded-full bg-white items-center justify-center shadow-lg shadow-black/20">
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="w-[88px] h-[88px] rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-[#0B3D5C] text-3xl font-extrabold">{initials}</Text>
            )}
          </View>

          {/* Provider badge, bottom-right of avatar */}
          <View className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white items-center justify-center shadow-md shadow-black/20">
            <View className="w-7 h-7 rounded-full bg-[#16233F] items-center justify-center">
              {provider === 'google' ? (
                <Text className="text-white text-[13px] font-bold">G</Text>
              ) : (
                <Ionicons name="mail" size={14} color="#FFFFFF" />
              )}
            </View>
          </View>
        </View>

        <Text className="text-white text-xl font-extrabold mt-4">
          {fullName ?? 'Traveler'}
        </Text>
        {email ? (
          <Text className="text-white/80 text-sm mt-1">{email}</Text>
        ) : null}

        <View className="flex-row items-center bg-white/15 px-3 py-1.5 rounded-full mt-3 gap-1.5">
          <Ionicons
            name={provider === 'google' ? 'logo-google' : 'lock-closed'}
            size={12}
            color="#FFFFFF"
          />
          <Text className="text-white text-xs font-semibold">{providerLabel}</Text>
        </View>
      </View>
    </View>
  );
}