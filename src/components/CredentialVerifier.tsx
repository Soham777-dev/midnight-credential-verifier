import React, { useState } from 'react';
import { Lock, Eye, Cpu, Check, RefreshCw, AlertCircle, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
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
    <div className="verifier-grid">
      {/* Left Column: ZK Circuit Form */}
      <section className="verifier-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Cpu size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Execute ZK Proof Circuit</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className="badge-tag-purple">
              <Lock size={11} /> Confidential Witness
            </span>
            {wallet.connected && (
              <span className="badge-tag-green">
                <CheckCircle size={11} /> {wallet.walletName}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="birthYear">
              <span>Secret Birth Year</span>
              <span className="badge-tag-purple">
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
            <span className="input-hint">Never sent to any server or ledger</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="userSecret">
              <span>Identity Secret Passkey</span>
              <span className="badge-tag-purple">
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
            <span className="input-hint">Kept strictly in your local device memory</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="threshold">
              <span>Required Age Threshold</span>
              <span className="badge-tag-green">
                <Eye size={10} /> Public Rule
              </span>
            </label>
            <input
              id="threshold"
              type="text"
              className="form-input"
              value={`${ledgerState.minRequiredAge} Years Old (Minimum)`}
              disabled
              style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-slate)' }}
            />
          </div>

          <button
            type="submit"
            className="button-primary"
            disabled={isExecuting || !wallet.connected}
            id="verify-circuit-btn"
            style={{ width: '100%', height: '44px', marginTop: '8px' }}
          >
            {isExecuting ? (
              <>
                <RefreshCw size={16} className="spin-icon" />
                <span>Generating ZK Proof...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Generate & Verify ZK Proof</span>
              </>
            )}
          </button>
        </form>

        {/* Proof Progress Loading Indicator */}
        {isExecuting && (
          <div className="stepper-box">
            <div className={`step-row ${executionStep >= 1 ? 'step-active' : ''}`}>
              {executionStep > 1 ? <Check size={14} style={{ color: 'var(--color-brand-green)' }} /> : <RefreshCw size={14} className="spin-icon" />}
              <span>1. Reading Private Witness Inputs (Local)</span>
            </div>
            <div className={`step-row ${executionStep >= 2 ? 'step-active' : ''}`}>
              {executionStep > 2 ? <Check size={14} style={{ color: 'var(--color-brand-green)' }} /> : <RefreshCw size={14} className="spin-icon" />}
              <span>2. Constructing Zero-Knowledge Proof Circuit</span>
            </div>
            <div className={`step-row ${executionStep >= 3 ? 'step-active' : ''}`}>
              {executionStep === 3 ? <RefreshCw size={14} className="spin-icon" /> : <Check size={14} style={{ color: 'var(--color-brand-green)' }} />}
              <span>3. Submitting ZK Proof to Midnight Preprod</span>
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="alert-box-error" id="error-alert">
            <AlertCircle size={18} style={{ flexShrink: 0, color: 'var(--color-semantic-error)' }} />
            <div>
              <strong>Circuit Error:</strong> {errorMessage}
            </div>
          </div>
        )}

        {/* Success Proof Result Box */}
        {proofResult && (
          <div className="proof-result-card" id="success-alert">
            <div className="proof-result-title">
              <CheckCircle size={18} />
              <span>ZK Verification Succeeded</span>
            </div>
            <p style={{ fontSize: '13px', margin: '4px 0 8px' }}>
              Zero-Knowledge Proof verified on Midnight without revealing birth year or identity secret.
            </p>
            <div className="proof-hash-box">
              <div><strong>Proof Hash:</strong> {proofResult.proofHash}</div>
              <div style={{ marginTop: '4px' }}><strong>Private Data Revealed:</strong> NONE (witness concealed)</div>
            </div>
          </div>
        )}
      </section>

      {/* Right Column: Public Ledger State */}
      <section className="verifier-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Eye size={18} style={{ color: 'var(--color-brand-teal)' }} />
            <span>Public Ledger State</span>
          </div>
          <span className="badge-tag-green">
            Transparent On-Chain
          </span>
        </div>

        <div className="state-table">
          <div className="state-row">
            <span className="state-label">Network:</span>
            <span className="state-value">Midnight Preprod</span>
          </div>

          <div className="state-row">
            <span className="state-label">Contract:</span>
            <span className="state-value">
              <a
                href={`https://explorer.preprod.midnight.network/contract/${PREPROD_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button-link"
                title="View on Midnight Preprod Explorer"
              >
                {PREPROD_CONTRACT_ADDRESS.substring(0, 10)}...{PREPROD_CONTRACT_ADDRESS.substring(PREPROD_CONTRACT_ADDRESS.length - 8)}
                <ExternalLink size={12} style={{ display: 'inline', marginLeft: 4 }} />
              </a>
            </span>
          </div>

          <div className="state-row">
            <span className="state-label">Min Age:</span>
            <span className="state-value">{ledgerState.minRequiredAge} Years</span>
          </div>

          <div className="state-row">
            <span className="state-label">Total Verified:</span>
            <span className="state-value" style={{ color: 'var(--color-brand-green)', fontSize: '15px' }}>
              {ledgerState.totalVerifiedUsers}
            </span>
          </div>
        </div>

        {/* Privacy Guarantees Box */}
        <div className="privacy-guarantee-box">
          <div className="privacy-guarantee-title">
            <Lock size={14} style={{ color: 'var(--color-primary)' }} />
            <span>Privacy Guarantees</span>
          </div>
          <ul className="privacy-guarantee-list">
            <li>On-chain observers learn only that the user meets the age threshold.</li>
            <li>Birth year and secret passkey never leave your local device memory.</li>
            <li>Zero-Knowledge proof mathematically prevents tracking and identity correlation.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default CredentialVerifier;
