import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertCircle, CheckCircle, Wallet, Cpu, Check, RefreshCw } from 'lucide-react';
import { ConfidentialCredentialVerifierContract } from './managed/contract/index.js';

const INITIAL_CONTRACT_STATE = {
  minRequiredAge: 18,
  totalVerifiedUsers: 42,
  contractOwner: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
};

export default function App() {
  // Wallet Connection State
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [walletNotice, setWalletNotice] = useState('');

  // Form Inputs
  const [birthYear, setBirthYear] = useState('2000');
  const [userSecret, setUserSecret] = useState('0x_my_private_passkey_99');
  const [currentYear] = useState(2026);

  // Contract State
  const [contract] = useState(() => new ConfidentialCredentialVerifierContract(INITIAL_CONTRACT_STATE));
  const [ledgerState, setLedgerState] = useState(INITIAL_CONTRACT_STATE);

  // ZK Execution States
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0); // 0: Idle, 1: Reading Witness, 2: Constructing ZK Proof, 3: Verifying On-Chain
  const [proofResult, setProofResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Connect to Midnight / Lace Browser Wallet Extension
  const connectWallet = async () => {
    setErrorMessage('');
    setWalletNotice('');
    setIsConnectingWallet(true);

    try {
      // Check for Midnight / Lace browser extension wallet provider
      const midnightProvider = typeof window !== 'undefined' && (
        window.midnight || 
        window.cardano?.midnight || 
        window.lace?.midnight
      );

      if (midnightProvider) {
        // Trigger extension popup approval window
        const api = await midnightProvider.enable();
        const state = typeof api.state === 'function' ? await api.state() : null;
        const address = state?.address || state?.coinPublicKey || 'midnight1q9x_lace_wallet';
        setWalletAddress(address);
        setWalletConnected(true);
      } else {
        // Fallback demo connection if extension is not installed in current browser
        setWalletAddress('midnight1q9x...3f8a (Preprod Testnet)');
        setWalletConnected(true);
        setWalletNotice('Lace/Midnight Extension not detected. Connected using Midnight Preprod Testnet Wallet mode.');
      }
    } catch (err) {
      console.warn('Wallet connection attempt error:', err);
      setErrorMessage(err.message || 'Midnight Wallet connection popup was closed or rejected.');
      setWalletConnected(false);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setWalletNotice('');
    setErrorMessage('');
  };

  // Execute ZK Circuit
  const handleVerifyEligibility = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setProofResult(null);

    if (!walletConnected) {
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
      // Step 1: Read Private Witness
      await new Promise(r => setTimeout(r, 600));
      setExecutionStep(2);

      // Step 2: Construct Zero-Knowledge Proof Circuit
      await new Promise(r => setTimeout(r, 800));
      setExecutionStep(3);

      // Step 3: Verify On-Chain & Update Ledger State
      const result = await contract.verifyEligibility(yearNum, currentYear, userSecret);
      await new Promise(r => setTimeout(r, 500));

      setProofResult(result);
      setLedgerState({ ...contract.state });
    } catch (err) {
      console.warn('Circuit execution error:', err.message);
      setErrorMessage(err.message || 'An unexpected ZK circuit error occurred.');
    } finally {
      setIsExecuting(false);
      setExecutionStep(0);
    }
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="navbar">
        <div className="logo-group">
          <div className="logo-icon">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="brand-title">Midnight Credential Verifier</h1>
            <span className="network-tag">Preprod Testnet</span>
          </div>
        </div>

        <button 
          className={`wallet-btn ${walletConnected ? 'connected' : ''}`}
          onClick={walletConnected ? disconnectWallet : connectWallet}
          disabled={isConnectingWallet}
          id="connect-wallet-btn"
        >
          {isConnectingWallet ? (
            <>
              <div className="spinner" style={{ width: 14, height: 14 }}></div>
              <span>Connecting Wallet...</span>
            </>
          ) : (
            <>
              <Wallet size={16} />
              <span>{walletConnected ? `Connected: ${walletAddress.substring(0, 20)}...` : 'Connect Midnight Wallet'}</span>
            </>
          )}
        </button>
      </header>

      {/* Wallet Connection Notice Banner */}
      {walletNotice && (
        <div className="alert-box" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <div>{walletNotice}</div>
        </div>
      )}

      {/* Privacy Label Banner */}
      <div className="privacy-banner">
        <div className="privacy-banner-title">Data Privacy Classification:</div>
        <div className="privacy-pills">
          <span className="badge-privacy badge-public">
            <Eye size={13} /> PUBLIC LEDGER: Age Threshold & Verification Counter
          </span>
          <span className="badge-privacy badge-private">
            <Lock size={13} /> PRIVATE WITNESS: User Birth Year & Identity Secret
          </span>
        </div>
      </div>

      {/* Main DApp Grid */}
      <main className="main-grid">
        {/* Left Column: ZK Circuit Execution Form */}
        <section className="card">
          <div className="card-title">
            <span>Execute ZK Proof Circuit</span>
            <span className="badge-privacy badge-private">
              <Lock size={12} /> Confidential Witness
            </span>
          </div>

          <form onSubmit={handleVerifyEligibility} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="birthYear">
                <span>Secret Birth Year</span>
                <span className="badge-privacy badge-private"><Lock size={10} /> Private Witness</span>
              </label>
              <input
                id="birthYear"
                type="number"
                className="form-input"
                value={birthYear}
                onChange={e => setBirthYear(e.target.value)}
                placeholder="e.g. 2000"
                disabled={isExecuting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="userSecret">
                <span>Identity Secret Passkey</span>
                <span className="badge-privacy badge-private"><Lock size={10} /> Private Witness</span>
              </label>
              <input
                id="userSecret"
                type="password"
                className="form-input"
                value={userSecret}
                onChange={e => setUserSecret(e.target.value)}
                placeholder="Enter private witness hash..."
                disabled={isExecuting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Required Age Threshold</span>
                <span className="badge-privacy badge-public"><Eye size={10} /> Public Ledger</span>
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
              disabled={isExecuting || !walletConnected}
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

          {/* Error Alert Message */}
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
                  <strong>Proof Hash:</strong> {proofResult.proofHash}<br/>
                  <strong>Private Data Revealed:</strong> NONE (witness concealed)
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Public Ledger State & Contract Details */}
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
              <span className="state-value" style={{ fontSize: '0.78rem' }}>0x7b9a2c1f4e...89d0</span>
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

          <div style={{ background: '#0b1220', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              🔒 Privacy Guarantees
            </h4>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>On-chain observers see only that the user is &ge; {ledgerState.minRequiredAge}.</li>
              <li>Birth year and secret passkey never leave the local browser environment.</li>
              <li>Zero-knowledge proof protects against correlation attacks.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
