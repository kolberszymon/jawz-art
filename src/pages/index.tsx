import React, { useState, useEffect } from 'react';
import { RaribleSdk } from '@rarible/protocol-ethereum-sdk';
import ImagePlaceholder from '@/components/placeholders/ImagePlaceholder';
import MetaMaskButton from '../components/MetaMaskButton';
import Navbar from '../components/Navbar';

const imageURL = `https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1051&q=80`;

type DashboardProps = {
  provider: any;
  sdk: RaribleSdk;
  accounts: string[];
};

const Dashboard: React.FC<DashboardProps> = ({ provider, sdk, accounts }) => {
  const connectWalletHandler = async () => {
    await provider.request({ method: `eth_requestAccounts` });
  };

  const handleButtonClick = (): void => {
    connectWalletHandler();
  };

  return (
    <div className="h-screen w-full relative">
      <Navbar />

      <main className="w-full h-full flex flex-col md:flex-row justify-around items-center px-2">
        <ImagePlaceholder width={500} height={500} />
        <div>
          <ImagePlaceholder width={200} height={200} />
          <ImagePlaceholder width={200} height={200} />
        </div>
        <div>
          <ImagePlaceholder width={200} height={200} />
          <ImagePlaceholder width={200} height={200} />
        </div>
      </main>

      <MetaMaskButton onClick={handleButtonClick} accounts={accounts} />
    </div>
  );
};

export default Dashboard;
