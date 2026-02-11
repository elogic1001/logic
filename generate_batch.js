const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const KEY_COUNT = 500; // Number of keys to generate
const OUTPUT_KEYS_FILE = path.join(__dirname, '..', 'master_keys.txt');
const OUTPUT_DB_FILE = path.join(__dirname, '..', 'js', 'offline_db.js');

function generateKey() {
    // Format: XXXX-XXXX-XXXX-XXXX
    const p = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${p()}-${p()}-${p()}-${p()}`;
}

function sha256(message) {
    return crypto.createHash('sha256').update(message).digest('hex');
}

console.log(`Generating ${KEY_COUNT} keys...`);

const keys = [];
const hashes = [];

for (let i = 0; i < KEY_COUNT; i++) {
    const key = generateKey();
    const hash = sha256(key);
    
    keys.push(key);
    hashes.push(hash);
}

// 1. Save Keys for the Admin (Plain Text)
const keysContent = `
==============================================
LOGIC SIMULATOR PRO - MASTER KEY LIST
Generated on: ${new Date().toLocaleString()}
Count: ${KEY_COUNT}
==============================================
${keys.join('\n')}
`;

fs.writeFileSync(OUTPUT_KEYS_FILE, keysContent);
console.log(`[+] Keys saved to: ${OUTPUT_KEYS_FILE}`);

// 2. Save Hashes for the App (Javascript File)
const dbContent = `// Logic Simulator Pro - Offline Database
// Generated: ${new Date().toLocaleString()}
// This file contains hashed keys for offline activation.

const OFFLINE_DB = [
${hashes.map(h => `    "${h}"`).join(',\n')}
];

// تصدير للمتصفح (Global) وللـ Node.js
if (typeof module !== 'undefined') {
    module.exports = OFFLINE_DB;
} else {
    window.OFFLINE_DB = OFFLINE_DB;
}
`;

fs.writeFileSync(OUTPUT_DB_FILE, dbContent);
console.log(`[+] Database saved to: ${OUTPUT_DB_FILE}`);

console.log('Done!');
