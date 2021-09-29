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
import { makerAddress, getRaribleUrl } from '@/constants/addresses';
import { currentNetwork } from '@/config';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [secsForLoading] = useState<number>(4.5);

  const connectWalletHandler = async () => {
    await provider.request({ method: `eth_requestAccounts` });
  };

  const handleButtonClick = (): void => {
    connectWalletHandler();
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, secsForLoading * 1000);
  }, [secsForLoading]);

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
    console.log(sellOrdersArray);
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
      <main className="w-full h-full flex-1 hidden md:flex justify-around items-center px-2 pt-32 pb-24 mb-10">
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
            <div className="flex flex-col w-full h-full items-center justify-around">
              {isLoading ? (
                <Loader type="TailSpin" color="#000" height={60} width={60} />
              ) : (
                <>
                  <Loader type="TailSpin" color="#000" height={60} width={60} />
                  <div className="flex flex-col w-full items-center">
                    <p className="font-bold text-xl text-center">
                      Hmmm 🤔 <br />
                      <br /> {secsForLoading} seconds passed <br /> and it still
                      didn&apos;t load?
                    </p>
                    <br />
                    <p className="font-bold">Here are some possibilities:</p>
                    <br />
                    <br />
                    <div className="w-3/5 flex flex-col items-start">
                      <p className="font-bold mb-4">
                        ⏱️ Some NFTs can be large, give it some more time
                      </p>
                      <p className="font-bold mb-4">
                        🗑️ Currently Jawz may not have any of them for sell
                      </p>
                      <p className="font-bold">
                        ❌ You choose wrong ethereum network
                      </p>
                    </div>
                  </div>
                </>
              )}
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
                <a
                  href={getRaribleUrl(
                    currentNetwork,
                    sellOrders[pickedTile].make.assetType.contract,
                    sellOrders[pickedTile].make.assetType.tokenId,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button
                    type="button"
                    className="uppercase bg-white font-bold py-2 w-40 rounded-full text-gradient shadow-sm up-on-hover border-vibyred border-2 border-solid"
                  >
                    See on Rarible
                  </button>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-2xl font-bold">Select nft to see details.</p>
          </div>
        )}
      </main>
      <main className="w-full h-full flex-1 flex md:hidden justify-center items-center px-2 pt-32 pb-24 mb-10">
        <p className="text-center font-bold">
          Don&apos;t worry! <br />
          <br />
          We did not forget about mobile users
          <br />
          <br />
          💛💛💛
          <br />
          <br />
          But right now we&apos;re more into bigger displays.
          <br />
          <br />
          If you want to see or buy some amazing art please do launch us on
          anything wider than phone
          <br />
          <br />
          <br />
          🍒 Cheers! 🍒
        </p>
      </main>

      <MetaMaskButton onClick={handleButtonClick} accounts={accounts} />
    </div>
  );
};

export default Dashboard;
