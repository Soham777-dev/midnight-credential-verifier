import React from 'react';
import { Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  walletSlot: React.ReactNode;
}

/**
 * Layout — top-level shell: navbar + page content.
 * walletSlot renders the WalletConnect button in the header.
 */
export function Layout({ children, walletSlot }: LayoutProps) {
  return (
    <div className="app-container">
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
        {walletSlot}
      </header>

      {children}
    </div>
  );
}

export default Layout;
