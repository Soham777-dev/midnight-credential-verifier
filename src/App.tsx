import React from 'react';
import { useMidnight } from './hooks/useMidnight';
import { Layout } from './components/Layout';
import { WalletConnect } from './components/WalletConnect';
import { CredentialVerifier } from './components/CredentialVerifier';

export default function App() {
  const { wallet, connect, disconnect } = useMidnight();

  return (
    <Layout
      walletSection={
        <WalletConnect
          wallet={wallet}
          onConnect={connect}
          onDisconnect={disconnect}
        />
      }
    >
      <CredentialVerifier wallet={wallet} />
    </Layout>
  );
}
