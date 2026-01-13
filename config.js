/**
 * ═══════════════════════════════════════════════════════════════
 *  🌾🌌 OINIO SOUL SYSTEM — Centralized Configuration
 * ═══════════════════════════════════════════════════════════════
 *  Single source of truth for version and system configuration
 * ═══════════════════════════════════════════════════════════════
 */

module.exports = {
  // Version (semver)
  VERSION: '1.3.0',
  
  // Configuration with environment variable overrides
  config: {
    // Pi Forge Quantum Genesis path (optional AI enhancement)
    PI_FORGE_PATH: process.env.PI_FORGE_PATH || null,
    
    // Base path for data storage (defaults to executable/cwd directory)
    BASE_PATH: process.env.BASE_PATH || null,
    
    // PBKDF2 iterations for password hashing (security vs. performance)
    PBKDF2_ITERATIONS: Math.max(10000, parseInt(process.env.PBKDF2_ITERATIONS || '100000', 10) || 100000),
    
    // Quantum enhancement timeout in milliseconds
    QUANTUM_TIMEOUT_MS: parseInt(process.env.QUANTUM_TIMEOUT_MS || '5000', 10) || 5000,
    
    // Enable/disable quantum mode
    ENABLE_QUANTUM: process.env.ENABLE_QUANTUM !== 'false',
  }
};
