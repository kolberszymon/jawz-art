import React, { useState, useEffect } from 'react';
import { RaribleSdk } from '@rarible/protocol-ethereum-sdk';
import ImageLoadPlaceholder from '@/components/placeholders/ImageLoadPlaceholder';
import MetaMaskButton from '@/components/MetaMaskButton';
import Navbar from '@/components/Navbar';

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

      <main className="w-full h-full flex flex-row md:flex-row justify-around items-center px-2">
        <div>
          <ImageLoadPlaceholder
            width={500}
            height={400}
            imgUrl="https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          />
        </div>
        <div className="flex flex-col justify-around h-3/5 mt-20">
          <ImageLoadPlaceholder
            width={200}
            height={200}
            imgUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          />
          <ImageLoadPlaceholder
            width={200}
            height={200}
            imgUrl="https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
          />
        </div>
        <div className="flex flex-col justify-around h-3/5 mt-28">
          <ImageLoadPlaceholder
            width={200}
            height={200}
            imgUrl="https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          />
          <ImageLoadPlaceholder
            width={200}
            height={200}
            imgUrl="https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          />
        </div>
      </main>

      <MetaMaskButton onClick={handleButtonClick} accounts={accounts} />
    </div>
  );
};

export default Dashboard;
