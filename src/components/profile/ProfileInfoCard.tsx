
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ProfileInfo } from '@/hooks/useProfile';

type Row = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

type Props = {
  profile: ProfileInfo;
};

export default function ProfileInfoCard({ profile }: Props) {
  const rows: Row[] = [
    { icon: 'mail-outline', label: 'Email', value: profile.email ?? '—' },
    { icon: 'shield-checkmark-outline', label: 'Sign-in method', value: profile.providerLabel },
    ...(profile.address
      ? [{ icon: 'location-outline' as const, label: 'Address', value: profile.address }]
      : []),
    ...(profile.memberSince
      ? [{ icon: 'calendar-outline' as const, label: 'Member since', value: profile.memberSince }]
      : []),
  ];

  return (
    <View className="bg-white rounded-2xl mx-5 -mt-6 shadow-md shadow-black/10 overflow-hidden">
      {rows.map((row, index) => (
        <View
          key={row.label}
          className={`flex-row items-center px-4 py-4 gap-3 ${
            index !== rows.length - 1 ? 'border-b border-[#EEF1F6]' : ''
          }`}
        >
          <View className="w-9 h-9 rounded-full bg-[#F0F6F5] items-center justify-center">
            <Ionicons name={row.icon} size={17} color="#1E6E8C" />
          </View>
          <View className="flex-1">
            <Text className="text-[#9CA3AF] text-xs font-medium">{row.label}</Text>
            <Text className="text-[#111827] text-[15px] font-semibold mt-0.5">
              {row.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}