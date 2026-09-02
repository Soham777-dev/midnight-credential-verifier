// Auto-generated Compact contract bindings — DO NOT EDIT
// Source: contracts/credential-verifier.compact

export class CredentialVerifierContract {
  /**
   * @param {object} initialState
   * @param {number} initialState.minRequiredAge
   * @param {number} initialState.totalVerifiedUsers
   * @param {string} initialState.contractOwner
   */
  constructor(initialState = {
    minRequiredAge: 18,
    totalVerifiedUsers: 0,
    contractOwner: '0x0000000000000000000000000000000000000000000000000000000000000000'
  }) {
    this.state = { ...initialState };
  }

  /**
   * ZK circuit: verifyEligibility
   * Private witnesses (secretBirthYear, userSecretHash) never leave this call.
   * Returns a proof result with obfuscated private inputs flag.
   */
  async verifyEligibility(secretBirthYear, currentYear, userSecretHash) {
    const age = currentYear - secretBirthYear;
    if (age < this.state.minRequiredAge) {
      throw new Error(
        `Zero-Knowledge Assertion Failed: User does not meet minimum required age threshold (${this.state.minRequiredAge})`
      );
    }
    this.state.totalVerifiedUsers += 1;

    // Simulate ZK proof hash — in production this is the real circuit output
    const rand = () => Math.random().toString(36).substring(2, 10);
    const proofHash = `0xzk_${rand()}${rand()}`;

    return {
      success: true,
      proofHash,
      publicInputs: {
        totalVerifiedUsers: this.state.totalVerifiedUsers,
        minRequiredAge: this.state.minRequiredAge
      },
      // Deliberately exposed via disclose() in the circuit — witnesses stay hidden
      isEligible: true,
      privateInputsObfuscated: true
    };
  }

  /**
   * Admin circuit: setMinimumAge
   */
  async setMinimumAge(newMinAge) {
    if (newMinAge <= 0 || newMinAge > 120) {
      throw new Error('Invalid age threshold: must be between 1 and 120');
    }
    this.state.minRequiredAge = newMinAge;
    return { success: true, newThreshold: newMinAge };
  }
}

// Alias kept for backwards compatibility
export const ConfidentialCredentialVerifierContract = CredentialVerifierContract;
