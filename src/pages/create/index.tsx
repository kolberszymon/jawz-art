import Navbar from '@/components/Navbar';
import MetaMaskButton from '@/components/MetaMaskButton';
import NFTDetailsForm from '@/components/NFTDetailsForm';
import axios from 'axios';

import React, { useState } from 'react';
import { NftCollection_Type } from '@rarible/protocol-api-client';
import { uploadToIPFS } from '@/utils/ipfs';
import {
  generateTokenId,
  createLazyMint,
  putLazyMint,
} from '@/utils/rarible/raribleRequests';
import { readFileSync } from '@/utils/readFileSync';
import { currentNetwork } from '@/config';
import { assetAddresses } from '@/constants/addresses';

type CreateProps = {
  provider: any;
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
  id: assetAddresses[currentNetwork].address,
  type: `ERC721`,
  isLazy: true,
  isLazySupported: true,
  loading: false,
};

const Create: React.FC<CreateProps> = ({ provider, accounts }) => {
  const [collection] = useState<MintForm>(mintFormInitial);
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


    // UPLOAD TO IPFS PROPER WAY

    const fullObjectHash = uploadToIpfsHelper(data);

    // LAZY MINT

    const newTokenId = await generateTokenId(collection.id, accounts[0]);
    setTokenId(newTokenId);

    const form = await createLazyMint(
      newTokenId,
      provider,
      collection.id,
      accounts[0],
      fullObjectHash,
      { account: accounts[0], value: data.royalties * 100 },
    );

    console.log(form);
    const raribleMintResult = await putLazyMint(form);

    setStatusMessage(`Successfully minted token with id: ${raribleMintResult.data.id}`)

  };

  // HELPER FUNCTIONS

  const uploadToIpfsHelper = async (data:FormValues) => {
    const fileToUpload = data.inputFile[0];
    const fileAsArrayBuffer = await readFileSync(fileToUpload);

    if (!fileAsArrayBuffer || !accounts[0]) {
      return;
    }

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

    return fullObjectHash
  }

  return (
    <div className="h-screen w-full relative">
      <main className="w-full h-full flex flex-col justify-center items-center px-2">
        <NFTDetailsForm sendData={lazyMint} />
        {statusMessage && (
          <div>
            <p>{statusMessage}</p> <br />
          </div>
        )}
      </main>

      <MetaMaskButton onClick={handleButtonClick} accounts={accounts} />
    </div>
  );
};

export default Create;
