# Custom Native Android Code

This project has been ejected from Expo and contains custom native Android modules. These files should be tracked in version control.

## Custom Native Modules

### NsdModule.kt
**Location:** `app/src/main/java/com/anonymous/XRTV/NsdModule.kt`

Native module that implements Network Service Discovery (NSD) for finding Android TVs on the local network.

**Features:**
- Discovers devices advertising `_androidtvremote2._tcp` service
- Automatically resolves service info (IP address and port)
- Emits events to React Native for discovered/lost devices

**Events Emitted:**
- `onDiscoveryStarted` - Discovery has started
- `onServiceFound` - New device found
- `onServiceResolved` - Device IP/port resolved
- `onServiceLost` - Device no longer available
- `onDiscoveryStopped` - Discovery stopped
- `onStartDiscoveryFailed` - Discovery failed to start

### NsdPackage.kt
**Location:** `app/src/main/java/com/anonymous/XRTV/NsdPackage.kt`

React Native package that registers the NsdModule with the React Native bridge.

### MainActivity.kt
**Location:** `app/src/main/java/com/anonymous/XRTV/MainActivity.kt`

Main activity for the app. Standard Expo-generated file with no custom modifications.

### MainApplication.kt
**Location:** `app/src/main/java/com/anonymous/XRTV/MainApplication.kt`

Application class that registers our custom NsdPackage.

**Custom Changes:**
```kotlin
override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
      add(NsdPackage())  // <-- Custom package added here
    }
```

### AndroidManifest.xml
**Location:** `app/src/main/AndroidManifest.xml`

**Custom Permissions Added:**
- `android.permission.INTERNET` - For TCP socket communication
- `android.permission.ACCESS_NETWORK_STATE` - For network status
- `android.permission.ACCESS_WIFI_STATE` - For WiFi network info

## Build Configuration

### build.gradle (app level)
Standard Expo configuration, no custom changes needed.

### build.gradle (project level)
Standard Expo configuration, no custom changes needed.

## Rebuilding After Changes

If you modify any native code:

```bash
# Clean build
cd android
./gradlew clean

# Rebuild
./gradlew assembleDebug

# Or use Expo
cd ..
npx expo run:android
```

## Testing Native Modules

To test the NSD module:

1. Ensure your phone and Android TV are on the same WiFi network
2. Run the app: `npx expo run:android`
3. The app should automatically discover nearby Android TVs
4. Check logs: `adb logcat | grep NsdModule`

## Troubleshooting

### NSD Not Finding Devices
- Verify both devices are on the same network
- Check that mDNS/Bonjour is not blocked by firewall
- Ensure Android TV remote service is enabled

### Build Errors
- Run `./gradlew clean` in the android folder
- Delete `node_modules` and reinstall: `npm install`
- Run `npx expo prebuild --clean` to regenerate native folders

### Module Not Found
- Verify `NsdPackage()` is added in `MainApplication.kt`
- Check that the package name matches: `com.anonymous.XRTV`
- Rebuild the app completely
