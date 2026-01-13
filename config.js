/**
 * ═══════════════════════════════════════════════════════════════
 *  🌾🌌 OINIO SOUL SYSTEM — Centralized Configuration
 * ═══════════════════════════════════════════════════════════════
 *  Single source of truth for version and system configuration
 * ═══════════════════════════════════════════════════════════════
 */

// Helper to safely parse integers with fallback
function parseIntSafe(value, defaultValue, min = null) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return defaultValue;
  }
  return min !== null ? Math.max(min, parsed) : parsed;
}

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
    // Enforces minimum of 10,000 iterations for security
    PBKDF2_ITERATIONS: parseIntSafe(process.env.PBKDF2_ITERATIONS || '100000', 100000, 10000),
    
    // Quantum enhancement timeout in milliseconds
    QUANTUM_TIMEOUT_MS: parseIntSafe(process.env.QUANTUM_TIMEOUT_MS || '5000', 5000),
    
    // Enable/disable quantum mode
    ENABLE_QUANTUM: process.env.ENABLE_QUANTUM !== 'false',
  }
};
