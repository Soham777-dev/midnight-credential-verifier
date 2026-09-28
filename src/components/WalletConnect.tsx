import React, { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, Check, LogOut, CheckCircle2 } from 'lucide-react';
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
 * WalletConnect: Header component adhering to the Notion Design System.
 * - 8px rectangular button geometry (button-primary in #5645d4)
 * - Clear active states and accessible contrast
 * - Multi-wallet dropdown (1AM Wallet, Lace, etc.)
 * - Zero em-dashes throughout
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: 'var(--color-card-tint-mint)',
            border: '1px solid #c2e8cd',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand-green)',
              display: 'inline-block',
            }}
          />
          <span style={{ fontWeight: 600, color: 'var(--color-brand-green)' }}>
            {walletName || '1AM Wallet'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-slate)', fontFamily: 'var(--font-mono)' }}>
            ({shortAddress})
          </span>
        </div>
        <button
          onClick={onDisconnect}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '38px',
            padding: '0 12px',
            backgroundColor: 'transparent',
            border: '1px solid var(--color-hairline-strong)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-slate)',
            cursor: 'pointer',
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
          className="button-primary"
          onClick={() => onConnect('1am')}
          disabled={connecting}
          aria-label="Connect 1AM Wallet"
          style={{
            borderTopRightRadius: hasMultiple ? 0 : 'var(--radius-md)',
            borderBottomRightRadius: hasMultiple ? 0 : 'var(--radius-md)',
            height: '38px',
            padding: '8px 16px',
            fontSize: '13px',
          }}
        >
          {connecting ? (
            <>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  animation: 'spin 0.8s linear infinite',
                }}
                aria-hidden="true"
              />
              <span>Connecting 1AM Wallet...</span>
            </>
          ) : (
            <>
              <Wallet size={15} aria-hidden="true" />
              <span>Connect 1AM Wallet</span>
            </>
          )}
        </button>

        {hasMultiple && (
          <button
            className="button-primary"
            style={{
              padding: '8px 10px',
              borderLeft: '1px solid rgba(255,255,255,0.25)',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              height: '38px',
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
            backgroundColor: 'var(--color-canvas)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            zIndex: 100,
            minWidth: '220px',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-steel)', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                color: 'var(--color-charcoal)',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '13px',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={14} color="var(--color-primary)" />
                {w.name}
              </span>
              {w.id.includes('1am') && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--color-brand-green)',
                    backgroundColor: 'var(--color-card-tint-mint)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-xs)',
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
