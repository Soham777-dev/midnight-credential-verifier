import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ConfidentialCredentialVerifierContract } from '../src/managed/contract/index.js';

describe('ConfidentialCredentialVerifier Compact Smart Contract', () => {
  let contract;

  beforeEach(() => {
    contract = new ConfidentialCredentialVerifierContract({
      minRequiredAge: 18,
      totalVerifiedUsers: 0,
      contractOwner: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    });
  });

  it('1. should successfully generate ZK proof and verify eligibility when age >= minRequiredAge', async () => {
    const currentYear = 2026;
    const secretBirthYear = 2000; // Age 26 >= 18
    const secretHash = '0x1234567890abcdef';

    const result = await contract.verifyEligibility(secretBirthYear, currentYear, secretHash);

    assert.equal(result.success, true);
    assert.match(result.proofHash, /^0xzk_/);
    assert.equal(result.privateInputsObfuscated, true);
    assert.equal(contract.state.totalVerifiedUsers, 1);
  });

  it('2. should reject proof generation when user age does not satisfy threshold', async () => {
    const currentYear = 2026;
    const secretBirthYear = 2012; // Age 14 < 18
    const secretHash = '0xunderage_user_secret';

    await assert.rejects(
      async () => {
        await contract.verifyEligibility(secretBirthYear, currentYear, secretHash);
      },
      {
        message: 'Proof Generation Failed: User does not meet minimum age requirement (18)'
      }
    );

    // Total verified users should remain 0
    assert.equal(contract.state.totalVerifiedUsers, 0);
  });

  it('3. should increment totalVerifiedUsers on public ledger upon successful circuit execution', async () => {
    const currentYear = 2026;
    const user1BirthYear = 1995;
    const user2BirthYear = 2002;

    await contract.verifyEligibility(user1BirthYear, currentYear, '0xuser1_hash');
    assert.equal(contract.state.totalVerifiedUsers, 1);

    await contract.verifyEligibility(user2BirthYear, currentYear, '0xuser2_hash');
    assert.equal(contract.state.totalVerifiedUsers, 2);
  });

  it('4. should allow updating minimum age threshold configuration on ledger', async () => {
    assert.equal(contract.state.minRequiredAge, 18);

    const updateResult = await contract.setMinimumAge(21);
    assert.equal(updateResult.success, true);
    assert.equal(contract.state.minRequiredAge, 21);

    // Now age 20 should fail under new 21 threshold
    await assert.rejects(
      async () => {
        await contract.verifyEligibility(2006, 2026, '0xuser3_hash');
      },
      {
        message: 'Proof Generation Failed: User does not meet minimum age requirement (21)'
      }
    );
  });
});
