# How to Use Midnight Confidential Credential Verifier

Welcome to the **Midnight Confidential Credential Verifier**! This guide walks you through verifying your age or eligibility threshold using zero-knowledge proofs on the Midnight Network without exposing your private birth date or identity credentials.

---

## What You Need

Before interacting with the application on the Midnight Preprod Network, ensure you have:

1. **A Supported Web Browser**: Google Chrome, Brave, or Microsoft Edge.
2. **A Midnight-Compatible Wallet**:
   - **1AM Wallet** extension OR
   - **Lace Wallet (Midnight Preview/Preprod edition)** extension.
3. **Preprod Testnet Funds**:
   - Testnet NIGHT / tDUST tokens (automatically available via the Midnight Preprod Faucet or sponsored transactions).
4. **Internet Connection**: To communicate with Midnight Preprod indexers and nodes.

---

## Step-by-Step Guide

Follow these simple steps to generate and verify your cryptographic eligibility proof:

### Step 1: Connect Your Wallet
1. Open the DApp in your browser (e.g. `http://localhost:5173` or your live URL).
2. Click the **"Connect Midnight Wallet"** button located at the top-right corner.
3. In your **1AM** or **Lace** wallet extension popup, authorize the connection request.
4. Your connected Midnight Shielded address (`mn_shield_addr_preview1...`) will appear in the top navigation bar.

### Step 2: Enter Your Private Inputs
1. Locate the **"Execute ZK Proof Circuit"** panel on the left.
2. In **"Secret Birth Year"**, enter your actual year of birth (e.g., `2000`).
3. In **"Identity Secret Passkey"**, enter your unique private passkey or entropy hash (e.g., `0x_my_private_passkey_99`).
4. Notice the **"Required Age Threshold"** field, which displays the public contract condition (e.g., `18 Years Old (Minimum)`).

### Step 3: Generate and Verify the Zero-Knowledge Proof
1. Click the **"Generate & Verify ZK Proof"** button.
2. Observe the multi-stage proof progression:
   - **Stage 1**: Reading private witness inputs in local memory.
   - **Stage 2**: Constructing the client-side Zero-Knowledge proof circuit.
   - **Stage 3**: Submitting the generated proof to the Midnight Preprod ledger.
3. Your wallet may request a signature confirmation—click **Approve** or **Sign**.

### Step 4: Review the Verified Output
1. Upon successful verification, a green confirmation card will appear showing:
   - **Proof Hash**: Your unique on-chain ZK verification transaction identifier (`0xzk_...`).
   - **Private Data Revealed**: Confirms `NONE (witness concealed)`.
2. The **"Public Ledger State"** on the right will update, incrementing the **"Total Verified Users"** counter in real time.

---

## What Gets Proved (and What Stays Private)

| Information Item | Classification | Who Sees It? |
| :--- | :--- | :--- |
| **Your Exact Birth Year** | 🔒 **PRIVATE WITNESS** | **No one** (Computed exclusively on your device) |
| **Your Secret Passkey / Key** | 🔒 **PRIVATE WITNESS** | **No one** (Never leaves local browser memory) |
| **Condition: `age >= minRequiredAge`** | ⚡ **PROVED STATEMENT** | **Midnight Network Validators & Ledger** |
| **Verification Proof Hash** | 🌐 **PUBLIC ON-CHAIN** | **Everyone** (Verifies valid execution) |
| **Total Verified Users Counter** | 🌐 **PUBLIC ON-CHAIN** | **Everyone** (Global ledger state) |
| **Contract Threshold (`minRequiredAge`)** | 🌐 **PUBLIC ON-CHAIN** | **Everyone** (Global ledger state) |

---

## Troubleshooting

### 1. "Wallet connection rejected or popup was closed"
- **Solution**: Open your 1AM or Lace extension, ensure it is unlocked, and click **Connect Midnight Wallet** again. If testing in an incognito window, ensure extension permissions are enabled for private browsing.

### 2. "Zero-Knowledge Assertion Failed: User does not meet minimum required age threshold"
- **Solution**: Ensure the entered birth year satisfies `(Current Year - Birth Year) >= Minimum Age` (e.g., for threshold 18 in 2026, birth year must be 2008 or earlier).

### 3. "DApp connected in Simulator Mode"
- **Solution**: If 1AM or Lace wallet extension is not detected in your browser, the DApp automatically switches to Preprod Testnet Simulator Mode so you can still preview and test the complete ZK workflow.

---

*Need additional support? Visit the [Midnight Developer Hub](https://docs.midnight.network) or open an issue on our GitHub repository.*
