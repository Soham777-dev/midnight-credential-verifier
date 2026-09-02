import { CredentialVerifierContract, VerificationResult } from '../../managed/contract/index.js';

export const PREPROD_CONTRACT_ADDRESS = '0x7b9a2c1f4eec91b800fe9d32afc4d7675d3e4700';

export interface LedgerState {
  minRequiredAge: number;
  totalVerifiedUsers: number;
  contractOwner: string;
}

export const INITIAL_LEDGER_STATE: LedgerState = {
  minRequiredAge: 18,
  totalVerifiedUsers: 42,
  contractOwner: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
};

// Singleton contract instance
export const contractInstance = new CredentialVerifierContract(INITIAL_LEDGER_STATE);

/**
 * Execute private ZK verification circuit
 */
export async function executeVerificationCircuit(
  birthYear: number,
  currentYear: number,
  userSecretHash: string
): Promise<VerificationResult> {
  return await contractInstance.verifyEligibility(birthYear, currentYear, userSecretHash);
}

/**
 * Prompt wallet to sign/authorize ZK proof
 */
export async function promptWalletSignature(
  walletApi: any,
  walletAddress: string,
  proofHash: string
): Promise<void> {
  if (!walletApi) return;

  const rawText = `Midnight ZK Proof Verification: ${proofHash}`;
  const hexData = Array.from(new TextEncoder().encode(rawText))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (typeof walletApi.signData === 'function') {
    try {
      await walletApi.signData(hexData, { encoding: 'hex' });
    } catch {
      try {
        await walletApi.signData(rawText, { encoding: 'text' });
      } catch {
        try {
          await walletApi.signData(walletAddress, { data: hexData, options: { encoding: 'hex' } });
        } catch (e: any) {
          console.warn('Wallet signData notice:', e.message);
        }
      }
    }
  } else if (typeof walletApi.balanceAndProveTx === 'function') {
    try {
      await walletApi.balanceAndProveTx({
        contractAddress: PREPROD_CONTRACT_ADDRESS,
        circuit: 'verifyEligibility',
        proofHash,
      });
    } catch (e: any) {
      console.warn('Wallet balanceAndProveTx notice:', e.message);
    }
  } else if (typeof walletApi.signTx === 'function') {
    try {
      await walletApi.signTx(proofHash);
    } catch (e: any) {
      console.warn('Wallet signTx notice:', e.message);
    }
  }
}
