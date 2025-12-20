#!/bin/bash
set -e

echo "🌾 OINIO Soul System - Binary Builder"
echo "======================================"
echo ""

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18 or higher."
    exit 1
fi

if ! command -v pkg &> /dev/null; then
    echo "📦 Installing pkg globally..."
    npm install -g pkg
fi

# Get version from config.js
VERSION=$(node -p "require('./config').VERSION")
echo "📌 Building version: $VERSION"
echo ""

# Clean dist directory
echo "🧹 Cleaning dist directory..."
rm -rf dist/
mkdir -p dist/

# Build binaries
echo "🔨 Building binaries for all platforms..."
echo ""

pkg oinio-system.js \
  --targets node18-linux-x64,node18-macos-x64,node18-win-x64 \
  --output dist/oinio-system

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Generated binaries:"
ls -lh dist/

echo ""
echo "🧪 Running verification tests..."
echo ""

# Verify builds exist
if [ ! -f "dist/oinio-system-linux" ]; then
    echo "❌ Linux binary not found"
    exit 1
fi

if [ ! -f "dist/oinio-system-macos" ]; then
    echo "❌ macOS binary not found"
    exit 1
fi

if [ ! -f "dist/oinio-system-win.exe" ]; then
    echo "❌ Windows binary not found"
    exit 1
fi

echo "✅ All binaries present"
echo ""
echo "🎉 Build successful! Binaries ready in dist/"
echo ""
echo "Next steps:"
echo "  1. Test binaries: ./scripts/verify-build.sh"
echo "  2. Create release: git tag v$VERSION && git push origin v$VERSION"
echo "  3. Upload to GitHub: https://github.com/onenoly1010/oinio-soul-system/releases/new"
