/**
 * Midnight Preprod Contract Deployment Script
 * -------------------------------------------
 * Deploys the CredentialVerifier contract to Midnight Preprod Testnet.
 * Uses the subproject's node_modules where Midnight SDK packages are installed.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const rootDir    = path.resolve(__dirname, '..');
const subDir     = path.join(rootDir, 'MidnightConfidentialCredentialVerifier');

// Default seed if not passed via arguments
let args = process.argv.slice(2);
if (!args.includes('--seed') && !args.includes('-s')) {
  const defaultSeed = process.env.MIDNIGHT_PREPROD_SEED || 'wear display shiver error laugh word problem color exit kick deer negative evolve hour noodle amateur crunch essence number wool have weird side habit';
  args = ['--seed', defaultSeed, ...args];
}

const child = spawn('node', ['scripts/deploy.mjs', ...args], {
  cwd: subDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    PATH: `${process.env.HOME}/.local/bin:${process.env.PATH || ''}`
  }
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
