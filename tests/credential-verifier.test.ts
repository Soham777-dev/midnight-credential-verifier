/**
 * Test Suite: Midnight CredentialVerifier Compact Contract
 * ---------------------------------------------------------
 * Tests the JS simulation of the ZK circuit.
 * All tests use node:test + node:assert (no extra dependencies).
 */
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { CredentialVerifierContract } from '../managed/contract/index.js';

describe('Midnight CredentialVerifier Compact Smart Contract', () => {
  let contract: any;

  beforeEach(() => {
    contract = new CredentialVerifierContract({
      minRequiredAge: 18,
      totalVerifiedUsers: 0,
      contractOwner: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    });
  });

  // ── Test 1 ───────────────────────────────────────────────────────────────
  it('1. should generate ZK proof without disclosing birth year when user meets threshold', async () => {
    const result = await contract.verifyEligibility(2000, 2026, '0x_private_passkey_abc');

    assert.equal(result.success, true,                   'success must be true');
    assert.equal(result.isEligible, true,                'isEligible (disclosed) must be true');
    assert.equal(result.privateInputsObfuscated, true,   'private inputs must be obfuscated');
    assert.match(result.proofHash, /^0xzk_/,             'proofHash must start with 0xzk_');

    // Public state: counter increments; birth year is NEVER in the result
    assert.equal(contract.state.totalVerifiedUsers, 1,   'totalVerifiedUsers should be 1');
    assert.equal('secretBirthYear' in result, false,     'birth year must not appear in result');
    assert.equal('userSecretHash'  in result, false,     'secret hash must not appear in result');
  });

  // ── Test 2 ───────────────────────────────────────────────────────────────
  it('2. should reject ZK proof and not increment counter when user is underage', async () => {
    await assert.rejects(
      () => contract.verifyEligibility(2012, 2026, '0x_underage_secret'),
      /Zero-Knowledge Assertion Failed/,
      'should throw assertion error for underage user'
    );

    assert.equal(contract.state.totalVerifiedUsers, 0, 'counter must remain 0 on failed proof');
  });

  // ── Test 3 ───────────────────────────────────────────────────────────────
  it('3. should atomically increment totalVerifiedUsers on each successful proof', async () => {
    await contract.verifyEligibility(1995, 2026, '0x_user_one');
    assert.equal(contract.state.totalVerifiedUsers, 1);

    await contract.verifyEligibility(2002, 2026, '0x_user_two');
    assert.equal(contract.state.totalVerifiedUsers, 2);

    await contract.verifyEligibility(1985, 2026, '0x_user_three');
    assert.equal(contract.state.totalVerifiedUsers, 3);
  });

  // ── Test 4 ───────────────────────────────────────────────────────────────
  it('4. admin circuit setMinimumAge should update threshold and enforce new constraint', async () => {
    assert.equal(contract.state.minRequiredAge, 18);

    const updateRes = await contract.setMinimumAge(21);
    assert.equal(updateRes.success, true);
    assert.equal(contract.state.minRequiredAge, 21);

    // Born 2006 → age 20 in 2026 — fails under 21 threshold
    await assert.rejects(
      () => contract.verifyEligibility(2006, 2026, '0x_user_fails_21'),
      /Zero-Knowledge Assertion Failed/
    );

    // Born 2004 → age 22 in 2026 — passes under 21 threshold
    const pass = await contract.verifyEligibility(2004, 2026, '0x_user_passes_21');
    assert.equal(pass.success, true);
  });

  // ── Test 5 ───────────────────────────────────────────────────────────────
  it('5. setMinimumAge should reject invalid thresholds', async () => {
    await assert.rejects(
      () => contract.setMinimumAge(0),
      /Invalid age threshold/
    );
    await assert.rejects(
      () => contract.setMinimumAge(121),
      /Invalid age threshold/
    );
    // State must be unchanged
    assert.equal(contract.state.minRequiredAge, 18);
  });

  // ── Test 6 ───────────────────────────────────────────────────────────────
  it('6. exactly-18 edge case: born exactly minRequiredAge years ago should pass', async () => {
    const result = await contract.verifyEligibility(2008, 2026, '0x_exact_18');
    assert.equal(result.success, true, 'exactly 18 should pass');
    assert.equal(contract.state.totalVerifiedUsers, 1);
  });
});
