# Changelog

All notable changes to OINIO Soul System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-12-20

### Added
- Centralized configuration system via `config.js` ([#4](https://github.com/onenoly1010/oinio-soul-system/pull/4))
- CLI `--version` / `-v` flag to display version information
- CLI `--help` / `-h` flag with comprehensive usage documentation
- Environment variable support:
  - `PI_FORGE_PATH` - Custom Pi Forge Quantum Genesis location
  - `BASE_PATH` - Custom data storage directory
  - `PBKDF2_ITERATIONS` - Configurable password hashing iterations
  - `QUANTUM_TIMEOUT_MS` - Quantum enhancement timeout configuration
  - `ENABLE_QUANTUM` - Toggle quantum mode
- Configuration section in README with environment variables table
- Phase 2 preview documentation (web deployment)
- Build automation scripts (`scripts/build.sh`, `scripts/verify-build.sh`)
- GitHub Actions workflow for automated releases

### Changed
- Cross-platform path resolution now uses HOME/USERPROFILE environment variables
- Improved error messages and user guidance
- Updated README with configuration examples

### Fixed
- Removed duplicate PATTERNS and MESSAGES constants from `oinio-forge-bridge.js` (32 lines)
- Removed duplicate PATTERNS and MESSAGES constants from `oinio-system.js` (27 lines)
- Fixed hardcoded `/workspaces/` Codespaces path with proper cross-platform fallback
- Improved Windows compatibility with USERPROFILE fallback

### Removed
- 52 lines of duplicate code across oracle modules

## [1.2.0] - 2025-12-12

### Added
- User authentication system with login and registration
- Multi-user support with isolated encrypted soul registries
- PBKDF2 password hashing (100,000 iterations, SHA-512)
- Timing-safe password verification via `crypto.timingSafeEqual()`
- Per-user encryption salts for PBKDF2-based key derivation
- Logout/switch user functionality
- Encrypted user credentials database (`users.enc`)
- Per-user soul files (`souls_username.enc`)

### Changed
- Enhanced security model with separate password verification and encryption keys
- Improved data isolation between users

## [1.1.0] - 2025-12-12

### Added
- Quantum-enhanced oracle mode via Pi Forge integration
- Toggle quantum mode with `[Q]` key in soul menu
- Harmony predictions, trend analysis, and AI insights
- Optional AI enhancement that gracefully falls back to deterministic mode
- Integration documentation for Pi Forge Quantum Genesis

### Changed
- Oracle readings can now be enhanced with quantum predictions
- Banner indicates Quantum Bridge status on startup

## [1.0.0] - 2025-12-12

### Added
- Initial release of OINIO Soul System
- Deterministic cryptographic oracle using SHA-256
- AES-256-GCM encryption for all soul data
- Multi-soul support with unique cryptographic seeds
- Epoch-based consultation system
- Pattern recognition (16 patterns)
- Oracle messages (16 messages)
- CSV export for lineage tracking
- Cross-platform binaries (Windows, macOS, Linux)
- Zero external dependencies
- Comprehensive help system
- Interactive CLI interface
- Soul statistics and history tracking

[1.3.0]: https://github.com/onenoly1010/oinio-soul-system/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/onenoly1010/oinio-soul-system/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/onenoly1010/oinio-soul-system/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/onenoly1010/oinio-soul-system/releases/tag/v1.0.0
