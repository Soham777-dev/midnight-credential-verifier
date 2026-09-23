import React, { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, Check, LogOut } from 'lucide-react';
import { DiscoveredWallet } from '../hooks/useMidnight';

interface WalletConnectProps {
  connected: boolean;
  address: string;
  walletName: string;
  connecting: boolean;
  availableWallets: DiscoveredWallet[];
  onConnect: (walletId?: string) => void;
  onDisconnect: () => void;
}

/**
 * WalletConnect — header component that drives the 1AM Wallet / Midnight DApp connector flow.
 * Supports auto-detecting 1AM Wallet and other Midnight-compatible wallets.
 */
export function WalletConnect({
  connected,
  address,
  walletName,
  connecting,
  availableWallets,
  onConnect,
  onDisconnect,
}: WalletConnectProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (connected) {
    const shortAddress = address ? `${address.substring(0, 10)}...${address.substring(address.length - 8)}` : '';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="wallet-btn connected" style={{ cursor: 'default' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--accent-emerald)',
              display: 'inline-block',
            }}
          />
          <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>{walletName || '1AM Wallet'}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({shortAddress})</span>
        </div>
        <button
          onClick={onDisconnect}
          className="wallet-btn"
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            padding: '0.5rem 0.75rem',
          }}
          title="Disconnect Wallet"
          aria-label="Disconnect wallet"
        >
          <LogOut size={15} />
        </button>
      </div>
    );
  }

  const hasMultiple = availableWallets.length > 1;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          id="connect-wallet-btn"
          className="wallet-btn"
          onClick={() => onConnect('1am')}
          disabled={connecting}
          aria-label="Connect 1AM Wallet"
          style={{ borderTopRightRadius: hasMultiple ? 0 : 8, borderBottomRightRadius: hasMultiple ? 0 : 8 }}
        >
          {connecting ? (
            <>
              <div className="spinner" style={{ width: 14, height: 14 }} aria-hidden="true" />
              <span>Connecting 1AM Wallet…</span>
            </>
          ) : (
            <>
              <Wallet size={16} aria-hidden="true" />
              <span>Connect 1AM Wallet</span>
            </>
          )}
        </button>

        {hasMultiple && (
          <button
            className="wallet-btn"
            style={{
              padding: '0.5rem 0.5rem',
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            onClick={() => setDropdownOpen((prev) => !prev)}
            title="Choose Wallet"
            aria-label="Choose Wallet"
          >
            <ChevronDown size={14} />
          </button>
        )}
      </div>

      {/* Wallet Selection Dropdown */}
      {dropdownOpen && hasMultiple && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            zIndex: 100,
            minWidth: '220px',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.25rem 0.5rem' }}>
            Detected Midnight Wallets
          </div>
          {availableWallets.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                setDropdownOpen(false);
                onConnect(w.id);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                padding: '0.5rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.85rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wallet size={14} color="var(--accent-blue)" />
                {w.name}
              </span>
              {w.id.includes('1am') && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--accent-emerald)',
                    background: 'var(--badge-private-bg)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  Primary
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default WalletConnect;
