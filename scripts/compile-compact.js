/**
 * Midnight Compact Smart Contract Compiler Script
 * --------------------------------------------------
 * Compiles contracts/credential-verifier.compact using the Midnight Compact compiler CLI.
 * Generates ZK circuits, proving keys, and TypeScript/JavaScript contract bindings.
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const rootDir    = path.resolve(__dirname, '..');

const contractPath  = path.join(rootDir, 'contracts', 'credential-verifier.compact');
const rootManagedDir = path.join(rootDir, 'managed', 'contract');

console.log('🔄  Compiling Midnight Compact smart contract...');
console.log(`📄  Source : ${contractPath}`);
console.log(`📦  Target : ${rootManagedDir}`);

if (!fs.existsSync(contractPath)) {
  console.error(`❌  Compact contract source not found at ${contractPath}`);
  process.exit(1);
}

const env = {
  ...process.env,
  PATH: `${process.env.HOME}/.local/bin:${process.env.PATH || ''}`
};

try {
  execSync(`compact compile "${contractPath}" "${rootManagedDir}"`, {
    stdio: 'inherit',
    cwd: rootDir,
    env
  });
  console.log('✅  Compact contract compiled successfully with real ZK proving keys and circuit IR!');
} catch (err) {
  console.error('❌  Compilation failed:', err.message);
  process.exit(1);
}
