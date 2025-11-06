import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Home,
  Menu,
  Play,
  Power,
  RotateCcw,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX
} from 'lucide-react-native'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

const remote = () => {
  const handlePress = (action: string) => {
    console.log(`Button pressed: ${action}`)
    // TODO: Implement @cldmv/node-android-tv-remote integration
  }

  const RemoteButton = ({ 
    onPress, 
    icon: Icon, 
    label, 
    size = 'md',
    variant = 'default' 
  }: { 
    onPress: () => void
    icon: any
    label: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'primary' | 'danger'
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

    return (
      <TouchableOpacity
        onPress={onPress}
        className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full items-center justify-center`}
        activeOpacity={0.7}
      >
        <Icon size={size === 'sm' ? 20 : size === 'md' ? 24 : 28} color="#FFFFFF" />
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView className="flex-1 bg-amoled-black">
      <View className="flex-1 items-center px-6 py-8">
        {/* Header */}
        <Text className="text-amoled-white text-2xl font-bold mb-8">TV Remote</Text>

        {/* Power Button */}
        <View className="mb-8">
          <RemoteButton 
            onPress={() => handlePress('power')}
            icon={Power}
            label="Power"
            size="lg"
            variant="danger"
          />
        </View>

        {/* Quick Action Buttons */}
        <View className="flex-row gap-4 mb-8">
          <RemoteButton 
            onPress={() => handlePress('back')}
            icon={RotateCcw}
            label="Back"
            size="md"
          />
          <RemoteButton 
            onPress={() => handlePress('home')}
            icon={Home}
            label="Home"
            size="md"
            variant="primary"
          />
          <RemoteButton 
            onPress={() => handlePress('menu')}
            icon={Menu}
            label="Menu"
            size="md"
          />
        </View>

        {/* Volume Controls */}
        <View className="w-full mb-8">
          <Text className="text-amoled-white text-sm font-semibold mb-3 text-center">Volume</Text>
          <View className="flex-row justify-center gap-6">
            <RemoteButton 
              onPress={() => handlePress('volume-down')}
              icon={VolumeX}
              label="Volume Down"
              size="md"
            />
            <RemoteButton 
              onPress={() => handlePress('volume-mute')}
              icon={Volume2}
              label="Mute"
              size="md"
            />
            <RemoteButton 
              onPress={() => handlePress('volume-up')}
              icon={Volume2}
              label="Volume Up"
              size="md"
            />
          </View>
        </View>

        {/* Media Controls */}
        <View className="w-full mb-8">
          <Text className="text-amoled-white text-sm font-semibold mb-3 text-center">Media</Text>
          <View className="flex-row justify-center gap-4">
            <RemoteButton 
              onPress={() => handlePress('previous')}
              icon={SkipBack}
              label="Previous"
              size="sm"
            />
            <RemoteButton 
              onPress={() => handlePress('play-pause')}
              icon={Play}
              label="Play/Pause"
              size="md"
              variant="primary"
            />
            <RemoteButton 
              onPress={() => handlePress('next')}
              icon={SkipForward}
              label="Next"
              size="sm"
            />
          </View>
        </View>

        {/* Settings */}
        <View className="mb-8">
          <RemoteButton 
            onPress={() => handlePress('settings')}
            icon={Settings}
            label="Settings"
            size="md"
          />
        </View>

        {/* D-Pad Navigation */}
        <View className="mb-4 items-center">
          <View className="items-center mb-2">
            <RemoteButton 
              onPress={() => handlePress('up')}
              icon={ChevronUp}
              label="Up"
              size="md"
            />
          </View>
          
          <View className="flex-row items-center gap-4 mb-2">
            <RemoteButton 
              onPress={() => handlePress('left')}
              icon={ChevronLeft}
              label="Left"
              size="md"
            />
            <TouchableOpacity
              onPress={() => handlePress('select')}
              className="w-16 h-16 bg-amoled-gray-300 active:bg-amoled-gray-400 rounded-full items-center justify-center"
              activeOpacity={0.7}
            >
              <Circle size={32} color="#FFFFFF" fill="#FFFFFF" />
            </TouchableOpacity>
            <RemoteButton 
              onPress={() => handlePress('right')}
              icon={ChevronRight}
              label="Right"
              size="md"
            />
          </View>
          
          <View className="items-center">
            <RemoteButton 
              onPress={() => handlePress('down')}
              icon={ChevronDown}
              label="Down"
              size="md"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default remote