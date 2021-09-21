import React, { useState, useEffect } from 'react';
import { RaribleSdk } from '@rarible/protocol-ethereum-sdk';
import ImageLoadPlaceholder from '@/components/placeholders/ImageLoadPlaceholder';
import MetaMaskButton from '@/components/MetaMaskButton';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { toBigNumber } from '@rarible/types';

type DashboardProps = {
  provider: any;
  sdk: RaribleSdk;
  accounts: string[];
};

type NftItem = {
  attributes: unknown;
  description: string;
  imageUrl: string;
  name: string;
};

const Dashboard: React.FC<DashboardProps> = ({ provider, sdk, accounts }) => {
  const [nfts, setNfts] = useState<NftItem[]>([]);

  const connectWalletHandler = async () => {
    await provider.request({ method: `eth_requestAccounts` });
  };

  const handleButtonClick = (): void => {
    connectWalletHandler();
  };

  useEffect(() => {
    if (accounts[0] && nfts.length === 0) {
      handleGetMyNfts(accounts[0]);
    }
  }, [accounts]);

  useEffect(() => {
    console.log(nfts);
  }, [nfts]);

  const handleGetMyNfts = async (owner: string) => {
    const { data } = await axios.get(
      `https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/items/byOwner`,
      {
        params: {
          owner,
        },
      },
    );
    const allNfts: NftItem[] = [];
    data.items.map(async (item: any) => {
      const { tokenId } = item;
      const contractAddress = item.contract;

      const nft: NftItem | undefined = await getNftById(
        `${contractAddress}:${tokenId}`,
      );

      if (nft !== undefined) {
        allNfts.push(nft);
      }
    });
    setNfts(allNfts);
  };

  /* eslint-disable */
  async function getNftById(id: string) {
    const { data } = await axios.get(
      `https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/items/${id}/meta`,
    );
    if (data.image === undefined) {
      return;
    }

    const nft: NftItem = {
      name: data.name,
      description: data.description,
      attributes: data.attributes,
      imageUrl: data.image.url.ORIGINAL,
    };

    return nft;
  }
  /* eslint-enable */

  return (
    <div className="h-screen w-full relative">
      <Navbar />

      <main className="w-full h-full flex flex-row md:flex-row justify-around items-center px-2">
        <div>
          <ImageLoadPlaceholder
            width={500}
            height={400}
            imgUrl={nfts[0] ? nfts[0].imageUrl : ``}
          />
        </div>
        <div className="flex flex-col justify-around h-3/5 mt-20">
          <ImageLoadPlaceholder
            width={200}
            height={200}
            imgUrl={nfts[1] ? nfts[1].imageUrl : ``}
          />
          <ImageLoadPlaceholder
            width={200}
            height={200}
            imgUrl={nfts[2] ? nfts[2].imageUrl : ``}
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
