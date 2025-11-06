# Build Instructions

## Development Build (Requires Metro)

For development with hot reload:

```bash
npx expo run:android
```

This will:
1. Build the debug APK
2. Start Metro bundler
3. Install and run the app
4. Enable hot reload for development

**Note:** The debug APK requires Metro bundler to be running on your development machine. Your phone must be on the same network.

## Standalone Release Build (No Metro Required)

For a standalone APK that works without Metro:

### Step 1: Build the Release APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Step 2: Install on Device

```bash
adb install app/build/outputs/apk/release/app-release.apk
```

Or copy the APK to your phone and install it manually.

## Build Variants

### Debug Build
- **Command:** `./gradlew assembleDebug`
- **Output:** `app/build/outputs/apk/debug/app-debug.apk`
- **Requires:** Metro bundler running
- **Use for:** Development and testing

### Release Build
- **Command:** `./gradlew assembleRelease`
- **Output:** `app/build/outputs/apk/release/app-release.apk`
- **Requires:** Nothing (standalone)
- **Use for:** Distribution and production

## Troubleshooting

### "Unable to load script" Error

This happens when:
1. You installed a debug APK without Metro running
2. Your phone can't reach the Metro bundler

**Solutions:**
- Use `npx expo run:android` to run with Metro
- Build a release APK instead: `./gradlew assembleRelease`
- Ensure phone and computer are on the same WiFi network

### Build Errors

```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleRelease
```

### Signing Issues

The debug build uses a debug keystore automatically. For release builds, you may need to configure signing in `android/app/build.gradle`.

## Quick Commands

```bash
# Development with Metro
npx expo run:android

# Build release APK
cd android && ./gradlew assembleRelease

# Install release APK
adb install android/app/build/outputs/apk/release/app-release.apk

# Clean build
cd android && ./gradlew clean
```
