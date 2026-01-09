#!/bin/bash
# Build script for Clock Home Integration App - iPad TrollStore Compatible
# Requires: iOS project already prebuild with 'bunx expo prebuild --platform ios --clean'

echo "🚀 Building iPad-only TrollStore compatible IPA..."

# Clean previous builds
rm -rf build ios
mkdir -p build

# Generate iOS project with iPad configuration
echo "📱 Generating iOS project..."
bunx expo prebuild --platform ios --clean

# Build the archive (unsigned for TrollStore)
echo "🔨 Building archive..."
xcodebuild \
    -workspace ios/clockappformycrustyipad.xcworkspace \
    -scheme clockappformycrustyipad \
    -configuration Release \
    -destination "generic/platform=iOS" \
    -archivePath build/ClockApp.xcarchive \
    archive \
    CODE_SIGN_IDENTITY="" \
    CODE_SIGNING_REQUIRED=NO \
    CODE_SIGNING_ALLOWED=NO

# Create IPA package
echo "📦 Creating IPA..."
mkdir -p build/Payload
cp -r build/ClockApp.xcarchive/Products/Applications/clockappformycrustyipad.app build/Payload/
cd build
zip -r final.ipa Payload/
cd ..

# Copy to Desktop for easy access
cp build/ClockHomeIntegrationApp-iPad.ipa ~/Desktop/ 2>/dev/null || true
