#!/bin/bash

# Build script for RKH's Photo Order Management System
# Supports Windows, macOS, and Linux builds with Citrix optimization

set -e  # Exit on any error

echo "🚀 Building RKH's Photo Order Management System"
echo "=================================================="

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

# Get the current version
VERSION=$(node -p "require('./package.json').version")
echo "📦 Building version: $VERSION"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Create assets directory if it doesn't exist
mkdir -p assets

# Generate app icons if they don't exist
if [ ! -f "assets/icon.png" ]; then
    echo "🎨 Generating app icons..."
    # Create a simple placeholder icon (you should replace this with your actual icon)
    cat > assets/icon.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="128" fill="#2563eb"/>
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="240" fill="white" text-anchor="middle" font-weight="bold">📸</text>
  <text x="256" y="450" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle">RKH</text>
</svg>
EOF
    
    # Convert SVG to PNG (requires imagemagick or similar)
    if command -v convert &> /dev/null; then
        convert assets/icon.svg -resize 512x512 assets/icon.png
        convert assets/icon.png -resize 256x256 assets/icon@2x.png
        convert assets/icon.png -resize 128x128 assets/icon.ico
        convert assets/icon.png assets/icon.icns
    else
        echo "⚠️  ImageMagick not found. Please add your own icon files to the assets/ directory"
        echo "   Required files: icon.png, icon.ico, icon.icns"
    fi
fi

# Build for different platforms
echo "🔨 Building applications..."

# Determine build targets based on platform and arguments
if [ "$1" = "all" ]; then
    TARGETS="win mac linux"
elif [ "$1" = "win" ] || [ "$1" = "windows" ]; then
    TARGETS="win"
elif [ "$1" = "mac" ] || [ "$1" = "macos" ]; then
    TARGETS="mac"
elif [ "$1" = "linux" ]; then
    TARGETS="linux"
elif [ "$1" = "citrix" ]; then
    # Special Citrix build with optimizations
    TARGETS="win"
    echo "🏢 Building Citrix-optimized version..."
    export CITRIX_BUILD=true
else
    # Default: build for current platform
    case "$(uname -s)" in
        Darwin*)    TARGETS="mac";;
        Linux*)     TARGETS="linux";;
        CYGWIN*|MINGW*|MSYS*) TARGETS="win";;
        *)          TARGETS="linux";;
    esac
fi

# Build for each target
for target in $TARGETS; do
    echo "🔨 Building for $target..."
    
    case $target in
        win)
            npm run build:win
            echo "✅ Windows build completed"
            ;;
        mac)
            npm run build:mac
            echo "✅ macOS build completed"
            ;;
        linux)
            npm run build:linux
            echo "✅ Linux build completed"
            ;;
    esac
done

# Post-build operations
echo "📁 Build artifacts:"
ls -la dist/

# Generate checksums for security
echo "🔐 Generating checksums..."
cd dist
find . -name "*.exe" -o -name "*.dmg" -o -name "*.AppImage" -o -name "*.deb" -o -name "*.rpm" | while read file; do
    echo "Checksumming: $file"
    sha256sum "$file" > "$file.sha256"
done
cd ..

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf "dist/rkhs-photo-orders-v$VERSION-deployment.tar.gz" \
    -C dist \
    --exclude="*.blockmap" \
    --exclude="builder-*" \
    .

echo ""
echo "🎉 Build completed successfully!"
echo "📍 Build artifacts are in the 'dist' directory"
echo "🚀 Ready for deployment!"

# Citrix-specific instructions
if [ "$CITRIX_BUILD" = "true" ]; then
    echo ""
    echo "🏢 Citrix Deployment Notes:"
    echo "=========================="
    echo "1. Use the .msi installer for GPO deployment"
    echo "2. Configure firewall rules for ports 8080-8081"
    echo "3. Test with Citrix Receiver/Workspace app"
    echo "4. Consider published app vs published desktop deployment"
    echo ""
fi

echo "📚 For deployment instructions, see: README.md"
