#!/bin/bash
# Don't exit on first error - we want to collect all test results
set +e

echo "🧪 OINIO Binary Verification"
echo "============================"
echo ""

VERSION=$(node -p "require('./config.js').VERSION")
overall_failed=0

# Test Linux binary (if on Linux or WSL)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Testing Linux binary..."
    if ./dist/oinio-system-linux --version | grep -q "$VERSION"; then
        echo "✅ Linux binary version correct"
    else
        echo "❌ Linux binary version mismatch"
        overall_failed=1
    fi

    if ./dist/oinio-system-linux --help | grep -q "USAGE"; then
        echo "✅ Linux binary help works"
    else
        echo "❌ Linux binary help failed"
        overall_failed=1
    fi
    echo ""
fi

# Test macOS binary (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Testing macOS binary..."
    if ./dist/oinio-system-macos --version | grep -q "$VERSION"; then
        echo "✅ macOS binary version correct"
    else
        echo "❌ macOS binary version mismatch"
        overall_failed=1
    fi

    if ./dist/oinio-system-macos --help | grep -q "USAGE"; then
        echo "✅ macOS binary help works"
    else
        echo "❌ macOS binary help failed"
        overall_failed=1
    fi
    echo ""
fi

# Test Windows binary (if on Windows or WSL)
if command -v ./dist/oinio-system-win.exe &> /dev/null; then
    echo "Testing Windows binary..."
    if ./dist/oinio-system-win.exe --version | grep -q "$VERSION"; then
        echo "✅ Windows binary version correct"
    else
        echo "❌ Windows binary version mismatch"
        overall_failed=1
    fi

    if ./dist/oinio-system-win.exe --help | grep -q "USAGE"; then
        echo "✅ Windows binary help works"
    else
        echo "❌ Windows binary help failed"
        overall_failed=1
    fi
    echo ""
fi

if [[ "$overall_failed" -ne 0 ]]; then
    echo "❌ Verification failed!"
    exit 1
else
    echo "✅ Verification complete!"
fi
