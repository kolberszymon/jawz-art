import React, { useState, useEffect } from 'react';
import { RaribleSdk } from '@rarible/protocol-ethereum-sdk';
import ImageLoadPlaceholder from '@/components/placeholders/ImageLoadPlaceholder';
import MetaMaskButton from '@/components/MetaMaskButton';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { toBigNumber } from '@rarible/types';
import NFTTile from '@/components/NFTTile';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

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
  price?: number;
  id?: number;
};

const Dashboard: React.FC<DashboardProps> = ({ provider, sdk, accounts }) => {
  const [nfts, setNfts] = useState<NftItem[]>([]);
  const [pickedTile, setPickedTile] = useState<number | null>(null);

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

    let nftMetaArray: any[] = [];
    let nftPrices: any[] = [];

    Object.keys(data.items).forEach((id) => {
      nftMetaArray.push(getNftMetaById(data.items[id].id));
      nftPrices.push(
        getNftPriceById(data.items[id].contract, data.items[id].tokenId),
      );
    });

    nftMetaArray = await Promise.all(nftMetaArray);
    nftPrices = await Promise.all(nftPrices);
    console.log(nftPrices);

    nftMetaArray = nftMetaArray.map((nft, index) => ({
      ...nft,
      price: nftPrices[index],
      id: index,
    }));

    console.log(nftMetaArray);

    setNfts(nftMetaArray);
  };

  /* eslint-disable */
  async function getNftMetaById(id: string) {
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

  async function getNftPriceById(contract: string, tokenId: string) {
    const { data } = await axios.get(
      'https://api-dev.rarible.com/protocol/v0.1/ethereum/order/orders/sell/byItem',
      {
        params: {
          contract: contract,
          tokenId: tokenId,
        },
      },
    );

    let weiPrice = data.orders[0].take.value;
    return weiPrice / 10 ** 18;
  }
  /* eslint-enable */

  const handleTileSelect = (index: number) => {
    setPickedTile(index);
  };

  return (
    <div className="h-screen w-full">
      <Navbar />
      <main className="w-full h-full flex-1 flex flex-row md:flex-row justify-around items-center px-2 pt-32 pb-24 mb-10">
        <div className="w-full flex flex-col items-center overflow-y-scroll h-full">
          {nfts.length > 0 ? (
            <div className="w-3/5">
              {nfts.map((nft) => {
                const bgColor = nft.id! === pickedTile ? `bg-ruby` : `bg-white`;

                return (
                  <NFTTile
                    bgColor={bgColor}
                    sendData={handleTileSelect}
                    index={nft.id!}
                    key={nft.id!}
                    imgSrc={nfts[nft.id!].imageUrl}
                    title={nfts[nft.id!].name}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <Loader type="TailSpin" color="#000" height={60} width={60} />
            </div>
          )}
        </div>
        {pickedTile !== null ? (
          <div className="w-full h-full bg-white mr-16 square-shadow flex flex-col justify-start items-center py-4 px-4">
            <ImageLoadPlaceholder imgUrl={nfts[pickedTile].imageUrl} />
            <div className="h-2/6 w-full bg-white mt-4 flex flex-row justify-around py-2 px-2">
              <div className="flex flex-col justify-around">
                <div className="flex flex-col">
                  <p className="text-4xl">{nfts[pickedTile].name}</p>
                  <p className="text-sm text-gray">by Jawzart</p>
                </div>
                <p className="font-light">
                  <span className="font-bold">
                    {nfts[pickedTile].price
                      ? `Listed for: ${nfts[pickedTile].price} ETH`
                      : `Not listed`}
                  </span>
                </p>
              </div>
              <div className="flex flex-col justify-around">
                <button
                  type="button"
                  className="uppercase bg-gradient font-bold text-white py-2 w-40 rounded-full shadow-sm up-on-hover"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  className="uppercase bg-white font-bold py-2 w-40 rounded-full text-gradient shadow-sm up-on-hover border-vibyred border-2 border-solid"
                >
                  See on Rarible
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-2xl font-bold">Select nft to see details.</p>
          </div>
        )}
      </main>

      <MetaMaskButton onClick={handleButtonClick} accounts={accounts} />
    </div>
  );
};

export default Dashboard;
