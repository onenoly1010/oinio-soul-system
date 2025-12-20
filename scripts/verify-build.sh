#!/bin/bash
set -e

echo "🧪 OINIO Binary Verification"
echo "============================"
echo ""

VERSION=$(node -p "require('./config').VERSION")

# Test Linux binary (if on Linux or WSL)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Testing Linux binary..."
    ./dist/oinio-system-linux --version | grep -q "$VERSION" && echo "✅ Linux binary version correct" || echo "❌ Linux binary version mismatch"
    ./dist/oinio-system-linux --help | grep -q "USAGE" && echo "✅ Linux binary help works" || echo "❌ Linux binary help failed"
    echo ""
fi

# Test macOS binary (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Testing macOS binary..."
    ./dist/oinio-system-macos --version | grep -q "$VERSION" && echo "✅ macOS binary version correct" || echo "❌ macOS binary version mismatch"
    ./dist/oinio-system-macos --help | grep -q "USAGE" && echo "✅ macOS binary help works" || echo "❌ macOS binary help failed"
    echo ""
fi

# Test Windows binary (if on Windows or WSL)
if command -v ./dist/oinio-system-win.exe &> /dev/null; then
    echo "Testing Windows binary..."
    ./dist/oinio-system-win.exe --version | grep -q "$VERSION" && echo "✅ Windows binary version correct" || echo "❌ Windows binary version mismatch"
    ./dist/oinio-system-win.exe --help | grep -q "USAGE" && echo "✅ Windows binary help works" || echo "❌ Windows binary help failed"
    echo ""
fi

echo "✅ Verification complete!"
