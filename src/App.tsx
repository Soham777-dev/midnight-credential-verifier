import React from 'react';
import { useMidnight } from './hooks/useMidnight';
import Layout from './components/Layout';
import WalletConnect from './components/WalletConnect';
import { CredentialVerifier } from './components/CredentialVerifier';

export default function App() {
  const { wallet, connect, disconnect } = useMidnight();

  return (
    <Layout
      walletSlot={
        <WalletConnect
          connected={wallet.connected}
          address={wallet.address}
          connecting={wallet.isConnecting}
          onConnect={connect}
          onDisconnect={disconnect}
        />
      }
    >
      <CredentialVerifier wallet={wallet} />
    </Layout>
  );
}
