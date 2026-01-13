#!/usr/bin/env node

/**
 * Verification test for commit 55a802589d9963dc1cdcddc7851c3998d2595e8e
 * Tests CLI flags and shared constant implementation
 */

const { execSync } = require('child_process');
const assert = require('assert');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════');
console.log('🧪 OINIO Soul System - Verification Test Suite');
console.log('   Testing commit 55a80258: CLI flags + shared constants');
console.log('═══════════════════════════════════════════════════════════════\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (err) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${err.message}`);
    testsFailed++;
  }
}

// Test 1: CLI --version flag
test('CLI --version flag works', () => {
  const output = execSync('node oinio-system.js --version').toString();
  assert(output.includes('OINIO Soul System v1.3.0'));
  assert(output.includes('Resonance Eternal'));
});

// Test 2: CLI -v flag (short version)
test('CLI -v flag works', () => {
  const output = execSync('node oinio-system.js -v').toString();
  assert(output.includes('v1.3.0'));
});

// Test 3: CLI --help flag
test('CLI --help flag works', () => {
  const output = execSync('node oinio-system.js --help').toString();
  assert(output.includes('USAGE:'));
  assert(output.includes('OPTIONS:'));
  assert(output.includes('--version'));
  assert(output.includes('--help'));
});

// Test 4: CLI -h flag (short help)
test('CLI -h flag works', () => {
  const output = execSync('node oinio-system.js -h').toString();
  assert(output.includes('USAGE:'));
});

// Test 5: Shared module exports
test('oinio-shared.js exports constants and functions', () => {
  const shared = require(path.join(__dirname, 'oinio-shared.js'));
  assert(Array.isArray(shared.PATTERNS));
  assert(shared.PATTERNS.length === 16);
  assert(Array.isArray(shared.MESSAGES));
  assert(shared.MESSAGES.length === 16);
  assert(typeof shared.generateDeterministicReading === 'function');
  assert(typeof shared.displayReading === 'function');
});

// Test 6: Config module exports VERSION
test('config.js exports VERSION', () => {
  const config = require(path.join(__dirname, 'config.js'));
  assert(config.VERSION === '1.3.0');
});

// Test 7: No duplicate PATTERNS in oinio-system.js
test('No duplicate PATTERNS constant in oinio-system.js', () => {
  const fs = require('fs');
  const content = fs.readFileSync('oinio-system.js', 'utf8');
  // Should only have the import, not a definition
  // Use flexible regex to catch different coding styles
  const matches = content.match(/(?:const|let|var)\s+PATTERNS\s*=\s*\[/g);
  assert(matches === null || matches.length === 0);
});

// Test 8: No duplicate MESSAGES in oinio-system.js
test('No duplicate MESSAGES constant in oinio-system.js', () => {
  const fs = require('fs');
  const content = fs.readFileSync('oinio-system.js', 'utf8');
  // Use flexible regex to catch different coding styles
  const matches = content.match(/(?:const|let|var)\s+MESSAGES\s*=\s*\[/g);
  assert(matches === null || matches.length === 0);
});

// Test 9: No duplicate PATTERNS in oinio-forge-bridge.js
test('No duplicate PATTERNS constant in oinio-forge-bridge.js', () => {
  const fs = require('fs');
  const content = fs.readFileSync('oinio-forge-bridge.js', 'utf8');
  // Use flexible regex to catch different coding styles
  const matches = content.match(/(?:const|let|var)\s+PATTERNS\s*=\s*\[/g);
  assert(matches === null || matches.length === 0);
});

// Test 10: No duplicate MESSAGES in oinio-forge-bridge.js
test('No duplicate MESSAGES constant in oinio-forge-bridge.js', () => {
  const fs = require('fs');
  const content = fs.readFileSync('oinio-forge-bridge.js', 'utf8');
  // Use flexible regex to catch different coding styles
  const matches = content.match(/(?:const|let|var)\s+MESSAGES\s*=\s*\[/g);
  assert(matches === null || matches.length === 0);
});

// Test 11: System uses shared constants
test('oinio-system.js imports from oinio-shared', () => {
  const fs = require('fs');
  const content = fs.readFileSync('oinio-system.js', 'utf8');
  assert(content.includes("require('./oinio-shared')"));
});

// Test 12: Bridge uses shared constants
test('oinio-forge-bridge.js imports from oinio-shared', () => {
  const fs = require('fs');
  const content = fs.readFileSync('oinio-forge-bridge.js', 'utf8');
  assert(content.includes("require('./oinio-shared')"));
});

// Test 13: Oracle functionality works with shared constants
test('Oracle generates readings with shared constants', () => {
  const system = require(path.join(__dirname, 'oinio-system.js'));
  const shared = require(path.join(__dirname, 'oinio-shared.js'));
  
  const soul = system.createSoul('TestSoul');
  const reading1 = system.consultOracle('Test?', soul.seed, 1);
  const reading2 = shared.generateDeterministicReading('Test?', soul.seed, 1);
  
  assert(reading1.pattern === reading2.pattern);
  assert(reading1.resonance === reading2.resonance);
  assert(reading1.message === reading2.message);
});

// Summary
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`Results: ${testsPassed} passed, ${testsFailed} failed`);
console.log('═══════════════════════════════════════════════════════════════');

if (testsFailed > 0) {
  process.exit(1);
}

console.log('\n✅ All verification tests passed!');
console.log('   Commit 55a80258 changes are working correctly.\n');
