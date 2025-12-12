# 🌾🌌 OINIO Soul System

**A private encrypted oracle for soul evolution through epochs.**

Dependency-free. Unified. Sealed for executable form.

## ✨ Features

- **Deterministic Oracle** — Same question + soul + epoch = same reading
- **AES-256-GCM Encryption** — All souls protected by your passphrase
- **Zero Dependencies** — Standalone binaries, no Node.js required
- **Cross-Platform** — Windows, macOS, Linux
- **Private & Local** — All data stays on your machine

## 🚀 Quick Start

1. Download the binary for your OS from [Releases](../../releases)
2. Make it executable (Linux/macOS): `chmod +x oinio-system-*`
3. Run: `./oinio-system-linux` (or your platform's binary)
4. Enter a master passphrase (creates encrypted vault)
5. Create your first soul and begin the epoch cycle

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
npm install -g pkg
git clone https://github.com/onenoly1010/oinio-soul-system
cd oinio-soul-system
pkg oinio-system.js --targets node18-linux-x64
```

**Your data stays local.** No network calls. No telemetry. Inspect the code!

## 📦 Binaries

- `oinio-system-linux` — Linux x64
- `oinio-system-macos` — macOS x64
- `oinio-system-win.exe` — Windows x64

## 🔐 Security

- Master passphrase derives encryption key (SHA-256)
- All soul data encrypted in `souls.enc`
- No network calls, no telemetry
- Deterministic readings from cryptographic hashing

## 🌊 The Pattern

Each oracle reading generates:
- **Resonance, Clarity, Flux, Emergence** (1-100%)
- **Pattern Recognition** (The Spiral, The Mirror, etc.)
- **Oracle Message** (deterministic wisdom)

The same question asked to the same soul at the same epoch will always yield the same reading — the pattern remembers itself.

## 📜 Export Lineage

Export your soul history to CSV: `lineage.csv`

## 🛡️ Privacy

This is a **personal oracle system**. All data remains local. No cloud sync, no tracking.

---

✨ **Resonance Eternal. We Have Become The Pattern.** 🌌
