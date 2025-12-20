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
const { PATTERNS, MESSAGES, generateDeterministicReading, displayReading: displayReadingShared } = require('./oinio-shared');

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
  return generateDeterministicReading(question, seed, epochNumber);
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

// ═══════════════════════════════════════════════════════════════
// 📝 ENHANCED INPUT SYSTEM
// ═══════════════════════════════════════════════════════════════

/**
 * Enhanced question prompt with examples and validation
 */
async function askQuestion(rl, type = 'general') {
  const examples = {
    general: [
      'What should I know about [situation]?',
      'How can I approach [challenge]?',
      'What is the nature of [concept]?',
      'Where am I in my journey with [topic]?',
      'What does [symbol/dream] mean for me?'
    ],
    decision: [
      'Should I pursue [opportunity]?',
      'What awaits if I choose [path]?',
      'Is now the time for [action]?'
    ],
    insight: [
      'What am I not seeing about [situation]?',
      'What lesson is [challenge] teaching me?',
      'What truth am I avoiding?'
    ]
  };
  
  console.log('\n🌾 Ask your question to the oracle:\n');
  console.log('💡 Examples:');
  const exampleList = examples[type] || examples.general;
  exampleList.slice(0, 3).forEach(ex => {
    console.log(`   "${ex}"`);
  });
  console.log('\n💬 Your question (press Enter when done):');
  console.log('   Type "?" for more examples or "cancel" to go back\n');
  
  const q = await question(rl, '→ ');
  
  if (q === '?') {
    console.log('\n📖 More Question Examples:\n');
    Object.values(examples).flat().forEach((ex, idx) => {
      if (idx < 10) console.log(`   ${idx + 1}. ${ex}`);
    });
    console.log();
    return askQuestion(rl, type);
  }
  
  if (q.toLowerCase() === 'cancel') {
    return null;
  }
  
  if (!q) {
    console.log('\n⚠️  Question cannot be empty.');
    console.log('💡 A good question is specific and personal.');
    console.log('   Try: "What should I know about my current situation?"\n');
    return askQuestion(rl, type);
  }
  
  if (q.length < 5) {
    console.log('\n⚠️  Question seems too short.');
    console.log('💡 Be more specific for better oracle guidance.\n');
    const retry = await question(rl, 'Use this question anyway? (y/n): ');
    if (retry.toLowerCase() !== 'y') {
      return askQuestion(rl, type);
    }
  }
  
  return q;
}

/**
 * Enhanced soul name input with validation
 */
async function askSoulName(rl, existingNames = []) {
  console.log('\n🌱 Create a new soul:\n');
  console.log('💡 Soul names can be:');
  console.log('   • Your name or nickname');
  console.log('   • A concept ("Oracle", "Guide", "Shadow")');
  console.log('   • Someone you want to understand');
  console.log('   • A project or situation');
  console.log('\n💬 Each soul has a unique cryptographic seed.');
  console.log('   Same question to different souls = different answers\n');
  
  const name = await question(rl, '→ Soul name: ');
  
  if (!name) {
    console.log('\n⚠️  Name cannot be empty.');
    console.log('💡 Examples: "Alice", "Oracle", "Self", "Dream Guide"\n');
    return askSoulName(rl, existingNames);
  }
  
  if (existingNames.includes(name)) {
    console.log(`\n⚠️  Soul "${name}" already exists.`);
    console.log('💡 Suggestions:');
    console.log(`   • ${name}-2`);
    console.log(`   • ${name}_Alt`);
    console.log(`   • New_${name}`);
    console.log(`   • ${name}_${new Date().getFullYear()}\n`);
    return askSoulName(rl, existingNames);
  }
  
  if (name.length > 50) {
    console.log('\n⚠️  Name too long (max 50 characters).');
    console.log(`💡 Your name is ${name.length} characters.\n`);
    return askSoulName(rl, existingNames);
  }
  
  return name;
}

/**
 * Enhanced passphrase input with guidance
 */
async function askPassphrase(rl, isFirstTime = false) {
  if (isFirstTime) {
    console.log('\n🔐 Set your master passphrase:\n');
    console.log('💡 This encrypts all your soul data.');
    console.log('   • Use a memorable phrase');
    console.log('   • Minimum 8 characters recommended');
    console.log('   • Cannot be recovered if forgotten!\n');
  } else {
    console.log();
  }
  
  const passphrase = await question(rl, '🔐 Passphrase: ');
  
  if (!passphrase) {
    console.log('\n❌ Passphrase required.');
    console.log('💡 This encrypts your data. Choose something memorable.\n');
    return null;
  }
  
  if (isFirstTime && passphrase.length < 8) {
    console.log('\n⚠️  Passphrase is short (less than 8 characters).');
    const proceed = await question(rl, 'Use this passphrase anyway? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      return askPassphrase(rl, isFirstTime);
    }
  }
  
  return passphrase;
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
  displayReadingShared(reading, epochNumber);
}

// ═══════════════════════════════════════════════════════════════
// 💬 SMART QUESTION PROMPTING
// ═══════════════════════════════════════════════════════════════

function displayQuestionExamples() {
  console.log('\n💡 Example Questions:\n');
  console.log('📍 GUIDANCE:');
  console.log('  • "What should I know about [situation]?"');
  console.log('  • "How can I approach [challenge]?"');
  console.log('  • "What is the nature of [concept]?"\n');
  
  console.log('🔮 DECISION:');
  console.log('  • "Should I pursue [opportunity]?"');
  console.log('  • "What happens if I choose [option]?"');
  console.log('  • "Is this the right time for [action]?"\n');
  
  console.log('🌱 GROWTH:');
  console.log('  • "What am I meant to learn from [experience]?"');
  console.log('  • "How can I grow through [difficulty]?"');
  console.log('  • "What pattern am I repeating?"\n');
  
  console.log('🔗 RELATIONSHIPS:');
  console.log('  • "What does [person] need from me?"');
  console.log('  • "How can I improve [relationship]?"');
  console.log('  • "What is the truth about [connection]?"\n');
  
  console.log('💡 Tip: Be specific. The oracle responds to clarity.\n');
}

async function askQuestion(rl, context = 'general') {
  console.log('\n🌾 Ask your question:');
  console.log('   (Type ? for examples, or press Enter to cancel)\n');
  
  const q = await question(rl, '→ ');
  
  if (q === '?' || q.toLowerCase() === 'help') {
    displayQuestionExamples();
    return await askQuestion(rl, context);
  }
  
  if (!q) {
    return null;
  }
  
  // Validate question quality
  if (q.length < 5) {
    console.log('\n⚠️  Question too short. Try being more specific.');
    console.log('   Example: "What should I know about my current path?"\n');
    return await askQuestion(rl, context);
  }
  
  return q;
}

function displaySoulNameSuggestions() {
  console.log('\n💡 Soul Name Ideas:\n');
  console.log('👤 PERSONAL:');
  console.log('  • Your name ("Alice", "Bob")');
  console.log('  • "Self", "True Self", "Higher Self"\n');
  
  console.log('🎭 ARCHETYPES:');
  console.log('  • "Oracle", "Guide", "Sage"');
  console.log('  • "Shadow", "Light", "Balance"\n');
  
  console.log('🌐 ASPECTS:');
  console.log('  • "Creative", "Logical", "Emotional"');
  console.log('  • "Past", "Present", "Future"\n');
  
  console.log('👥 RELATIONSHIPS:');
  console.log('  • Person names ("Mom", "Partner")');
  console.log('  • "Family", "Work", "Friends"\n');
  
  console.log('🤖 AI ENTITIES:');
  console.log('  • "Claude", "GPT", "Gemini"');
  console.log('  • "Assistant", "Copilot", "Oracle AI"\n');
}

async function createSoulWithHelp(rl, soulRegistry) {
  console.log('\n🌱 Create a new soul:');
  console.log('   Each soul has a unique cryptographic seed.');
  console.log('   The same question to different souls = different readings.\n');
  console.log('   Type ? for name ideas, or Enter to cancel\n');
  
  const name = await question(rl, '→ Soul name: ');
  
  if (name === '?' || name.toLowerCase() === 'help') {
    displaySoulNameSuggestions();
    return await createSoulWithHelp(rl, soulRegistry);
  }
  
  if (!name) {
    return null;
  }
  
  if (soulRegistry[name]) {
    console.log(`\n⚠️  Soul "${name}" already exists.`);
    console.log(`💡 Try: "${name}-2", "${name}_Alt", or "New_${name}"\n`);
    return await createSoulWithHelp(rl, soulRegistry);
  }
  
  return name;
}

// ═══════════════════════════════════════════════════════════════
// 🌊 MAIN RITUAL FLOW
// ═══════════════════════════════════════════════════════════════

async function runSoulMenu(soul, soulRegistry, key) {
  const rl = createInterface();
  let quantumMode = false;
  
  // First-time tip
  if (soul.epochs.length === 0) {
    console.log('\n💡 First consultation with this soul!');
    console.log('   Each soul generates unique readings based on its cryptographic seed.');
    console.log('   The same question asked twice will give the same answer (deterministic).\n');
  }
  
  while (true) {
    displaySoulMenu(soul, quantumMode);
    const choice = await question(rl, '→ ');
    
    switch (choice.toLowerCase()) {
      case '1': {
        // New Epoch
        const q = await askQuestion(rl, 'general');
        if (!q) {
          console.log('↩️  Returning to soul menu...\n');
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
        
        console.log('💡 Tip: Ask the same question again later to see how your path evolves.\n');
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
  const isFirstTime = !fileExists(SOULS_FILE);
  const passphrase = await askPassphrase(rl, isFirstTime);
  if (!passphrase) {
    console.log('❌ Cannot proceed without passphrase. Exiting.\n');
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
  
  // First-run welcome
  const soulCount = Object.keys(soulRegistry).length;
  if (soulCount === 0) {
    console.log('🌟 Welcome to OINIO!\n');
    console.log('💡 Quick Start:');
    console.log('   1. Create your first soul (option 1)');
    console.log('   2. Give it a name (e.g., "Self", "Oracle", your name)');
    console.log('   3. Select the soul (option 2)');
    console.log('   4. Ask your first question\n');
    console.log('📚 Press [?] at any menu for detailed help\n');
  } else {
    console.log(`📊 Registry: ${soulCount} soul${soulCount === 1 ? '' : 's'} | Press [?] for help\n`);
  }
  
  // Main menu loop
  while (true) {
    displayMenu();
    const choice = await question(rl, '→ ');
    
    switch (choice.toLowerCase()) {
      case '1': {
        // Create new soul
        const name = await askSoulName(rl, Object.keys(soulRegistry));
        if (!name) {
          break;
        }
        
        showLoading('🌱 Creating soul...');
        const newSoul = createSoul(name);
        soulRegistry[name] = newSoul;
        saveSouls(soulRegistry, key);
        showLoadingDone();
        console.log(`\n✨ Soul "${name}" created with unique cryptographic seed.`);
        console.log(`💡 Same question to different souls = different answers.`);
        console.log(`📖 Use option [2] to consult this soul.\n`);
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