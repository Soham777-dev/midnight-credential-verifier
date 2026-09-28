# Midnight Confidential Credential Verifier
[![CI](https://github.com/Soham777-dev/midnight-credential-verifier/actions/workflows/ci.yml/badge.svg)](https://github.com/Soham777-dev/midnight-credential-verifier/actions/workflows/ci.yml)
> Privacy-preserving zero-knowledge age and credential verification dApp built on Midnight Network.

## Live Demo & Resources
- **Live DApp**: [https://midnight-credential-verifier.vercel.app](https://midnight-credential-verifier.vercel.app)
- **Demo Video**: [Watch Level 4 MVP Demo Walkthrough](https://drive.google.com/file/d/1DFX42thl8QfA0Ot1n1K7gE05U7skPtE9/view?usp=sharing)
- **Product X Profile**: [@MidnightVerifier](https://x.com/MidnightVerifier)

## Contract Address & Deployment
| Parameter | Value |
|-----------|-------|
| **Network** | Midnight Preprod |
| **Contract Address** | [`ba24c6846abeab7ec401ce86bf4598372a59f7d1d0c91bca9372aa2649e8ec64`](https://explorer.preprod.midnight.network/contract/ba24c6846abeab7ec401ce86bf4598372a59f7d1d0c91bca9372aa2649e8ec64) |
| **Deploy Tx Hash** | `4d2153aa140d9c81dabd9cdad1748dc7bf71d6eb7e1ecd1663774b5b63c60743` |
| **Deploy Block** | `2,745,227` |
| **Deployer Address** | `mn_addr_preprod1z98vzn0mmc8u57q9eu24mctufk5u56sxnc3yle7mhfjs03yypjtq7llaed` |
| **Status** | Verified & Active on Preprod |

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
   git clone https://github.com/Soham777-dev/midnight-credential-verifier.git
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
