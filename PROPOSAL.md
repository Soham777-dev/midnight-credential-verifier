# Product Proposal

## What is the product, and who uses it?
The **Midnight Confidential Credential Verifier** is a privacy-preserving digital identity & age verification DApp built on the Midnight Network. 

**Target Users:**
- **Web3 Users & Digital Citizens**: Individuals who need to verify age or eligibility (e.g. 18+ for age-restricted services, token sales, or gaming platforms) without exposing sensitive Personally Identifiable Information (PII) such as exact date of birth, passport details, or secret identity keys.
- **DApps & Service Providers**: Platforms requiring regulatory compliance or threshold checks that want to eliminate liability associated with storing sensitive user data.

---

## Why Midnight specifically?
Traditional transparent blockchains (e.g., Ethereum, Cardano) require all transaction arguments and state variables to be publicly visible on-chain. On a public ledger, proving age eligibility means either revealing the birth date on-chain—compromising user privacy—or relying on trusted third-party centralized Oracles.

**Midnight solves this fundamentally through:**
1. **Compact Smart Contracts**: Enables writing zero-knowledge circuits directly into application logic.
2. **Private Witness Computation**: The user's birth year and private identity secret remain strictly local on the client device inside a zero-knowledge witness.
3. **Selective Disclosure**: Midnight's public ledger receives only the cryptographic ZK proof and updates public state (`totalVerifiedUsers`), keeping the private data completely invisible to validators, observers, and third parties.

---

## Data Model
| Data Point | Type | Disclosed To |
|---|---|---|
| `minRequiredAge` | Public ledger | Everyone (On-chain threshold) |
| `totalVerifiedUsers` | Public ledger | Everyone (On-chain counter) |
| `contractOwner` | Public ledger | Everyone (On-chain owner address) |
| `secretBirthYear` | Private witness | No one (Processed locally in ZK circuit) |
| `userSecretHash` | Private witness | No one (Processed locally in ZK circuit) |
| `proofHash` | Public proof | Everyone (Verifies statement without revealing witness) |

---

## Mainnet Feasibility
**Yes, highly realistic to reach Mainnet by Level 6.**

**Feasibility Rationale:**
- **Low Computational Complexity**: The eligibility circuit uses basic arithmetic comparison (`currentYear - secretBirthYear >= minRequiredAge`), which generates lightweight ZK-SNARK proofs with minimal prover time (<1s on standard devices).
- **Client-Side Scalability**: Private witness calculation occurs on the client, minimizing on-chain gas costs and storage overhead.
- **Production Readiness**: The architecture decouples private witness generation from public state transitions, making it directly deployable on Midnight Preprod and mainnet environments without infrastructure modifications.
