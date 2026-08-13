export interface VerificationResult {
  success: boolean;
  proofHash: string;
  publicInputs: { totalVerifiedUsers: number };
  privateInputsObfuscated: boolean;
}

export class ConfidentialCredentialVerifierContract {
  constructor(initialState?: any);
  verifyEligibility(secretBirthYear: number, currentYear: number, userSecretHash: string): Promise<VerificationResult>;
  setMinimumAge(newMinAge: number): Promise<{ success: boolean }>;
}
