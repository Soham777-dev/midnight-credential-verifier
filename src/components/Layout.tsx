import React from 'react';
import { Shield, Lock, ExternalLink, Database, Cpu, CheckCircle2, Award } from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS } from '../utils/contract';

interface LayoutProps {
  children: React.ReactNode;
  walletSlot: React.ReactNode;
}

/**
 * Layout: Notion-inspired All-in-One Zero-Knowledge Workspace Shell
 * Styled after Notion-design-analysis:
 * - Brand navy hero band (#0a1530) with decorative sticky-note dots & wire meshes
 * - Signature purple CTA (#5645d4)
 * - Workspace mockup card embedded in hero
 * - Pastel feature card grid (Peach, Mint, Sky, Lavender)
 * - Zero em-dashes throughout
 */
export function Layout({ children, walletSlot }: LayoutProps) {
  const scrollToVerifier = () => {
    const el = document.getElementById('verifier-workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app-container">
      {/* Sticky Top Navigation */}
      <header className="navbar">
        <div className="nav-left">
          <a href="#" className="logo-group">
            <img
              src="/logo.jpg"
              alt="Midnight Logo"
              className="logo-img"
            />
            <div>
              <span className="brand-title">
                Midnight <span className="brand-accent">Credential Verifier</span>
              </span>
            </div>
          </a>
          <span className="network-tag">Preprod Testnet</span>
        </div>

        <nav className="nav-links">
          <a
            href={`https://explorer.preprod.midnight.network/contract/${PREPROD_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            Contract Explorer
          </a>
          <a
            href="https://docs.midnight.network"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            Docs
          </a>
          <a
            href="https://github.com/Soham777-dev/midnight-credential-verifier"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
        </nav>

        <div className="nav-right">
          {walletSlot}
        </div>
      </header>

      {/* Hero Band Dark (Deep Navy with Scattered Dots & Mesh Wires) */}
      <section className="hero-band-dark">
        {/* Scattered Brand Sticky-Note Dots */}
        <div className="hero-dot dot-1" aria-hidden="true" />
        <div className="hero-dot dot-2" aria-hidden="true" />
        <div className="hero-dot dot-3" aria-hidden="true" />
        <div className="hero-dot dot-4" aria-hidden="true" />
        <div className="hero-dot dot-5" aria-hidden="true" />

        {/* Mesh Wire Decorative SVGs */}
        <svg className="hero-mesh-svg mesh-left" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="40" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M10 50 Q 50 10 90 50 Q 50 90 10 50" strokeWidth="1" />
        </svg>
        <svg className="hero-mesh-svg mesh-right" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <rect x="20" y="20" width="60" height="60" rx="8" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="20" y1="20" x2="80" y2="80" strokeWidth="1" />
        </svg>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <Lock size={13} />
            <span>Confidential Zero-Knowledge Verification</span>
          </div>

          <h1 className="hero-title">Meet the privacy layer.</h1>

          <p className="hero-subtitle">
            Prove credential eligibility without disclosing personal identity or birth dates. Powered by Midnight smart contracts.
          </p>

          <div className="hero-actions">
            <button onClick={scrollToVerifier} className="button-primary">
              <CheckCircle2 size={16} />
              <span>Verify Eligibility</span>
            </button>
            <a
              href={`https://explorer.preprod.midnight.network/contract/${PREPROD_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary-on-dark"
            >
              <span>View On Explorer</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-val">0 bytes</span>
              <span className="stat-lbl">PII Disclosed</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-val">100%</span>
              <span className="stat-lbl">Client Proved</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-val">Preprod</span>
              <span className="stat-lbl">On-Chain Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workspace Mockup Card (Holding live CredentialVerifier) */}
      <section className="workspace-mockup-wrapper" id="verifier-workspace">
        <div className="workspace-mockup-card">
          <div className="mockup-header">
            <div className="mockup-breadcrumbs">
              <Shield size={14} style={{ color: 'var(--color-primary)' }} />
              <span>Midnight Workspace</span>
              <span>/</span>
              <span>Preprod Verification</span>
              <span className="mockup-badge">Compact Core</span>
            </div>
            <div className="mockup-window-controls">
              <div className="control-circle circle-close" />
              <div className="control-circle circle-min" />
              <div className="control-circle circle-max" />
            </div>
          </div>
          <div className="mockup-body">
            {children}
          </div>
        </div>
      </section>

      {/* Bold Yellow Feature Banner (Notion High-Emphasis Card) */}
      <section className="banner-section">
        <div className="card-feature-yellow-bold">
          <div className="banner-text-group">
            <h3>Verified Contract Active on Preprod</h3>
            <p>
              The CredentialVerifier circuit runs on Midnight Preprod testnet at block 2,745,227.
            </p>
            <span className="banner-contract-code">
              ba24c6846abeab7ec401ce86bf4598372a59f7d1d0c91bca9372aa2649e8ec64
            </span>
          </div>
          <a
            href={`https://explorer.preprod.midnight.network/contract/${PREPROD_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary"
            style={{ backgroundColor: 'var(--color-ink-deep)', color: '#ffffff' }}
          >
            <span>Inspect Explorer</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* Pastel Feature Cards Grid (Echoing live product database properties) */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Bring zero-knowledge privacy to work.</h2>
          <p className="section-subtitle">
            How confidential credentials work on Midnight without exposing personal data.
          </p>
        </div>

        <div className="features-grid">
          {/* Card 1: Peach */}
          <div className="pastel-card card-peach">
            <div>
              <div className="card-icon-pill">
                <Lock size={18} style={{ color: 'var(--color-brand-orange-deep)' }} />
              </div>
              <h4 className="card-heading">Zero PII Exposure</h4>
              <p className="card-desc">
                Birth year and private passkeys are kept strictly local. Only the validity proof is broadcast.
              </p>
            </div>
            <span className="badge-tag-orange">Private Witness</span>
          </div>

          {/* Card 2: Mint */}
          <div className="pastel-card card-mint">
            <div>
              <div className="card-icon-pill">
                <Database size={18} style={{ color: 'var(--color-brand-green)' }} />
              </div>
              <h4 className="card-heading">Preprod Deployed</h4>
              <p className="card-desc">
                Public state updates ledger counters atomically with state verification on Midnight Preprod.
              </p>
            </div>
            <span className="badge-tag-green">Block 2,745,227</span>
          </div>

          {/* Card 3: Sky */}
          <div className="pastel-card card-sky">
            <div>
              <div className="card-icon-pill">
                <Award size={18} style={{ color: 'var(--color-link-blue)' }} />
              </div>
              <h4 className="card-heading">1AM Wallet Ready</h4>
              <p className="card-desc">
                Full DApp connector compatibility with automatic detection and CIP-30 signature support.
              </p>
            </div>
            <span className="badge-tag-purple">Multi-Wallet</span>
          </div>

          {/* Card 4: Lavender */}
          <div className="pastel-card card-lavender">
            <div>
              <div className="card-icon-pill">
                <Cpu size={18} style={{ color: 'var(--color-brand-purple)' }} />
              </div>
              <h4 className="card-heading">Compact Circuits</h4>
              <p className="card-desc">
                Compiled with Midnight Compact language into succinct non-interactive zero-knowledge circuits.
              </p>
            </div>
            <span className="badge-tag-purple">Compact 0.31</span>
          </div>
        </div>
      </section>

      {/* Notion Clean Footer */}
      <footer className="footer-region">
        <div className="footer-content">
          <div>
            <span>Built on <strong>Midnight Network</strong>. Confidential Credential Verifier.</span>
          </div>
          <div className="footer-links-group">
            <a
              href="https://github.com/Soham777-dev/midnight-credential-verifier"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
            <a
              href="https://x.com/MidnightVerifier"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              @MidnightVerifier
            </a>
            <a
              href={`https://explorer.preprod.midnight.network/contract/${PREPROD_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Preprod Explorer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
