import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Home,
  Loader,
  Menu,
  Play,
  Power,
  RefreshCw,
  RotateCcw,
  Settings,
  SkipBack,
  SkipForward,
  Tv,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff
} from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { DiscoveredDevice, useNsdDiscovery } from '../../hooks/useNsdDiscovery'
import { AndroidTVRemote } from '../../services/AndroidTVRemote'

const Remote = () => {
  const [connected, setConnected] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [lastAction, setLastAction] = useState('')
  const remoteRef = useRef<AndroidTVRemote | null>(null)
  
  const { devices, isDiscovering, error, startDiscovery, stopDiscovery } = useNsdDiscovery()

  useEffect(() => {
    // Start discovery when component mounts
    startDiscovery()
    
    return () => {
      stopDiscovery()
    }
  }, [startDiscovery, stopDiscovery])

  const handleConnect = async (device: DiscoveredDevice) => {
    try {
      const remote = new AndroidTVRemote(device.host, device.port)
      await remote.connect()
      remoteRef.current = remote
      setConnected(true)
      setSelectedDevice(device.serviceName)
      setLastAction('Connected to TV')
      Alert.alert('Success', `Connected to ${device.serviceName}`)
    } catch (error) {
      Alert.alert('Connection Failed', 'Could not connect to TV. Make sure the TV is on and accessible.')
      console.error('Connection error:', error)
    }
  }

  const handleDisconnect = () => {
    if (remoteRef.current) {
      remoteRef.current.disconnect()
      remoteRef.current = null
    }
    setConnected(false)
    setSelectedDevice('')
    setLastAction('Disconnected')
  }

  const handlePress = async (action: string, remoteMethod?: () => Promise<void>) => {
    console.log(`Button pressed: ${action}`)
    setLastAction(action)
    
    if (remoteMethod && remoteRef.current && connected) {
      try {
        await remoteMethod()
      } catch (error) {
        console.error('Error sending command:', error)
        Alert.alert('Error', 'Failed to send command to TV')
      }
    }
  }

  const RemoteButton = ({ 
    onPress, 
    icon: Icon, 
    size = 'md',
    variant = 'default',
    disabled = false
  }: { 
    onPress: () => void
    icon: any
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'primary' | 'danger'
    disabled?: boolean
  }) => {
    const sizeClasses = {
      sm: 'w-12 h-12',
      md: 'w-16 h-16',
      lg: 'w-20 h-20'
    }
    
    const variantClasses = {
      default: 'bg-amoled-gray-200 active:bg-amoled-gray-300',
      primary: 'bg-amoled-gray-300 active:bg-amoled-gray-400',
      danger: 'bg-red-900/30 active:bg-red-900/50'
    }

    const disabledClass = disabled ? 'opacity-30' : ''

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`${sizeClasses[size]} ${variantClasses[variant]} ${disabledClass} rounded-full items-center justify-center`}
        activeOpacity={0.7}
      >
        <Icon size={size === 'sm' ? 20 : size === 'md' ? 24 : 28} color="#FFFFFF" />
      </TouchableOpacity>
    )
  }

  if (!connected) {
    return (
      <View className="flex-1 bg-amoled-black px-6 py-8">
        <View className="items-center mb-8">
          <Tv size={64} color="#FFFFFF" className="mb-4" />
          <Text className="text-amoled-white text-2xl font-bold mb-2">Select Your TV</Text>
          <Text className="text-amoled-gray-400 text-center mb-4">
            Discovering Android TVs on your network
          </Text>
          
          <TouchableOpacity
            onPress={startDiscovery}
            disabled={isDiscovering}
            className="flex-row items-center gap-2 px-4 py-2 bg-amoled-gray-200 rounded-lg"
            activeOpacity={0.7}
          >
            {isDiscovering ? (
              <Loader size={16} color="#FFFFFF" />
            ) : (
              <RefreshCw size={16} color="#FFFFFF" />
            )}
            <Text className="text-amoled-white text-sm">
              {isDiscovering ? 'Searching...' : 'Refresh'}
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View className="mb-4 p-4 bg-red-900/30 rounded-lg">
            <Text className="text-red-400 text-sm">{error}</Text>
          </View>
        )}

        {isDiscovering && devices.length === 0 && (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text className="text-amoled-gray-400 text-sm mt-4">
              Looking for Android TVs...
            </Text>
          </View>
        )}

        {!isDiscovering && devices.length === 0 && (
          <View className="items-center py-8">
            <WifiOff size={48} color="#4A4A4A" />
            <Text className="text-amoled-gray-400 text-sm mt-4 text-center">
              No Android TVs found{'\n'}
              Make sure your TV is on and connected to the same network
            </Text>
          </View>
        )}

        <FlatList
          data={devices}
          keyExtractor={(item) => `${item.host}:${item.port}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleConnect(item)}
              className="bg-amoled-gray-200 active:bg-amoled-gray-300 p-4 rounded-lg mb-3"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3">
                <Tv size={24} color="#FFFFFF" />
                <View className="flex-1">
                  <Text className="text-amoled-white font-semibold text-base">
                    {item.serviceName}
                  </Text>
                  <Text className="text-amoled-gray-400 text-xs mt-1">
                    {item.host}:{item.port}
                  </Text>
                </View>
                <ChevronRight size={20} color="#4A4A4A" />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={null}
        />

        <View className="mt-8 p-4 bg-amoled-gray-100 rounded-lg">
          <Text className="text-amoled-white text-sm font-semibold mb-2">Troubleshooting:</Text>
          <Text className="text-amoled-gray-400 text-xs">
            • Ensure your phone and TV are on the same WiFi network{'\n'}
            • Check that your TV supports remote control apps{'\n'}
            • Try restarting your TV and phone{'\n'}
            • Make sure no firewall is blocking the connection
          </Text>
        </View>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-amoled-black">
      <View className="flex-1 items-center px-6 py-8">
        {/* Header with Connection Status */}
        <View className="flex-row items-center gap-2 mb-2">
          <Wifi size={20} color="#4ADE80" />
          <Text className="text-amoled-white text-xl font-bold">Connected</Text>
        </View>
        <Text className="text-amoled-gray-400 text-sm mb-4">{selectedDevice}</Text>
        
        <TouchableOpacity
          onPress={handleDisconnect}
          className="mb-4 px-4 py-2 bg-amoled-gray-200 rounded-lg"
          activeOpacity={0.7}
        >
          <Text className="text-amoled-white text-xs">Disconnect</Text>
        </TouchableOpacity>

        {/* Last Action Indicator */}
        {lastAction && (
          <View className="mb-6 px-4 py-2 bg-amoled-gray-200 rounded-lg">
            <Text className="text-amoled-white text-sm">Last: {lastAction}</Text>
          </View>
        )}

        {/* Power Button */}
        <View className="mb-8">
          <RemoteButton 
            onPress={() => handlePress('Power', () => remoteRef.current!.power())}
            icon={Power}
            size="lg"
            variant="danger"
          />
        </View>

        {/* Quick Action Buttons */}
        <View className="flex-row gap-4 mb-8">
          <RemoteButton 
            onPress={() => handlePress('Back', () => remoteRef.current!.back())}
            icon={RotateCcw}
            size="md"
          />
          <RemoteButton 
            onPress={() => handlePress('Home', () => remoteRef.current!.home())}
            icon={Home}
            size="md"
            variant="primary"
          />
          <RemoteButton 
            onPress={() => handlePress('Menu', () => remoteRef.current!.menu())}
            icon={Menu}
            size="md"
          />
        </View>

        {/* Volume Controls */}
        <View className="w-full mb-8">
          <Text className="text-amoled-white text-sm font-semibold mb-3 text-center">Volume</Text>
          <View className="flex-row justify-center gap-6">
            <RemoteButton 
              onPress={() => handlePress('Volume Down', () => remoteRef.current!.volumeDown())}
              icon={VolumeX}
              size="md"
            />
            <RemoteButton 
              onPress={() => handlePress('Mute', () => remoteRef.current!.volumeMute())}
              icon={Volume2}
              size="md"
            />
            <RemoteButton 
              onPress={() => handlePress('Volume Up', () => remoteRef.current!.volumeUp())}
              icon={Volume2}
              size="md"
            />
          </View>
        </View>

        {/* Media Controls */}
        <View className="w-full mb-8">
          <Text className="text-amoled-white text-sm font-semibold mb-3 text-center">Media</Text>
          <View className="flex-row justify-center gap-4">
            <RemoteButton 
              onPress={() => handlePress('Previous', () => remoteRef.current!.previous())}
              icon={SkipBack}
              size="sm"
            />
            <RemoteButton 
              onPress={() => handlePress('Play/Pause', () => remoteRef.current!.playPause())}
              icon={Play}
              size="md"
              variant="primary"
            />
            <RemoteButton 
              onPress={() => handlePress('Next', () => remoteRef.current!.next())}
              icon={SkipForward}
              size="sm"
            />
          </View>
        </View>

        {/* Settings */}
        <View className="mb-8">
          <RemoteButton 
            onPress={() => handlePress('Settings')}
            icon={Settings}
            size="md"
          />
        </View>

        {/* D-Pad Navigation */}
        <View className="mb-4 items-center">
          <View className="items-center mb-2">
            <RemoteButton 
              onPress={() => handlePress('Up', () => remoteRef.current!.up())}
              icon={ChevronUp}
              size="md"
            />
          </View>
          
          <View className="flex-row items-center gap-4 mb-2">
            <RemoteButton 
              onPress={() => handlePress('Left', () => remoteRef.current!.left())}
              icon={ChevronLeft}
              size="md"
            />
            <TouchableOpacity
              onPress={() => handlePress('Select', () => remoteRef.current!.select())}
              className="w-16 h-16 bg-amoled-gray-300 active:bg-amoled-gray-400 rounded-full items-center justify-center"
              activeOpacity={0.7}
            >
              <Circle size={32} color="#FFFFFF" fill="#FFFFFF" />
            </TouchableOpacity>
            <RemoteButton 
              onPress={() => handlePress('Right', () => remoteRef.current!.right())}
              icon={ChevronRight}
              size="md"
            />
          </View>
          
          <View className="items-center">
            <RemoteButton 
              onPress={() => handlePress('Down', () => remoteRef.current!.down())}
              icon={ChevronDown}
              size="md"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Remote
