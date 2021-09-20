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
import { getTokenId } from '@/utils/rarible/raribleRequests';
import { readFileSync } from '@/utils/readFileSync';

import { contractAddresses } from '@/constants/addresses';
import { sign } from '@/utils/rarible/lazyMint';
import { retry } from '@/utils/retry';

type CreateProps = {
  provider: any;
  sdk: RaribleSdk;
  accounts: string[];
};

type AccountValueObject = {
  account: string;
  value: string;
};

type LazyMintRequestBody = {
  '@type': string;
  contract: string;
  tokenId: string;
  uri: string;
  creators: Array<AccountValueObject>;
  royalties: Array<AccountValueObject>;
  signatures?: Array<string>;
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

type NFTObject = {
  name: string;
  description: string;
  image: string;
};

const mintFormInitial: MintForm = {
  id: `0x6ede7f3c26975aad32a475e1021d8f6f39c89d82`, // default collection on "rinkeby" that supports lazy minting
  type: `ERC721`,
  isLazy: true,
  isLazySupported: true,
  loading: false,
};

const NETWORK = `RINKEBY`;

const Create: React.FC<CreateProps> = ({ provider, sdk, accounts }) => {
  const [collection, setCollection] = useState<MintForm>(mintFormInitial);

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

    if (!fileAsArrayBuffer) {
      return;
    }

    // GET IPFS HASH
    // 1. Image hash
    // 2. Object hash -> Image + attributes (description, title etc.)

    const ipfsImageHash: string = (await uploadToIPFS(fileAsArrayBuffer)) || ``;

    const ipfsObject: NFTObject = {
      name: data.title,
      description: data.description || ``,
      image: `https://ipfs.infura.io/ipfs/${ipfsImageHash}`,
    };

    const ipfsObjectHash: string =
      (await uploadToIPFS(JSON.stringify(ipfsObject))) || ``;

    if (ipfsObjectHash === ``) {
      return;
    }

    const nftCollection = await sdk.apis.nftCollection.getNftCollectionById({
      collection: collection.id,
    });

    let tokenId: any;

    if (isLazyErc721Collection(nftCollection)) {
      const tokenIdRes = await sdk.nft.mint({
        collection: nftCollection,
        uri: `/ipfs/${ipfsObjectHash}`,
        creators: [{ account: toAddress(accounts[0]), value: 10000 }],
        royalties: [],
        lazy: collection.isLazy,
      });

      tokenId = tokenIdRes;
    }

    if (tokenId) {
      /**
       * Get minted nft through SDK
       */
      if (collection.isLazySupported && !collection.isLazy) {
        await retry(30, async () => {
          // wait when indexer aggregate an onChain nft
          await getTokenById(tokenId);
        });
      } else {
        await getTokenById(tokenId);
      }
    }

    // // GET TOKEN ID
    // let tokenId: string = await getTokenId(NETWORK, accounts[0]);

    // // Getting the signature
    // // 1. Create lazy mint form to send
    // // 2. Save signature, after signing
    // let lazyMintForm = createLazyMintForm(
    //   tokenId,
    //   ipfsObjectHash,
    //   accounts[0],
    //   data.royalties,
    // );

    // let signedForm: LazyMintRequestBody = await getSignedForm(
    //   provider,
    //   collection.id,
    //   lazyMintForm,
    //   accounts[0],
    // );

    // // Finally POST signedForm to rarible API
    // await putLazyMint(signedForm);
  };

  // HELPER FUNCTIONS

  const getTokenById = async (tokenId: string) => {
    const token = await sdk.apis.nftItem.getNftItemById({
      itemId: `0x6ede7f3c26975aad32a475e1021d8f6f39c89d82:${tokenId}`,
    });
    console.log(token);
  };

  // const createLazyMintForm = (
  //   tokenId: string,
  //   ipfsObjectHash: string,
  //   minter: string,
  //   royalties: number,
  // ) => {
  //   let lazyMintBody: LazyMintRequestBody = {
  //     '@type': 'ERC721',
  //     contract: contractAddresses[NETWORK],
  //     tokenId: tokenId,
  //     uri: `/ipfs/${ipfsObjectHash}`,
  //     creators: [{ account: minter, value: '10000' }],
  //     royalties: [{ account: minter, value: (royalties * 100).toString() }],
  //   };

  //   return lazyMintBody;
  // };

  // const getSignedForm = async (
  //   provider: any,
  //   contract: string,
  //   form: LazyMintRequestBody,
  //   minter: string,
  // ) => {
  //   const { result } = await sign(provider, 4, contract, form, minter);
  //   return { ...form, signatures: [result] };
  // };

  // const putLazyMint = async (form: LazyMintRequestBody) => {
  //   const raribleMintUrl =
  //     'https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/mints';
  //   console.log(form);
  //   const raribleMintResult = await axios.post(
  //     raribleMintUrl,
  //     JSON.stringify(form),
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     },
  //   );
  //   console.log(raribleMintResult);
  // };

  return (
    <div className="h-screen w-full relative">
      <Navbar />

      <main className="w-full h-full flex md:flex-row justify-center items-center px-2">
        <NFTDetailsForm sendData={lazyMint} />
      </main>

      <MetaMaskButton onClick={handleButtonClick} accounts={accounts} />
    </div>
  );
};

export default Create;
