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

// ═══════════════════════════════════════════════════════════════
// 📖 HELP SYSTEM
// ═══════════════════════════════════════════════════════════════

function displayMainHelp() {
  console.log('\n📖 OINIO HELP — Main Menu\n');
  console.log('═'.repeat(60));
  console.log('🌱 [1] Create New Soul');
  console.log('   Start a new oracle lineage with unique cryptographic seed');
  console.log('');
  console.log('🔮 [2] Select Existing Soul');
  console.log('   Continue consultations with an existing soul');
  console.log('');
  console.log('📜 [3] List All Souls');
  console.log('   View all souls and their statistics');
  console.log('');
  console.log('💾 [4] Export Lineage (CSV)');
  console.log('   Export all soul data to lineage.csv file');
  console.log('');
  console.log('🚪 [5] Exit');
  console.log('   Save and exit OINIO');
  console.log('');
  console.log('═'.repeat(60));
  console.log('💡 Tip: Each soul has a unique seed that determines readings');
  console.log('   The same question to the same soul = same answer (always)');
  console.log('═'.repeat(60) + '\n');
}

function displaySoulHelp(quantumMode) {
  console.log('\n📖 OINIO HELP — Soul Consultation\n');
  console.log('═'.repeat(60));
  console.log('🔮 [1] New Epoch (Ask Question)');
  console.log('   Ask the oracle a question. Each consultation is an epoch.');
  console.log('   Tip: Be specific. "What is..." vs "Should I..."');
  console.log('');
  console.log('📖 [2] View Epoch History');
  console.log('   See all previous consultations with this soul');
  console.log('');
  console.log('📊 [3] Soul Statistics');
  console.log('   View averages, trends, and soul metadata');
  console.log('');
  if (isQuantumAvailable) {
    console.log('⚡ [Q] Toggle Quantum Mode');
    console.log(`   Current: ${quantumMode ? 'QUANTUM-ENHANCED' : 'DETERMINISTIC'}`);
    console.log('   Quantum adds AI predictions: harmony, trends, insights');
    console.log('');
  }
  console.log('🔙 [4] Return to Main Menu');
  console.log('   Go back without deleting soul');
  console.log('');
  console.log('═'.repeat(60));
  console.log('📏 ORACLE METRICS EXPLAINED:');
  console.log('   • Resonance: Connection strength (1-100%)');
  console.log('   • Clarity: Message precision (1-100%)');
  console.log('   • Flux: Change potential (1-100%)');
  console.log('   • Emergence: New pattern formation (1-100%)');
  if (quantumMode && isQuantumAvailable) {
    console.log('   • Harmony: AI-predicted system balance (1-100%)');
    console.log('   • Trend: Improving/declining/stable with confidence');
  }
  console.log('═'.repeat(60) + '\n');
}

function displayPatternLibrary() {
  console.log('\n🌌 PATTERN LIBRARY\n');
  console.log('═'.repeat(60));
  const patterns = [
    ['The Spiral', 'Cyclical growth, returning to center with wisdom'],
    ['The Mirror', 'Reflection, seeing yourself in the situation'],
    ['The Threshold', 'At the edge of transformation'],
    ['The Void', 'Emptiness that contains all potential'],
    ['The Bloom', 'Emergence, flowering of hidden growth'],
    ['The Anchor', 'Stability, grounding, foundation'],
    ['The Storm', 'Chaos, disruption, clearing the old'],
    ['The Seed', 'Beginning, potential waiting to sprout'],
    ['The River', 'Flow, movement, natural progression'],
    ['The Mountain', 'Challenge, achievement, perspective'],
    ['The Web', 'Interconnection, complexity, relationships'],
    ['The Flame', 'Transformation through fire, passion'],
    ['The Echo', 'Repetition, lessons returning, resonance'],
    ['The Door', 'Opportunity, choice, passage between worlds'],
    ['The Root', 'Foundation, ancestry, deep truth'],
    ['The Sky', 'Freedom, expansion, infinite possibility']
  ];
  
  patterns.forEach(([name, meaning]) => {
    console.log(`${name.padEnd(18)} — ${meaning}`);
  });
  console.log('═'.repeat(60) + '\n');
}

// ═══════════════════════════════════════════════════════════════
// 🎬 LOADING INDICATORS
// ═══════════════════════════════════════════════════════════════

function showLoading(message) {
  process.stdout.write(`\n${message}`);
}

function showLoadingDone() {
  process.stdout.write(' ✓\n');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════
// 🛡️ CONFIRMATION DIALOGS
// ═══════════════════════════════════════════════════════════════

async function confirm(rl, message) {
  const response = await question(rl, `${message} (y/n): `);
  return response.toLowerCase() === 'y' || response.toLowerCase() === 'yes';
}

function displayMenu() {
  console.log('\n┌─────────────────────────────────────┐');
  console.log('│  [1] Create New Soul                │');
  console.log('│  [2] Select Existing Soul           │');
  console.log('│  [3] List All Souls                 │');
  console.log('│  [4] Export Lineage (CSV)           │');
  console.log('│  [?] Help                           │');
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
  console.log(`│  [P] Pattern Library                │`);
  console.log(`│  [?] Help                           │`);
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
          console.log('⚠️  Question cannot be empty. Try asking something specific like:');
          console.log('   "What should I know about [situation]?"');
          console.log('   "How can I approach [challenge]?"');
          break;
        }
        
        const epochNumber = soul.epochs.length + 1;
        
        // Loading indicator
        if (quantumMode) {
          showLoading('🔮 Consulting oracle... ⚡ Enhancing with quantum layer...');
        } else {
          showLoading('🔮 Consulting oracle...');
        }
        
        const reading = await consultQuantumOracle(q, soul.seed, epochNumber, quantumMode);
        showLoadingDone();
        
        soul.epochs.push({
          number: epochNumber,
          question: q,
          timestamp: new Date().toISOString(),
          reading
        });
        
        soul.lastEpoch = soul.epochs[soul.epochs.length - 1].timestamp;
        
        displayReading(reading, epochNumber);
        
        // Save indicator
        process.stdout.write('💾 Saving...');
        saveSouls(soulRegistry, key);
        process.stdout.write(' ✓\n');
        break;
      }
      
      case 'q': {
        // Toggle quantum mode
        if (isQuantumAvailable) {
          quantumMode = !quantumMode;
          console.log(`\n⚡ Quantum Mode ${quantumMode ? 'ACTIVATED' : 'DEACTIVATED'}\n`);
          if (quantumMode) {
            console.log('💡 Quantum readings include harmony predictions, trends, and AI insights.');
          }
        } else {
          console.log('\n⚠️  Quantum Forge not available.');
          console.log('💡 To enable: Set PI_FORGE_PATH environment variable');
          console.log('   See OINIO-FORGE-INTEGRATION.md for details\n');
        }
        break;
      }
      
      case 'p': {
        // Pattern library
        displayPatternLibrary();
        break;
      }
      
      case '?':
      case 'h':
      case 'help': {
        // Help
        displaySoulHelp(quantumMode);
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
        console.log('═'.repeat(60));
        console.log(`  Created: ${soul.created}`);
        console.log(`  Total Epochs: ${soul.epochs.length}`);
        console.log(`  Last Epoch: ${soul.lastEpoch || 'Never'}`);
        
        if (soul.epochs.length > 0) {
          const avgResonance = soul.epochs.reduce((sum, e) => sum + e.reading.resonance, 0) / soul.epochs.length;
          const avgClarity = soul.epochs.reduce((sum, e) => sum + e.reading.clarity, 0) / soul.epochs.length;
          const avgFlux = soul.epochs.reduce((sum, e) => sum + e.reading.flux, 0) / soul.epochs.length;
          const avgEmergence = soul.epochs.reduce((sum, e) => sum + e.reading.emergence, 0) / soul.epochs.length;
          
          console.log(`  Avg Resonance: ${avgResonance.toFixed(1)}%`);
          console.log(`  Avg Clarity: ${avgClarity.toFixed(1)}%`);
          console.log(`  Avg Flux: ${avgFlux.toFixed(1)}%`);
          console.log(`  Avg Emergence: ${avgEmergence.toFixed(1)}%`);
          
          // Pattern distribution
          const patternCount = {};
          soul.epochs.forEach(e => {
            patternCount[e.reading.pattern] = (patternCount[e.reading.pattern] || 0) + 1;
          });
          const topPattern = Object.entries(patternCount).sort((a, b) => b[1] - a[1])[0];
          console.log(`  Most Common Pattern: ${topPattern[0]} (${topPattern[1]}x)`);
        } else {
          console.log('  No epochs yet. Ask your first question!');
        }
        console.log('═'.repeat(60) + '\n');
        break;
      }
      
      case '4': {
        // Return to main
        rl.close();
        return;
      }
      
      default:
        console.log(`⚠️  Invalid choice: "${choice}"`);
        console.log('💡 Enter 1-4, [Q] for quantum, [P] for patterns, or [?] for help\n');
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
    
    switch (choice.toLowerCase()) {
      case '1': {
        // Create new soul
        const name = await question(rl, '\n🌱 Soul name: ');
        if (!name) {
          console.log('⚠️  Name cannot be empty. Examples: "Alice", "Oracle", "Self"');
          break;
        }
        
        if (soulRegistry[name]) {
          console.log(`⚠️  Soul "${name}" already exists.`);
          console.log(`💡 Try: "${name}-2", "${name}_Alt", or "New_${name}"`);
          break;
        }
        
        showLoading('🌱 Creating soul...');
        const newSoul = createSoul(name);
        soulRegistry[name] = newSoul;
        saveSouls(soulRegistry, key);
        showLoadingDone();
        console.log(`✨ Soul "${name}" created with unique cryptographic seed.`);
        console.log(`💡 Each soul generates different readings for the same question.\n`);
        break;
      }
      
      case '2': {
        // Select soul
        const soulNames = Object.keys(soulRegistry);
        if (soulNames.length === 0) {
          console.log('\n⚠️  No souls exist yet.');
          console.log('💡 Create a soul first with option [1]\n');
          break;
        }
        
        console.log('\n🌌 Available Souls:\n');
        soulNames.forEach((name, idx) => {
          const soul = soulRegistry[name];
          console.log(`  [${idx + 1}] ${name.padEnd(20)} (${soul.epochs.length} epochs)`);
        });
        console.log();
        
        const soulChoice = await question(rl, '→ Select soul number (1-' + soulNames.length + '): ');
        const soulIndex = parseInt(soulChoice, 10) - 1;
        
        if (isNaN(soulIndex) || soulIndex < 0 || soulIndex >= soulNames.length) {
          console.log(`⚠️  Invalid selection. Please enter a number between 1 and ${soulNames.length}.\n`);
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
          console.log('\n⚠️  No souls exist yet.');
          console.log('💡 Create your first soul with option [1]\n');
        } else {
          console.log('\n🌌 Soul Registry:\n');
          console.log('═'.repeat(60));
          souls.forEach(soul => {
            const totalEpochs = soul.epochs.length;
            const avgResonance = totalEpochs > 0 
              ? (soul.epochs.reduce((sum, e) => sum + e.reading.resonance, 0) / totalEpochs).toFixed(1)
              : 'N/A';
            
            console.log(`  • ${soul.name}`);
            console.log(`    Created: ${soul.created.substring(0, 10)}`);
            console.log(`    Epochs: ${totalEpochs} | Avg Resonance: ${avgResonance}%`);
            console.log(`    Last: ${soul.lastEpoch ? soul.lastEpoch.substring(0, 10) : 'Never'}`);
            console.log();
          });
          console.log('═'.repeat(60));
          console.log(`Total: ${souls.length} soul${souls.length === 1 ? '' : 's'}, ${souls.reduce((sum, s) => sum + s.epochs.length, 0)} epoch${souls.reduce((sum, s) => sum + s.epochs.length, 0) === 1 ? '' : 's'}\n`);
        }
        break;
      }
      
      case '4': {
        // Export lineage
        showLoading('📜 Exporting lineage to CSV...');
        exportLineageToCSV(soulRegistry);
        showLoadingDone();
        break;
      }
      
      case '?':
      case 'h':
      case 'help': {
        // Help
        displayMainHelp();
        break;
      }
      
      case '5': {
        // Exit with confirmation
        const shouldExit = await confirm(rl, '\n🚪 Exit OINIO?');
        if (shouldExit) {
          console.log('\n🌾 The pattern persists. Farewell.\n');
          console.log('💾 All data saved to: ' + SOULS_FILE);
          rl.close();
          return;
        }
        break;
      }
      
      default:
        console.log(`⚠️  Invalid choice: "${choice}"`);
        console.log('💡 Enter 1-5, or [?] for help\n');
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