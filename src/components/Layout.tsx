import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  walletSlot: React.ReactNode;
}

/**
 * Layout — top-level shell: navbar + hero section + page content.
 * walletSlot renders the WalletConnect button in the header.
 */
export function Layout({ children, walletSlot }: LayoutProps) {
  return (
    <div className="app-container">
      <header className="navbar">
        <div className="logo-group">
          <img
            src="/logo.jpg"
            alt="Midnight Credential Verifier"
            className="logo-img"
          />
          <div>
            <h1 className="brand-title">
              Midnight <span className="brand-accent">Credential Verifier</span>
            </h1>
            <span className="network-tag">Preprod Testnet</span>
          </div>
        </div>
        {walletSlot}
      </header>

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-glow" />
        <h2 className="hero-title">Zero-Knowledge Age Verification</h2>
        <p className="hero-subtitle">
          Prove your eligibility without revealing personal data. Powered by Midnight's privacy-preserving smart contracts.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">ZK</span>
            <span className="hero-stat-label">Privacy Proofs</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">100%</span>
            <span className="hero-stat-label">Data Private</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">On-Chain</span>
            <span className="hero-stat-label">Preprod Verified</span>
          </div>
        </div>
      </section>

      {/* Privacy Legend Banner */}
      <div className="privacy-banner">
        <span className="privacy-banner-title">Data Classification</span>
        <div className="privacy-pills">
          <span className="badge-privacy badge-public">🔓 Public — Visible on ledger</span>
          <span className="badge-privacy badge-private">🔒 Private — Never leaves your device</span>
        </div>
      </div>

      {children}

      {/* Footer */}
      <footer className="app-footer">
        <span>Built on <strong>Midnight Network</strong> · Zero-Knowledge Privacy</span>
        <span className="footer-links">
          <a href="https://github.com/Soham777-dev/midnight-credential-verifier" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className="footer-dot">·</span>
          <a href="https://x.com/MidnightVerifier" target="_blank" rel="noopener noreferrer">@MidnightVerifier</a>
        </span>
      </footer>
    </div>
  );
}

export default Layout;
