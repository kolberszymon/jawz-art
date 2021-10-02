import axios from 'axios';
import { makerAddress, assetAddresses } from '@/constants/addresses';
import {
  currentNetwork,
  creatorSplitJawz,
  creatorSplitKolby,
  apiDomain,
} from '@/config';
import { sign } from './lazyMint';

export async function generateTokenId(contract, minter) {
  console.log('generating tokenId for', contract, minter);
  const raribleTokenIdUrl = `${apiDomain}/protocol/v0.1/ethereum/nft/collections/${contract}/generate_token_id?minter=${minter}`;
  const { data } = await axios.get(raribleTokenIdUrl);

  const { tokenId } = data;

  return tokenId;
}

async function createLazyMintForm(
  tokenId,
  contract,
  minter,
  ipfsHash,
  royalties,
) {
  // const tokenId = await generateTokenId(contract, minter)
  console.log('generated tokenId', tokenId);
  return {
    '@type': 'ERC721',
    contract,
    tokenId,
    uri: `/ipfs/${ipfsHash}`,
    creators: [
      { account: minter, value: 10000 },
      // { account: makerAddress.KOLBY, value: creatorSplitKolby },
    ],
    royalties: [royalties],
  };
}

export async function createLazyMint(
  tokenId,
  provider,
  contract,
  minter,
  ipfsHash,
  royalties,
) {
  const form = await createLazyMintForm(
    tokenId,
    contract,
    minter,
    ipfsHash,
    royalties,
  );
  const signature = await sign(
    provider,
    assetAddresses[currentNetwork].chainId,
    contract,
    form,
    minter,
  );
  return { ...form, signatures: [signature.result] };
}

export async function putLazyMint(form) {
  const raribleMintUrl = `${apiDomain}/protocol/v0.1/ethereum/nft/mints`;
  console.log(form);
  const raribleMintResult = await axios.post(
    raribleMintUrl,
    JSON.stringify(form),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
  console.log(raribleMintResult);
}
