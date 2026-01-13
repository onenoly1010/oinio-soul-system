#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════
 *  🌾⚡ OINIO-FORGE BRIDGE — Quantum-Enhanced Oracle
 * ═══════════════════════════════════════════════════════════════
 *  Merges OINIO's deterministic cryptographic oracle with
 *  Pi Forge's quantum AI harmony predictions.
 * ═══════════════════════════════════════════════════════════════
 */

const crypto = require('crypto');
const { spawn } = require('child_process');
const path = require('path');
const { PATTERNS, MESSAGES, generateDeterministicReading, displayReading: displayReadingShared } = require('./oinio-shared');
const { config } = require('./config');

// ═══════════════════════════════════════════════════════════════
// 🌌 QUANTUM FORGE INTEGRATION
// ═══════════════════════════════════════════════════════════════

/**
 * Calls Pi Forge Quantum AI Enhancer for harmony predictions
 * Uses configurable timeout from config
 */
async function invokeQuantumForge(question, contextData) {
  return new Promise((resolve, reject) => {
    // Path to your pi-forge-quantum-genesis repository
    const forgePath = config.PI_FORGE_PATH || '/workspaces/pi-forge-quantum-genesis';
    const pythonScript = path.join(forgePath, 'quantum_ai_enhancer.py');
    
    // Check if forge is available
    const fs = require('fs');
    if (!fs.existsSync(pythonScript)) {
      // Silent fallback - warning logged at bridge initialization
      resolve(null);
      return;
    }
    
    // Prepare quantum query payload
    const payload = JSON.stringify({
      query: question,
      timestamp: Date.now() / 1000,
      context: contextData
    });
    
    // Invoke Python quantum enhancer
    const python = spawn('python3', [pythonScript, '--query', payload], {
      cwd: forgePath
    });
    
    let output = '';
    let errorOutput = '';
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        // Silent fallback - reduces console noise for normal operation
        resolve(null);
        return;
      }
      
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (err) {
        resolve(null);
      }
    });
    
    // Configurable timeout for quantum forge
    setTimeout(() => {
      python.kill();
      resolve(null);
    }, config.QUANTUM_TIMEOUT_MS);
  });
}

/**
 * Enhanced oracle consultation with quantum forge integration
 * Optimized to use cached pattern/message arrays
 */
async function consultQuantumOracle(question, seed, epochNumber) {
  // Phase 1: Deterministic cryptographic reading (OINIO)
  const reading = generateDeterministicReading(question, seed, epochNumber);
  
  // Phase 2: Attempt quantum forge enhancement
  try {
    const forgeResult = await invokeQuantumForge(question, {
      seed: seed.substring(0, 8), // Partial seed for privacy
      epoch: epochNumber,
      resonance: reading.resonance,
      pattern: reading.pattern
    });
    
    if (forgeResult && forgeResult.harmony_index !== undefined) {
      // Merge quantum predictions
      reading.mode = 'quantum-enhanced';
      reading.harmonyIndex = forgeResult.harmony_index;
      reading.quantumConfidence = forgeResult.confidence || 0;
      reading.quantumTrend = forgeResult.trend || 'stable';
      reading.forgeRecommendations = forgeResult.recommendations || [];
      
      // Augment message with quantum insight
      if (forgeResult.ai_insight) {
        reading.quantumInsight = forgeResult.ai_insight;
      }
    }
  } catch (err) {
    // Silently fall back to deterministic mode
    console.log('⚡ Quantum layer unavailable, using pure cryptographic oracle');
  }
  
  return reading;
}

/**
 * Display quantum-enhanced reading
 */
function displayQuantumReading(reading, epochNumber) {
  displayReadingShared(reading, epochNumber);
}

// ═══════════════════════════════════════════════════════════════
// 🔗 BRIDGE MODES
// ═══════════════════════════════════════════════════════════════

/**
 * Determine if quantum forge is available
 */
async function isForgeAvailable() {
  const forgePath = process.env.PI_FORGE_PATH || '/workspaces/pi-forge-quantum-genesis';
  const fs = require('fs');
  return fs.existsSync(path.join(forgePath, 'quantum_ai_enhancer.py'));
}

/**
 * Bridge status check
 */
async function checkBridgeStatus() {
  const forgeAvailable = await isForgeAvailable();
  
  console.log('\n🌉 OINIO-FORGE BRIDGE STATUS');
  console.log('═'.repeat(50));
  console.log(`OINIO Oracle: ✅ Active (Deterministic Crypto)`);
  console.log(`Quantum Forge: ${forgeAvailable ? '✅ Connected' : '⚠️  Unavailable'}`);
  console.log(`Bridge Mode: ${forgeAvailable ? 'Quantum-Enhanced' : 'Standard Oracle'}`);
  console.log('═'.repeat(50) + '\n');
  
  return forgeAvailable;
}

module.exports = {
  consultQuantumOracle,
  displayQuantumReading,
  invokeQuantumForge,
  isForgeAvailable,
  checkBridgeStatus
};

// ═══════════════════════════════════════════════════════════════
// 🧪 TEST MODE
// ═══════════════════════════════════════════════════════════════

if (require.main === module) {
  (async () => {
    console.log('🌾⚡ Testing OINIO-Forge Bridge\n');
    
    await checkBridgeStatus();
    
    console.log('Testing quantum-enhanced consultation...\n');
    const testSeed = crypto.randomBytes(32).toString('hex');
    const reading = await consultQuantumOracle('What is the nature of integration?', testSeed, 1);
    
    displayQuantumReading(reading, 1);
  })();
}
