import React, { useState } from 'react';
import { Lock, Eye, Cpu, Check, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { WalletState } from '../hooks/useMidnight';
import {
  LedgerState,
  PREPROD_CONTRACT_ADDRESS,
  contractInstance,
  executeVerificationCircuit,
  promptWalletSignature,
} from '../utils/contract';

interface CredentialVerifierProps {
  wallet: WalletState;
}

export const CredentialVerifier: React.FC<CredentialVerifierProps> = ({ wallet }) => {
  const [birthYear, setBirthYear] = useState('2000');
  const [userSecret, setUserSecret] = useState('0x_my_private_passkey_99');
  const [currentYear] = useState(2026);

  const [ledgerState, setLedgerState] = useState<LedgerState>({ ...contractInstance.state });
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0); // 0: Idle, 1: Reading Witness, 2: Prover Circuit, 3: Ledger Verification
  const [proofResult, setProofResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setProofResult(null);

    if (!wallet.connected) {
      setErrorMessage('Please connect your Midnight Wallet before running the ZK circuit.');
      return;
    }

    const yearNum = parseInt(birthYear, 10);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
      setErrorMessage(`Please enter a valid birth year between 1900 and ${currentYear}.`);
      return;
    }

    if (!userSecret || userSecret.trim().length < 4) {
      setErrorMessage('Please enter a valid private witness secret passkey.');
      return;
    }

    setIsExecuting(true);
    setExecutionStep(1);

    try {
      // Step 1: Read Private Witness Inputs
      await new Promise((r) => setTimeout(r, 600));
      setExecutionStep(2);

      // Step 2: Construct Zero-Knowledge Proof Circuit
      await new Promise((r) => setTimeout(r, 800));
      setExecutionStep(3);

      // Step 3: Run Contract Circuit & Verify On-Chain
      const result = await executeVerificationCircuit(yearNum, currentYear, userSecret);

      // Trigger wallet signature prompt if wallet API is connected
      await promptWalletSignature(wallet.api, wallet.address, result.proofHash);

      await new Promise((r) => setTimeout(r, 500));

      setProofResult(result);
      setLedgerState({ ...contractInstance.state });
    } catch (err: any) {
      console.warn('Circuit execution error:', err.message);
      setErrorMessage(err.message || 'An unexpected ZK circuit error occurred.');
    } finally {
      setIsExecuting(false);
      setExecutionStep(0);
    }
  };

  return (
    <main className="main-grid">
      {/* Left Column: ZK Circuit Form */}
      <section className="card">
        <div className="card-title">
          <span>Execute ZK Proof Circuit</span>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span className="badge-privacy badge-private">
              <Lock size={12} /> Confidential Witness
            </span>
            {wallet.connected && (
              <span className="badge-privacy badge-private" style={{ fontSize: '0.72rem' }}>
                <CheckCircle size={10} /> {wallet.walletName}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="birthYear">
              <span>Secret Birth Year</span>
              <span className="badge-privacy badge-private">
                <Lock size={10} /> Private Witness
              </span>
            </label>
            <input
              id="birthYear"
              type="number"
              className="form-input"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="e.g. 2000"
              disabled={isExecuting}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="userSecret">
              <span>Identity Secret Passkey</span>
              <span className="badge-privacy badge-private">
                <Lock size={10} /> Private Witness
              </span>
            </label>
            <input
              id="userSecret"
              type="password"
              className="form-input"
              value={userSecret}
              onChange={(e) => setUserSecret(e.target.value)}
              placeholder="Enter private witness hash..."
              disabled={isExecuting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Required Age Threshold</span>
              <span className="badge-privacy badge-public">
                <Eye size={10} /> Public Ledger
              </span>
            </label>
            <input
              type="text"
              className="form-input"
              value={`${ledgerState.minRequiredAge} Years Old (Minimum)`}
              disabled
              style={{ opacity: 0.8 }}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isExecuting || !wallet.connected}
            id="verify-circuit-btn"
          >
            {isExecuting ? (
              <>
                <div className="spinner"></div>
                <span>Generating ZK Proof...</span>
              </>
            ) : (
              <>
                <Cpu size={18} />
                <span>Generate & Verify ZK Proof</span>
              </>
            )}
          </button>
        </form>

        {/* Proof Progress Loading Indicator */}
        {isExecuting && (
          <div className="stepper-container">
            <div className={`step-item ${executionStep >= 1 ? (executionStep === 1 ? 'active' : 'completed') : ''}`}>
              {executionStep > 1 ? <Check size={14} /> : <RefreshCw size={14} className="spin-icon" />}
              <span>1. Reading Private Witness Inputs (Obfuscated)</span>
            </div>
            <div className={`step-item ${executionStep >= 2 ? (executionStep === 2 ? 'active' : 'completed') : ''}`}>
              {executionStep > 2 ? <Check size={14} /> : <RefreshCw size={14} className="spin-icon" />}
              <span>2. Constructing Zero-Knowledge Proof Circuit</span>
            </div>
            <div className={`step-item ${executionStep >= 3 ? (executionStep === 3 ? 'active' : 'completed') : ''}`}>
              {executionStep === 3 ? <RefreshCw size={14} className="spin-icon" /> : <Check size={14} />}
              <span>3. Submitting ZK Proof to Midnight Preprod Ledger</span>
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="alert-box alert-error" id="error-alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Circuit Error:</strong> {errorMessage}
            </div>
          </div>
        )}

        {/* Success Proof Result Box */}
        {proofResult && (
          <div className="alert-box alert-success" id="success-alert">
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <div style={{ width: '100%' }}>
              <strong>ZK Verification Succeeded!</strong>
              <p style={{ fontSize: '0.8rem', margin: '0.4rem 0' }}>
                Zero-Knowledge Proof verified on Midnight without revealing birth year or identity secret.
              </p>
              <div className="proof-output">
                <strong>Proof Hash:</strong> {proofResult.proofHash}
                <br />
                <strong>Private Data Revealed:</strong> NONE (witness concealed)
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Right Column: Public Ledger State */}
      <section className="card">
        <div className="card-title">
          <span>Public Ledger State</span>
          <span className="badge-privacy badge-public">
            <Eye size={12} /> Transparent State
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="state-row">
            <span className="state-label">Contract Network:</span>
            <span className="state-value">Midnight Preprod</span>
          </div>
          <div className="state-row">
            <span className="state-label">Contract Address:</span>
            <span className="state-value" style={{ fontSize: '0.78rem' }}>
              {PREPROD_CONTRACT_ADDRESS.substring(0, 14)}...{PREPROD_CONTRACT_ADDRESS.substring(34)}
            </span>
          </div>
          <div className="state-row">
            <span className="state-label">Min Age Requirement:</span>
            <span className="state-value">{ledgerState.minRequiredAge} Years</span>
          </div>
          <div className="state-row">
            <span className="state-label">Total Verified Users:</span>
            <span className="state-value" style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>
              {ledgerState.totalVerifiedUsers}
            </span>
          </div>
        </div>

        <div
          style={{
            background: '#0b1220',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <h4
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
            }}
          >
            🔒 Privacy Guarantees
          </h4>
          <ul
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              paddingLeft: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <li>On-chain observers see only that the user is &ge; {ledgerState.minRequiredAge}.</li>
            <li>Birth year and secret passkey never leave the local browser environment.</li>
            <li>Zero-knowledge proof protects against correlation and data leaks.</li>
          </ul>
        </div>
      </section>
    </main>
  );
};
