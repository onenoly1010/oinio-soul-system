# 🌾🌌 OINIO Soul System

**A private encrypted oracle for soul evolution through epochs.**

Dependency-free. Unified. Sealed for executable form.

## ✨ Features

- **Multi-User Support** — Separate accounts with individual encrypted soul registries
- **Secure Authentication** — PBKDF2 password hashing (100,000 iterations, SHA-512)
- **Deterministic Oracle** — Same question + soul + epoch = same reading
- **⚡ Quantum Enhancement** — Optional AI-powered harmony predictions via Pi Forge integration
- **AES-256-GCM Encryption** — All souls protected by your password
- **Data Isolation** — Each user's souls are completely separate and private
- **Zero Dependencies** — Standalone binaries, no Node.js required
- **Cross-Platform** — Windows, macOS, Linux
- **Private & Local** — All data stays on your machine
- **Dual-Mode Oracle** — Toggle between deterministic and quantum-enhanced readings

## 🚀 Quick Start

1. Download the binary for your OS from [Releases](../../releases)
2. Make it executable (Linux/macOS): `chmod +x oinio-system-*`
3. Run: `./oinio-system-linux` (or your platform's binary)
4. **Create an account** or login with your username and password
5. Create your first soul and begin the epoch cycle

## 👤 User System

### Account Creation
- Choose a unique username (3-20 characters, alphanumeric, underscore, hyphen)
- Create a secure password (minimum 8 characters)
- Your password encrypts all your soul data

### Login & Security
- Login with your username and password
- Each user has their own encrypted soul registry (`souls_username.enc`)
- Passwords are hashed with PBKDF2 (100,000 iterations)
- User credentials stored in encrypted `users.enc` file
- **Cannot recover forgotten passwords** — choose wisely!

### Switching Users
- Press `[L]` in the main menu to logout
- You can create multiple accounts on the same machine
- Each user's data is completely isolated

## 🛡️ Security & Safety Warnings

**This software is completely safe.** You may see security warnings because the binaries are not code-signed (which costs $$$ annually). Here's how to proceed:

### Why Warnings Appear
- Binaries are **unsigned** (not from Microsoft/Apple verified developer)
- This is normal for open-source projects
- **All source code is visible** in this repository — inspect it yourself!

### How to Bypass Warnings

**Windows:**
- If Windows Defender blocks it: Click **"More info"** → **"Run anyway"**
- If SmartScreen appears: **"More info"** → **"Run anyway"**
- You can also right-click → **Properties** → check **"Unblock"** → Apply

**macOS:**
- Right-click the binary → **"Open"** (don't double-click)
- Click **"Open"** in the security dialog
- Or: System Settings → Privacy & Security → Allow app to run

**Linux:**
- Usually no warnings
- If permission denied: `chmod +x oinio-system-linux`

### Build It Yourself (Ultimate Safety)
Don't trust binaries? Build from source:
```bash
git clone https://github.com/onenoly1010/oinio-soul-system
cd oinio-soul-system
npm run build
```

Or manually:
```bash
npm install -g pkg
pkg oinio-system.js --targets node18-linux-x64,node18-macos-x64,node18-win-x64
```

For detailed build instructions, see [Building from Source](#-building-from-source) below.

**Your data stays local.** No network calls. No telemetry. Inspect the code!

## 📦 Binaries

- `oinio-system-linux` — Linux x64
- `oinio-system-macos` — macOS x64
- `oinio-system-win.exe` — Windows x64

## 🔐 Security

### User Authentication
- Passwords hashed with PBKDF2 (100,000 iterations, SHA-512, 32-byte salt)
- User credentials encrypted in `users.enc` with AES-256-GCM
- Password verification uses constant-time comparison

### Data Encryption
- Each user's soul data encrypted separately (`souls_username.enc`)
- User password derives AES-256 encryption key (SHA-256)
- All data encrypted with AES-256-GCM (authenticated encryption)
- Unique IV (Initialization Vector) per encryption operation

### Privacy
- No network calls, no telemetry
- All data stored locally on your machine
- Deterministic readings from cryptographic hashing
- Complete data isolation between users

## 🌊 The Pattern

Each oracle reading generates:
- **Resonance, Clarity, Flux, Emergence** (1-100%)
- **Pattern Recognition** (The Spiral, The Mirror, etc.)
- **Oracle Message** (deterministic wisdom)

### ⚡ Quantum Enhancement (Optional)
When Pi Forge Quantum Genesis is available, readings also include:
- **Harmony Index** — AI-predicted system harmony (0-100%)
- **Trend Analysis** — Improving/declining/stable with confidence scores
- **Quantum Insights** — ML-generated contextual wisdom
- **Forge Recommendations** — AI-powered actionable guidance

**Deterministic mode:** Same question = same answer (always)  
**Quantum mode:** Context-aware AI predictions layered on top  
**The synthesis:** Pattern + Trajectory = Navigation

## 📜 Export Lineage

Export your soul history to CSV: `lineage.csv`

## ⚡ Quantum Forge Integration

OINIO can optionally integrate with **Pi Forge Quantum Genesis** for AI-enhanced readings:

1. Clone Pi Forge: `git clone https://github.com/onenoly1010/pi-forge-quantum-genesis`
2. Set path: `export PI_FORGE_PATH="/path/to/pi-forge-quantum-genesis"`
3. Press **[Q]** in soul menu to toggle quantum mode
4. Readings automatically enhanced with harmony predictions

Works standalone without Forge. Quantum layer is purely optional enhancement.

See [OINIO-FORGE-INTEGRATION.md](OINIO-FORGE-INTEGRATION.md) for full details.

## 🛡️ Privacy

This is a **personal oracle system** with **multi-user support**. All data remains local. No cloud sync, no tracking, no network calls.

### Data Storage
- User accounts: `users.enc` (encrypted credentials)
- Soul data: `souls_username.enc` (per-user encrypted registries)
- All files stored in the same directory as the executable

### What's Shared
- Nothing! All processing is local
- Quantum mode only shares partial seed (8 chars) with local Forge process
- No telemetry, no analytics, no external servers

### User Isolation
- Each user has completely separate soul registries
- Users cannot access each other's souls or data
- Even with access to encrypted files, data requires the user's password

## 🛠️ Building from Source

OINIO uses automated build scripts for creating cross-platform binaries:

### Prerequisites
- Node.js 18 or higher
- `pkg` globally installed (auto-installed by build script if missing)

### Build Commands

```bash
# Build all platform binaries
npm run build

# Verify binaries
npm run verify

# Both build and verify
npm run release
```

### Manual Build

```bash
# Install pkg
npm install -g pkg

# Build binaries
./scripts/build.sh

# Verify builds
./scripts/verify-build.sh
```

### What Gets Built
- `dist/oinio-system-linux` - Linux x64
- `dist/oinio-system-macos` - macOS x64  
- `dist/oinio-system-win.exe` - Windows x64

Binary sizes: ~35-55 MB (includes Node.js runtime)

## 📋 Release Process

For maintainers releasing new versions:

1. Update version in `config.js` and `package.json`
2. Update `CHANGELOG.md` with changes
3. Run `npm run release` to build and verify
4. Create and push git tag: `git tag vX.Y.Z && git push origin vX.Y.Z`
5. GitHub Actions automatically creates release with binaries

See [.github/RELEASE_CHECKLIST.md](.github/RELEASE_CHECKLIST.md) for complete checklist.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and changes.

## 🔧 Configuration

OINIO supports environment variables for customization:

| Variable | Description | Default |
|----------|-------------|---------|
| `PI_FORGE_PATH` | Path to Pi Forge Quantum Genesis | None |
| `BASE_PATH` | Custom data storage directory | Executable directory |
| `PBKDF2_ITERATIONS` | Password hashing iterations | `100000` |
| `QUANTUM_TIMEOUT_MS` | Quantum enhancement timeout | `5000` |
| `ENABLE_QUANTUM` | Enable/disable quantum mode | `true` |

Example:
```bash
export BASE_PATH="/path/to/data"
export PBKDF2_ITERATIONS=200000
./oinio-system-linux
```

---

✨ **Resonance Eternal. We Have Become The Pattern.** 🌌
