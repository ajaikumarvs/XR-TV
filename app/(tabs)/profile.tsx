import { Info, Settings, Wifi } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'

export default function Profile() {
  return (
    <ScrollView className="flex-1 bg-amoled-black">
      <View className="flex-1 px-6 py-8">
        <Text className="text-amoled-white text-2xl font-bold mb-8">Settings</Text>

        <View className="mb-6">
          <View className="flex-row items-center gap-3 mb-4">
            <Wifi size={24} color="#FFFFFF" />
            <Text className="text-amoled-white text-lg font-semibold">Network</Text>
          </View>
          <Text className="text-amoled-gray-400 text-sm">
            Ensure your phone and Android TV are connected to the same WiFi network for discovery to work.
          </Text>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center gap-3 mb-4">
            <Settings size={24} color="#FFFFFF" />
            <Text className="text-amoled-white text-lg font-semibold">About</Text>
          </View>
          <Text className="text-amoled-gray-400 text-sm mb-2">
            XR-TV Remote Control
          </Text>
          <Text className="text-amoled-gray-400 text-sm mb-2">
            Version 1.0.0
          </Text>
          <Text className="text-amoled-gray-400 text-sm">
            Control your Android TV over WiFi without ADB privileges.
          </Text>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center gap-3 mb-4">
            <Info size={24} color="#FFFFFF" />
            <Text className="text-amoled-white text-lg font-semibold">Features</Text>
          </View>
          <Text className="text-amoled-gray-400 text-sm mb-2">
            • Automatic TV discovery using NSD
          </Text>
          <Text className="text-amoled-gray-400 text-sm mb-2">
            • D-pad navigation control
          </Text>
          <Text className="text-amoled-gray-400 text-sm mb-2">
            • Volume and media controls
          </Text>
          <Text className="text-amoled-gray-400 text-sm mb-2">
            • AMOLED-optimized dark theme
          </Text>
          <Text className="text-amoled-gray-400 text-sm">
            • No ADB or root required
          </Text>
        </View>

        <View className="mt-8 p-4 bg-amoled-gray-100 rounded-lg">
          <Text className="text-amoled-white text-sm font-semibold mb-2">
            Troubleshooting
          </Text>
          <Text className="text-amoled-gray-400 text-xs mb-2">
            If you cannot find your TV:
          </Text>
          <Text className="text-amoled-gray-400 text-xs mb-1">
            1. Check both devices are on the same WiFi
          </Text>
          <Text className="text-amoled-gray-400 text-xs mb-1">
            2. Restart your Android TV
          </Text>
          <Text className="text-amoled-gray-400 text-xs mb-1">
            3. Ensure no firewall is blocking mDNS
          </Text>
          <Text className="text-amoled-gray-400 text-xs">
            4. Try refreshing the device list
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}
