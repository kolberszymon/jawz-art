import Navbar from '@/components/Navbar';
import MetaMaskButton from '@/components/MetaMaskButton';
import UploadFileInput from '@/components/UploadFileInput';
import NFTDetailsForm from '@/components/NFTDetailsForm';
import axios from 'axios';

import {
  isLazyErc721Collection,
  RaribleSdk,
} from '@rarible/protocol-ethereum-sdk';
import { toAddress, toBigNumber } from '@rarible/types';
import React, { useState } from 'react';
import { NftCollection_Type, NftItem } from '@rarible/protocol-api-client';
import { uploadToIPFS } from '@/utils/ipfs';
import {
  generateTokenId,
  createLazyMint,
  putLazyMint,
} from '@/utils/rarible/raribleRequests';
import { readFileSync } from '@/utils/readFileSync';

import { createSellOrder } from '@/utils/rarible/createOrder';
import { contractAddresses } from '@/constants/addresses';
import { sign } from '@/utils/rarible/lazyMint';
import { retry } from '@/utils/retry';

type CreateProps = {
  provider: any;
  sdk: RaribleSdk;
  accounts: string[];
};

type MintForm = {
  id: string;
  type: NftCollection_Type;
  isLazySupported: boolean;
  isLazy: boolean;
  loading: boolean;
};

type FormValues = {
  price: number;
  title: string;
  description?: string;
  royalties: number;
  inputFile: FileList;
};

const mintFormInitial: MintForm = {
  id: `0xB0EA149212Eb707a1E5FC1D2d3fD318a8d94cf05`, // default collection on "rinkeby" that supports lazy minting
  type: `ERC721`,
  isLazy: true,
  isLazySupported: true,
  loading: false,
};

const NETWORK = `RINKEBY`;

const Create: React.FC<CreateProps> = ({ provider, sdk, accounts }) => {
  const [collection, setCollection] = useState<MintForm>(mintFormInitial);
  const [statusMessage, setStatusMessage] = useState<string>(``);
  const [tokenId, setTokenId] = useState<string>(``);

  const connectWalletHandler = async () => {
    await provider.request({ method: `eth_requestAccounts` });
  };

  const handleButtonClick = (): void => {
    connectWalletHandler();
  };

  // Mint NFT

  const lazyMint = async (data: FormValues) => {
    // Reading file as array buffer
    // In order to  upload it
    const fileToUpload = data.inputFile[0];
    const fileAsArrayBuffer = await readFileSync(fileToUpload);

    if (!fileAsArrayBuffer || !accounts[0]) {
      return;
    }

    // UPLOAD TO IPFS PROPER WAY

    const ipfsImagePath: string = await uploadToIPFS(fileAsArrayBuffer);
    const res = await axios.get(`https://ipfs.infura.io/ipfs/${ipfsImagePath}`);
    const correctImageUrl = res.request?.responseURL;

    const json = {
      description: data.description || ``,
      name: data.title,
      image: correctImageUrl,
      attributes: [],
      external_url: ``,
    };

    const fullObjectHash: string = await uploadToIPFS(JSON.stringify(json));

    console.log(`hash:`, fullObjectHash);

    // LAZY MINT

    const newTokenId = await generateTokenId(collection.id, accounts[0]);
    setTokenId(newTokenId);

    const form = await createLazyMint(
      newTokenId,
      provider,
      collection.id,
      accounts[0],
      fullObjectHash,
    );

    console.log(form);
    await putLazyMint(form);

    // CREATE SELL ORDER

    const sellOrderRes = await createSellOrder(
      `MAKE_ERC721_TAKE_ETH`,
      provider,
      {
        accountAddress: accounts[0],
        makeERC721Address: collection.id,
        makeERC721TokenId: newTokenId,
        ethAmt: (data.price * 10 ** 18).toString(),
      },
    );

    if (sellOrderRes) {
      setStatusMessage(`Successfully minted and created sell order`);
    }
  };

  // HELPER FUNCTIONS

  return (
    <div className="h-screen w-full relative">
      <Navbar />

      <main className="w-full h-full flex flex-col justify-center items-center px-2">
        <NFTDetailsForm sendData={lazyMint} />
        {statusMessage && (
          <div>
            <p>{statusMessage}</p> <br />
            <p>TokenId: {tokenId}</p>
          </div>
        )}
      </main>

      <MetaMaskButton onClick={handleButtonClick} accounts={accounts} />
    </div>
  );
};

export default Create;
