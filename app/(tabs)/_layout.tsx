import { Tabs } from 'expo-router'
import { Radio, User } from 'lucide-react-native'
import React from 'react'

const _layout = () => {
  return (
   <Tabs
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#000000',
        borderTopColor: '#1A1A1A',
        borderTopWidth: 1,
      },
      tabBarActiveTintColor: '#FFFFFF',
      tabBarInactiveTintColor: '#4A4A4A',
    }}
   >
    <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />
        }}>
    </Tabs.Screen>
    <Tabs.Screen
        name="remote"
        options={{
          title: 'Remote',
          tabBarIcon: ({ color, size }) => <Radio size={size} color={color} />
        }}>
    </Tabs.Screen>
   </Tabs>
  )
}

export default _layout