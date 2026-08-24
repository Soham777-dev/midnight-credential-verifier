# Midnight Confidential Credential Verifier
![CI](https://github.com/Soham777-dev/midnight-credential-verifier/actions/workflows/ci.yml/badge.svg)
> Privacy-preserving zero-knowledge age and credential verification dApp built on Midnight Network.

## Live Demo
[https://midnight-credential-verifier-c2xkfwx1s-sohamdev.vercel.app/](https://midnight-credential-verifier-c2xkfwx1s-sohamdev.vercel.app/)

## Demo Video
[Watch Demo Video](https://drive.google.com/file/d/1gTO8L2lRXJF93XILd0hfG4chTb4ALRuG/view?usp=sharing)

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preprod  | `0x7b9a2c1f4e3d8a901b2c3d4e5f6a7b8c9d0e1f2a` |

## What This Does
This application enables users to generate zero-knowledge proofs (ZK-SNARKs) verifying that they satisfy age and credential criteria (e.g., age &ge; 18) without disclosing their exact birth year, date of birth, or secret identity credentials to the public ledger or any third party.

## Privacy Model
- PUBLIC: Minimum age threshold (`minRequiredAge`) and total count of verified users (`totalVerifiedUsers`) stored transparently on the Midnight ledger.
- PRIVATE: User birth year (`secretBirthYear`) and identity secret hash (`userSecretHash`) processed locally as private witness inputs.
- PROVED without revealing: That `(currentYear - secretBirthYear) >= minRequiredAge` holds true without disclosing `secretBirthYear` or user identity.

## Privacy Claim
On-chain observers and external entities see only the public ledger state updates (`totalVerifiedUsers` counter incrementing) and valid zero-knowledge proofs. They cannot derive, reconstruct, or see the user's birth year or secret passkey.

## Tech Stack
- **Smart Contract**: Midnight Compact Language (`contract/index.compact`)
- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS
- **Testing**: Vitest
- **CI/CD**: GitHub Actions (Node.js 22, Compact Compiler, Automated Testing)

## Prerequisites
- Node.js v22 or higher
- npm v10 or higher

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
4. Start local development server:
   ```bash
   npm run dev
   ```

## Run Tests
```
npm test
```

## CI/CD
The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically triggers on every push to the `main` branch and on all pull requests. It sets up Node.js v22, installs dependencies, compiles the Compact smart contract using `npm run compact`, and executes the automated unit test suite using `npm test`.

## Product Proposal
See PROPOSAL.md
