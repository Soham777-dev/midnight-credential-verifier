// Auto-generated Compact contract type declarations — DO NOT EDIT

export interface VerificationResult {
  success: boolean;
  proofHash: string;
  publicInputs: { totalVerifiedUsers: number; minRequiredAge: number };
  isEligible: boolean;
  privateInputsObfuscated: boolean;
}

export interface ContractState {
  minRequiredAge: number;
  totalVerifiedUsers: number;
  contractOwner: string;
}

export class CredentialVerifierContract {
  state: ContractState;
  constructor(initialState?: ContractState);
  verifyEligibility(
    secretBirthYear: number,
    currentYear: number,
    userSecretHash: string
  ): Promise<VerificationResult>;
  setMinimumAge(newMinAge: number): Promise<{ success: boolean; newThreshold: number }>;
}

export const ConfidentialCredentialVerifierContract: typeof CredentialVerifierContract;
