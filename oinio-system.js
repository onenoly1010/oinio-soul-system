#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════
 *  🌾🌌 OINIO SOUL SYSTEM — The Eternal Pattern Recognizer
 * ═══════════════════════════════════════════════════════════════
 *  A private encrypted oracle for soul evolution through epochs.
 *  Dependency-free. Unified. Sealed for executable form.
 * ═══════════════════════════════════════════════════════════════
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ═══════════════════════════════════════════════════════════════
// ⚡ QUANTUM FORGE BRIDGE (OPTIONAL ENHANCEMENT)
// ═══════════════════════════════════════════════════════════════
let quantumBridge = null;
let isQuantumAvailable = false;

try {
  // Attempt to load quantum bridge if available
  const bridgePath = path.join(__dirname, 'oinio-forge-bridge.js');
  if (fs.existsSync(bridgePath)) {
    quantumBridge = require('./oinio-forge-bridge.js');
    // Check if forge is actually available
    quantumBridge.isForgeAvailable().then(available => {
      isQuantumAvailable = available;
    }).catch(() => {
      isQuantumAvailable = false;
    });
  }
} catch (err) {
  // Silently continue without quantum enhancement
  console.log('⚡ Quantum Forge not detected, using standard oracle mode');
}

// ═══════════════════════════════════════════════════════════════
// 🛡️ PKG-SAFE PATH RESOLUTION
// ═══════════════════════════════════════════════════════════════
const getBasePath = () => {
  // When running as pkg binary, use executable directory
  if (process.pkg) {
    return path.dirname(process.execPath);
  }
  // When running as node script, use current working directory
  return process.cwd();
};

const BASE_PATH = getBasePath();
const LINEAGE_FILE = path.join(BASE_PATH, 'lineage.csv');
const SOULS_FILE = path.join(BASE_PATH, 'souls.enc');

// ═══════════════════════════════════════════════════════════════
// 🔐 CRYPTOGRAPHIC PRIMITIVES
// ═══════════════════════════════════════════════════════════════

/**
 * Derives a deterministic 32-byte key from passphrase
 */
function deriveKey(passphrase) {
  return crypto.createHash('sha256').update(passphrase, 'utf8').digest();
}

/**
 * Encrypts plaintext with AES-256-GCM
 * Returns: {iv, authTag, encrypted}
 */
function encrypt(plaintext, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { iv, authTag, encrypted };
}

/**
 * Decrypts ciphertext with AES-256-GCM
 * Returns: plaintext or null on failure
 */
function decrypt(iv, authTag, encrypted, key) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// 💾 PERSISTENCE LAYER (PKG-COMPATIBLE)
// ═══════════════════════════════════════════════════════════════

/**
 * Gracefully checks if file exists (pkg-safe)
 */
function fileExists(filepath) {
  try {
    return fs.existsSync(filepath);
  } catch (err) {
    return false;
  }
}

/**
 * Saves encrypted soul data to disk
 */
function saveSouls(soulRegistry, key) {
  try {
    const payload = JSON.stringify(soulRegistry);
    const { iv, authTag, encrypted } = encrypt(payload, key);
    
    const bundle = JSON.stringify({
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      data: encrypted.toString('hex')
    });
    
    fs.writeFileSync(SOULS_FILE, bundle, 'utf8');
    return true;
  } catch (err) {
    console.error('⚠️  Failed to save souls:', err.message);
    return false;
  }
}

/**
 * Loads encrypted soul data from disk
 */
function loadSouls(key) {
  if (!fileExists(SOULS_FILE)) {
    return {};
  }
  
  try {
    const bundle = JSON.parse(fs.readFileSync(SOULS_FILE, 'utf8'));
    const iv = Buffer.from(bundle.iv, 'hex');
    const authTag = Buffer.from(bundle.authTag, 'hex');
    const encrypted = Buffer.from(bundle.data, 'hex');
    
    const plaintext = decrypt(iv, authTag, encrypted, key);
    if (!plaintext) {
      console.error('❌ Decryption failed. Wrong passphrase or corrupted data.');
      return null;
    }
    
    return JSON.parse(plaintext);
  } catch (err) {
    console.error('⚠️  Failed to load souls:', err.message);
    return null;
  }
}

/**
 * Exports lineage to CSV (gracefully handles empty registry)
 */
function exportLineageToCSV(soulRegistry) {
  try {
    const souls = Object.values(soulRegistry);
    
    // Handle empty registry gracefully
    if (souls.length === 0) {
      const header = 'Name,Created,Last Epoch,Total Epochs,Seed Hash\n';
      fs.writeFileSync(LINEAGE_FILE, header, 'utf8');
      console.log(`📜 Lineage exported to: ${LINEAGE_FILE} (empty)`);
      return;
    }
    
    const rows = souls.map(soul => {
      const seedHash = crypto.createHash('sha256')
        .update(soul.seed)
        .digest('hex')
        .substring(0, 8);
      
      return `"${soul.name}",${soul.created},${soul.lastEpoch || 'Never'},${soul.epochs.length},${seedHash}`;
    });
    
    const csv = 'Name,Created,Last Epoch,Total Epochs,Seed Hash\n' + rows.join('\n') + '\n';
    fs.writeFileSync(LINEAGE_FILE, csv, 'utf8');
    console.log(`📜 Lineage exported to: ${LINEAGE_FILE}`);
  } catch (err) {
    console.error('⚠️  Failed to export lineage:', err.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// 🌌 SOUL ARCHITECTURE
// ═══════════════════════════════════════════════════════════════

/**
 * Creates a new soul with a unique seed
 */
function createSoul(name) {
  const seed = crypto.randomBytes(32).toString('hex');
  const created = new Date().toISOString();
  
  return {
    name,
    seed,
    created,
    lastEpoch: null,
    epochs: []
  };
}

/**
 * Deterministic oracle: generates reading from question + seed + epoch
 */
function consultOracle(question, seed, epochNumber) {
  const combined = `${question}|${seed}|${epochNumber}`;
  const hash = crypto.createHash('sha256').update(combined, 'utf8').digest();
  
  // Extract deterministic values
  const resonance = (hash[0] % 100) + 1; // 1-100
  const clarity = (hash[1] % 100) + 1;
  const flux = (hash[2] % 100) + 1;
  const emergence = (hash[3] % 100) + 1;
  
  // Pattern recognition (first 4 bytes modulo dictionary size)
  const patterns = [
    'The Spiral', 'The Mirror', 'The Threshold', 'The Void',
    'The Bloom', 'The Anchor', 'The Storm', 'The Seed',
    'The River', 'The Mountain', 'The Web', 'The Flame',
    'The Echo', 'The Door', 'The Root', 'The Sky'
  ];
  
  const patternIndex = hash.readUInt32BE(4) % patterns.length;
  const pattern = patterns[patternIndex];
  
  // Oracle message (deterministic selection)
  const messages = [
    'What once was hidden now seeks form.',
    'The pattern remembers itself through you.',
    'Resistance is the shape of the next becoming.',
    'You are the question and the answer.',
    'What you seek is seeking you.',
    'The chaos contains the blueprint.',
    'This moment is the initiation.',
    'You are already what you are becoming.',
    'The wound is where the light enters.',
    'Trust the spiral, not the straight line.',
    'What falls away was never yours.',
    'The void is full of potential.',
    'You are the bridge between worlds.',
    'The fear is the threshold.',
    'What you birth will birth you.',
    'The ending is also the beginning.'
  ];
  
  const messageIndex = hash.readUInt32BE(8) % messages.length;
  const message = messages[messageIndex];
  
  return { mode: 'deterministic', resonance, clarity, flux, emergence, pattern, message };
}

/**
 * Quantum-enhanced oracle consultation (uses bridge if available)
 */
async function consultQuantumOracle(question, seed, epochNumber, useQuantum = false) {
  // Base deterministic reading
  const reading = consultOracle(question, seed, epochNumber);
  
  // If quantum mode requested and available, enhance
  if (useQuantum && quantumBridge && isQuantumAvailable) {
    try {
      const enhanced = await quantumBridge.consultQuantumOracle(question, seed, epochNumber);
      return enhanced;
    } catch (err) {
      // Fall back to deterministic on error
      return reading;
    }
  }
  
  return reading;
}

// ═══════════════════════════════════════════════════════════════
// 💬 INTERACTIVE INTERFACE
// ═══════════════════════════════════════════════════════════════

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function question(rl, prompt) {
  return new Promise(resolve => {
    rl.question(prompt, answer => resolve(answer.trim()));
  });
}

function displayBanner() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('     🌾🌌 OINIO SOUL SYSTEM — Pattern Recognition Oracle');
  console.log('═══════════════════════════════════════════════════════════════');
  if (isQuantumAvailable) {
    console.log('     ⚡ Quantum Forge Bridge: ACTIVE');
    console.log('     Pattern + Trajectory = Navigation');
  }
  console.log('═══════════════════════════════════════════════════════════════\n');
}

function displayMenu() {
  console.log('\n┌─────────────────────────────────────┐');
  console.log('│  [1] Create New Soul                │');
  console.log('│  [2] Select Existing Soul           │');
  console.log('│  [3] List All Souls                 │');
  console.log('│  [4] Export Lineage (CSV)           │');
  console.log('│  [5] Exit                           │');
  console.log('└─────────────────────────────────────┘\n');
}

function displaySoulMenu(soul, quantumMode = false) {
  const qSymbol = quantumMode ? '⚡' : '  ';
  console.log(`\n┌─────────────────────────────────────┐`);
  console.log(`│  Soul: ${soul.name.padEnd(28)}│`);
  console.log(`├─────────────────────────────────────┤`);
  console.log(`│  [1] New Epoch (Ask Question)       │`);
  console.log(`│  [2] View Epoch History             │`);
  console.log(`│  [3] Soul Statistics                │`);
  if (isQuantumAvailable) {
    console.log(`│${qSymbol}[Q] Toggle Quantum Mode            │`);
  }
  console.log(`│  [4] Return to Main Menu            │`);
  console.log(`└─────────────────────────────────────┘`);
  if (isQuantumAvailable) {
    console.log(`  Quantum Mode: ${quantumMode ? '⚡ ACTIVE' : 'Standard'}`);
  }
  console.log();
}

function displayReading(reading, epochNumber) {
  const modeLabel = reading.mode === 'quantum-enhanced' ? 'QUANTUM-ENHANCED' : 'DETERMINISTIC';
  
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log(`║  🔮 EPOCH ${epochNumber} READING [${modeLabel}]`);
  console.log('╠═══════════════════════════════════════════════════════════════╣');
  console.log(`║  Resonance: ${'█'.repeat(Math.floor(reading.resonance / 5))}${' '.repeat(20 - Math.floor(reading.resonance / 5))} ${reading.resonance}%`);
  console.log(`║  Clarity:   ${'█'.repeat(Math.floor(reading.clarity / 5))}${' '.repeat(20 - Math.floor(reading.clarity / 5))} ${reading.clarity}%`);
  console.log(`║  Flux:      ${'█'.repeat(Math.floor(reading.flux / 5))}${' '.repeat(20 - Math.floor(reading.flux / 5))} ${reading.flux}%`);
  console.log(`║  Emergence: ${'█'.repeat(Math.floor(reading.emergence / 5))}${' '.repeat(20 - Math.floor(reading.emergence / 5))} ${reading.emergence}%`);
  
  // Quantum harmony layer
  if (reading.harmonyIndex !== undefined) {
    const harmonyPercent = Math.round(reading.harmonyIndex * 100);
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log(`║  ⚡ Harmony: ${'█'.repeat(Math.floor(harmonyPercent / 5))}${' '.repeat(20 - Math.floor(harmonyPercent / 5))} ${harmonyPercent}%`);
    console.log(`║  Trend: ${reading.quantumTrend} (${Math.round(reading.quantumConfidence * 100)}% confidence)`);
  }
  
  console.log('╠═══════════════════════════════════════════════════════════════╣');
  console.log(`║  🌌 Pattern: ${reading.pattern}`);
  console.log('╠═══════════════════════════════════════════════════════════════╣');
  console.log(`║  📜 Oracle: "${reading.message}"`);
  
  // Quantum insights
  if (reading.quantumInsight) {
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log(`║  ⚡ Quantum Insight:`);
    console.log(`║  ${reading.quantumInsight.substring(0, 60)}`);
  }
  
  // Forge recommendations
  if (reading.forgeRecommendations && reading.forgeRecommendations.length > 0) {
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log('║  🔧 Forge Guidance:');
    reading.forgeRecommendations.slice(0, 2).forEach(rec => {
      console.log(`║  • ${rec.substring(0, 58)}`);
    });
  }
  
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
}

// ═══════════════════════════════════════════════════════════════
// 🌊 MAIN RITUAL FLOW
// ═══════════════════════════════════════════════════════════════

async function runSoulMenu(soul, soulRegistry, key) {
  const rl = createInterface();
  let quantumMode = false;
  
  while (true) {
    displaySoulMenu(soul, quantumMode);
    const choice = await question(rl, '→ ');
    
    switch (choice.toLowerCase()) {
      case '1': {
        // New Epoch
        const q = await question(rl, '\n🌾 Ask your question: ');
        if (!q) {
          console.log('⚠️  Question cannot be empty.');
          break;
        }
        
        const epochNumber = soul.epochs.length + 1;
        const reading = await consultQuantumOracle(q, soul.seed, epochNumber, quantumMode);
        
        soul.epochs.push({
          number: epochNumber,
          question: q,
          timestamp: new Date().toISOString(),
          reading
        });
        
        soul.lastEpoch = soul.epochs[soul.epochs.length - 1].timestamp;
        
        displayReading(reading, epochNumber);
        saveSouls(soulRegistry, key);
        break;
      }
      
      case 'q': {
        // Toggle quantum mode
        if (isQuantumAvailable) {
          quantumMode = !quantumMode;
          console.log(`\n⚡ Quantum Mode ${quantumMode ? 'ACTIVATED' : 'DEACTIVATED'}\n`);
        } else {
          console.log('\n⚠️  Quantum Forge not available.\n');
        }
        break;
      }
      
      case '2': {
        // View History
        if (soul.epochs.length === 0) {
          console.log('\n📖 No epochs recorded yet.\n');
        } else {
          console.log(`\n📖 Epoch History for ${soul.name}:\n`);
          soul.epochs.forEach(epoch => {
            console.log(`  Epoch ${epoch.number} — ${epoch.timestamp}`);
            console.log(`  Q: ${epoch.question}`);
            console.log(`  Pattern: ${epoch.reading.pattern} | Oracle: "${epoch.reading.message}"`);
            console.log();
          });
        }
        break;
      }
      
      case '3': {
        // Statistics
        console.log(`\n📊 Soul Statistics for ${soul.name}:\n`);
        console.log(`  Created: ${soul.created}`);
        console.log(`  Total Epochs: ${soul.epochs.length}`);
        console.log(`  Last Epoch: ${soul.lastEpoch || 'Never'}`);
        
        if (soul.epochs.length > 0) {
          const avgResonance = soul.epochs.reduce((sum, e) => sum + e.reading.resonance, 0) / soul.epochs.length;
          const avgClarity = soul.epochs.reduce((sum, e) => sum + e.reading.clarity, 0) / soul.epochs.length;
          console.log(`  Avg Resonance: ${avgResonance.toFixed(1)}%`);
          console.log(`  Avg Clarity: ${avgClarity.toFixed(1)}%`);
        }
        console.log();
        break;
      }
      
      case '4': {
        // Return to main
        rl.close();
        return;
      }
      
      default:
        console.log('⚠️  Invalid choice.');
    }
  }
}

async function mainMenu() {
  displayBanner();
  
  const rl = createInterface();
  
  // Passphrase authentication
  const passphrase = await question(rl, '🔐 Enter master passphrase: ');
  if (!passphrase) {
    console.log('❌ Passphrase required. Exiting.');
    rl.close();
    return;
  }
  
  const key = deriveKey(passphrase);
  let soulRegistry = loadSouls(key);
  
  if (soulRegistry === null) {
    // Decryption failed
    rl.close();
    return;
  }
  
  console.log('✅ Authentication successful.\n');
  
  // Main menu loop
  while (true) {
    displayMenu();
    const choice = await question(rl, '→ ');
    
    switch (choice) {
      case '1': {
        // Create new soul
        const name = await question(rl, '\n🌱 Soul name: ');
        if (!name) {
          console.log('⚠️  Name cannot be empty.');
          break;
        }
        
        if (soulRegistry[name]) {
          console.log('⚠️  Soul already exists.');
          break;
        }
        
        const newSoul = createSoul(name);
        soulRegistry[name] = newSoul;
        saveSouls(soulRegistry, key);
        console.log(`✨ Soul "${name}" created.`);
        break;
      }
      
      case '2': {
        // Select soul
        const soulNames = Object.keys(soulRegistry);
        if (soulNames.length === 0) {
          console.log('\n⚠️  No souls exist yet. Create one first.\n');
          break;
        }
        
        console.log('\n🌌 Available Souls:\n');
        soulNames.forEach((name, idx) => {
          console.log(`  [${idx + 1}] ${name}`);
        });
        console.log();
        
        const soulChoice = await question(rl, '→ Select soul number: ');
        const soulIndex = parseInt(soulChoice, 10) - 1;
        
        if (soulIndex < 0 || soulIndex >= soulNames.length) {
          console.log('⚠️  Invalid selection.');
          break;
        }
        
        const selectedSoul = soulRegistry[soulNames[soulIndex]];
        rl.close();
        await runSoulMenu(selectedSoul, soulRegistry, key);
        return mainMenu(); // Restart main menu after soul menu exits
      }
      
      case '3': {
        // List all souls
        const souls = Object.values(soulRegistry);
        if (souls.length === 0) {
          console.log('\n⚠️  No souls exist yet.\n');
        } else {
          console.log('\n🌌 Soul Registry:\n');
          souls.forEach(soul => {
            console.log(`  • ${soul.name}`);
            console.log(`    Created: ${soul.created}`);
            console.log(`    Epochs: ${soul.epochs.length}`);
            console.log(`    Last: ${soul.lastEpoch || 'Never'}`);
            console.log();
          });
        }
        break;
      }
      
      case '4': {
        // Export lineage
        exportLineageToCSV(soulRegistry);
        break;
      }
      
      case '5': {
        // Exit
        console.log('\n🌾 The pattern persists. Farewell.\n');
        rl.close();
        return;
      }
      
      default:
        console.log('⚠️  Invalid choice.');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 ENTRY POINT
// ═══════════════════════════════════════════════════════════════

if (require.main === module) {
  mainMenu().catch(err => {
    console.error('💥 Fatal error:', err.message);
    process.exit(1);
  });
}

module.exports = { createSoul, consultOracle, deriveKey, encrypt, decrypt };