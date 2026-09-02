# Midnight Confidential Credential Verifier
[![CI](https://github.com/kartikbotre/midnight-credential-verifier/actions/workflows/ci.yml/badge.svg)](https://github.com/kartikbotre/midnight-credential-verifier/actions/workflows/ci.yml)
> Privacy-preserving zero-knowledge age and credential verification dApp built on Midnight Network.

## Live Demo
[https://midnight-credential-verifier.vercel.app](https://midnight-credential-verifier.vercel.app)

## Contract Address
| Network  | Address                              |
|----------|--------------------------------------|
| Preprod  | `0x7b9a2c1f4eec91b800fe9d32afc4d7675d3e4700` |

## What This Product Does
In traditional web and Web3 ecosystems, proving age eligibility (such as for 18+ services, regulated gaming, or digital identity gates) requires users to disclose sensitive personal documents, passports, or exact birth dates. Storing and transmitting this Personally Identifiable Information (PII) creates severe security vulnerabilities, data leaks, and compliance burdens for platform operators.

The **Midnight Confidential Credential Verifier** solves this by leveraging Midnight's native zero-knowledge smart contract architecture. Users can cryptographically prove that they meet an eligibility or age threshold (e.g. `age >= 18`) directly on their local device.

Built on Midnight's Compact language, the smart contract verifies the zero-knowledge assertion and atomically increments an on-chain verification counter on the Midnight Preprod ledger, without ever receiving or recording the user's birth year, personal credentials, or private passkeys.

## Privacy Model
- **What is PUBLIC (on-chain, anyone can see):**
  - The minimum required age threshold parameter (`minRequiredAge`).
  - The global aggregate counter of verified users (`totalVerifiedUsers`).
  - The contract owner's public identifier (`contractOwner`).
  - The cryptographic ZK proof hash confirming valid circuit execution.
- **What is PRIVATE (private witness, never on-chain):**
  - The user's exact birth year (`secretBirthYear`).
  - The user's identity secret entropy / passkey (`userSecretHash`).
- **What the user PROVES without revealing:**
  - That `(currentYear - secretBirthYear) >= minRequiredAge` holds true at the time of proof generation, without revealing `secretBirthYear` or user identity.

## Tech Stack
- **Smart Contract Language**: Midnight Compact (`contracts/credential-verifier.compact`)
- **Frontend Framework**: React 18, TypeScript, Vite
- **Icons & Styling**: Lucide React, Modern Vanilla CSS Design System
- **Wallet Integration**: 1AM Wallet, Lace Wallet (Midnight Preprod Edition)
- **Testing**: Node.js Native Test Runner (`node:test`, `node:assert`)
- **CI/CD Pipeline**: GitHub Actions (Node.js 22, Compact Compiler, Automated Tests)

## Prerequisites
- **Midnight Wallet**: [1AM Wallet](https://github.com/midnight-ntwrk) or [Lace Wallet](https://www.lace.io/) (Midnight Preprod Edition)
- **Node.js**: v22.x or higher
- **Package Manager**: npm v10.x or higher
- **Docker**: Optional, for running local Midnight sandbox nodes

## Setup & Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/kartikbotre/midnight-credential-verifier.git
   cd midnight-credential-verifier
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the Compact contract:
   ```bash
   npm run compact
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Run Tests
Execute the automated unit test suite:
```bash
npm test
```

## CI/CD
The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to the `main` branch and on pull requests. It performs a complete checkout, installs Node.js v22, compiles the Compact contract (`npm run compact`), executes the unit test suite (`npm test`), and builds the production frontend (`npm run build`).

## Usage Guide
See [docs/USAGE.md](docs/USAGE.md) for a complete step-by-step user guide and troubleshooting tips.

## Product X Profile
[@MidnightVerifier](https://x.com/MidnightVerifier) <!-- PLACEHOLDER — Update with your created X profile handle -->
