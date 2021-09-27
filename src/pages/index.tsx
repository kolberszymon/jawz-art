import React, { useState, useEffect } from 'react';
import ImageLoadPlaceholder from '@/components/placeholders/ImageLoadPlaceholder';
import MetaMaskButton from '@/components/MetaMaskButton';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import NFTTile from '@/components/NFTTile';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { matchOrder } from '@/utils/rarible/createOrder';
import Web3 from 'web3';
import { makerAddress } from '@/constants/addresses';

type DashboardProps = {
  provider: any;
  accounts: string[];
  web3: Web3 | null;
};

type NftItem = {
  attributes: unknown;
  description: string;
  imageUrl: string;
  name: string;
  price?: number;
  id?: number;
};

const Dashboard: React.FC<DashboardProps> = ({ provider, accounts, web3 }) => {
  const [nfts, setNfts] = useState<NftItem[]>([]);
  const [pickedTile, setPickedTile] = useState<number | null>(null);
  const [sellOrders, setSellOrders] = useState<any[]>([]);

  const connectWalletHandler = async () => {
    await provider.request({ method: `eth_requestAccounts` });
  };

  const handleButtonClick = (): void => {
    connectWalletHandler();
  };

  useEffect(() => {
    if (accounts[0] && nfts.length === 0) {
      handleGetMyNfts(makerAddress.JAWZ);
    }
  }, [accounts, nfts.length]);

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
    let sellOrdersArray: any[] = [];

    Object.keys(data.items).forEach((id) => {
      nftMetaArray.push(getNftMetaById(data.items[id].id));
      sellOrdersArray.push(
        getSellOrderById(data.items[id].contract, data.items[id].tokenId),
      );
    });

    nftMetaArray = await Promise.all(nftMetaArray);
    sellOrdersArray = await Promise.all(sellOrdersArray);

    // Creating new nftMetaArray with added price and id
    nftMetaArray = nftMetaArray.map((nft, index) => ({
      ...nft,
      price: sellOrdersArray[index].take.value / 10 ** 18,
      id: index,
    }));
    setSellOrders(sellOrdersArray);
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

  async function getSellOrderById(contract: string, tokenId: string) {
    const { data } = await axios.get(
      'https://api-dev.rarible.com/protocol/v0.1/ethereum/order/orders/sell/byItem',
      {
        params: {
          contract: contract,
          tokenId: tokenId,
        },
      },
    );

    return data.orders[0];
  }
  /* eslint-enable */

  const handleTileSelect = (index: number) => {
    setPickedTile(index);
  };

  const handleBuyNft = async (id: number) => {
    const sellOrder = sellOrders[id];
    const maker = accounts[0];

    const { hash } = sellOrder;
    const amount = sellOrder.take.value;

    await matchOrder(hash, maker, amount, web3);
  };

  return (
    <div className="h-screen w-full">
      <Navbar />
      <main className="w-full h-full flex-1 flex flex-row md:flex-row justify-around items-center px-2 pt-32 pb-24 mb-10">
        <div className="w-full flex flex-col items-center overflow-y-scroll h-full">
          {nfts.length > 0 ? (
            <div className="w-3/5">
              {nfts.map((nft, index) => {
                if (nft.id) {
                  const bgColor =
                    nft.id === pickedTile ? `bg-ruby` : `bg-white`;

                  return (
                    <NFTTile
                      bgColor={bgColor}
                      sendData={handleTileSelect}
                      index={nft.id}
                      key={nft.id}
                      imgSrc={nfts[nft.id].imageUrl}
                      title={nfts[nft.id].name}
                    />
                  );
                }
                /* eslint-disable-next-line react/no-array-index-key */
                return <div key={index} />;
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
                  onClick={() => handleBuyNft(pickedTile)}
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
