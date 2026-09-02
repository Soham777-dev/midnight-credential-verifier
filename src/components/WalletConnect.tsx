import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  connected: boolean;
  address: string;
  connecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

/**
 * WalletConnect — header button that drives the 1AM / Midnight wallet flow.
 * Shows a spinner while connecting, the truncated address when connected,
 * and a plain "Connect" prompt otherwise.
 */
export function WalletConnect({
  connected,
  address,
  connecting,
  onConnect,
  onDisconnect,
}: WalletConnectProps) {
  const label = connected
    ? `Connected: ${address.substring(0, 22)}…`
    : 'Connect Midnight Wallet';

  return (
    <button
      id="connect-wallet-btn"
      className={`wallet-btn${connected ? ' connected' : ''}`}
      onClick={connected ? onDisconnect : onConnect}
      disabled={connecting}
      aria-label={connected ? 'Disconnect wallet' : 'Connect Midnight wallet'}
    >
      {connecting ? (
        <>
          <div className="spinner" style={{ width: 14, height: 14 }} aria-hidden="true" />
          <span>Connecting…</span>
        </>
      ) : (
        <>
          <Wallet size={16} aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export default WalletConnect;
