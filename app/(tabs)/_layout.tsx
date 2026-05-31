import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Text } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pie"
        options={{
           title: "",
          tabBarIcon: ({ color }) => <Fontisto name="bar-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ia"
        options={{
           title: "",
          tabBarIcon: ({ color }) => <Text style={{color: color, fontWeight: 'bold', fontSize: 24}}>IA</Text>,
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
           title: "",
          tabBarIcon: ({ color }) => 
          <FontAwesome6 name="sliders" size={24}  color={color} />
          ,
        }}
      />
    </Tabs>
  );
}
