# XR-TV - Android TV Remote Control App

A React Native app for controlling Android TVs over WiFi without requiring ADB privileges. Built with Expo, NativeWind (Tailwind CSS), and native Android NSD (Network Service Discovery).

## Features

-  **Auto-Discovery**: Automatically finds Android TVs on your local network using NSD
-  **Phone Remote**: Control your Android TV from your phone
-  **AMOLED Theme**: Pure black theme optimized for OLED displays
-  **Full Control**: D-pad navigation, volume, media controls, and more
-  **No ADB Required**: Works over WiFi without special permissions

## Tech Stack

- **React Native** with Expo (ejected for custom native modules)
- **NativeWind** (Tailwind CSS for React Native)
- **Lucide React Native** for icons
- **Android NSD** for TV discovery (custom native module)
- **TCP Sockets** for TV communication

> **Note:** This project has been ejected from Expo to support custom native Android modules. The `android/` folder contains custom Kotlin code and should be tracked in version control. See [android/CUSTOM_NATIVE_CODE.md](android/CUSTOM_NATIVE_CODE.md) for details.

## How It Works

1. **Discovery**: Uses Android's NsdManager to discover devices advertising the `_androidtvremote2._tcp` service
2. **Connection**: Connects to the TV using TCP sockets on port 6466
3. **Control**: Sends key events to the TV using the Android TV Remote Protocol

## Setup

### Prerequisites

- Node.js 18+
- Android Studio
- Android device or emulator
- Android TV on the same WiFi network

### Installation

```bash
# Install dependencies
npm install

# Build Android app
cd android
./gradlew assembleDebug

# Install on device
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Development

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android
```

## Usage

1. **Connect to WiFi**: Ensure your phone and Android TV are on the same WiFi network
2. **Open App**: Launch XR-TV on your phone
3. **Select TV**: The app will automatically discover nearby Android TVs
4. **Control**: Tap a TV to connect and start controlling it

## Supported Controls

- **D-Pad**: Up, Down, Left, Right, Select
- **Navigation**: Home, Back, Menu
- **Volume**: Up, Down, Mute
- **Media**: Play/Pause, Next, Previous
- **Power**: Turn TV on/off

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── remote.tsx      # Main remote control UI
│   │   └── profile.tsx     # Profile/settings
│   └── _layout.tsx
├── android/
│   └── app/src/main/java/com/anonymous/XRTV/
│       ├── NsdModule.kt    # Native NSD discovery module
│       └── NsdPackage.kt   # Module registration
├── hooks/
│   └── useNsdDiscovery.ts  # React hook for NSD
├── services/
│   └── AndroidTVRemote.ts  # TV remote protocol implementation
└── tailwind.config.js      # AMOLED theme configuration
```

## Troubleshooting

### No TVs Found

- Ensure phone and TV are on the same WiFi network
- Check that your TV supports remote control apps
- Try restarting both devices
- Verify no firewall is blocking mDNS/Bonjour traffic

### Connection Failed

- Make sure the TV is powered on
- Check that port 6466 is not blocked
- Try connecting to the TV's IP address manually
- Restart the TV's remote control service

### Build Errors

```bash
# Clean build
cd android
./gradlew clean
./gradlew assembleDebug
```

## Android TV Remote Protocol

This app uses the Android TV Remote Service protocol, which:
- Runs on port 6466
- Uses TCP for communication
- Requires devices to be on the same local network
- Supports standard Android key events
