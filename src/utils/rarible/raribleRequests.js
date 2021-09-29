import axios from 'axios';
import { makerAddress, assetAddresses } from '@/constants/addresses';
import { currentNetwork, creatorSplitJawz, creatorSplitKolby } from '@/config';
import { sign } from './lazyMint';

export async function generateTokenId(contract, minter) {
  console.log('generating tokenId for', contract, minter);
  const raribleTokenIdUrl = `https://api-staging.rarible.com/protocol/v0.1/ethereum/nft/collections/${contract}/generate_token_id?minter=${minter}`;
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
      { account: minter, value: creatorSplitJawz },
      { account: makerAddress.KOLBY, value: creatorSplitKolby },
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
  const raribleMintUrl =
    'https://api-staging.rarible.com/protocol/v0.1/ethereum/nft/mints';
  const raribleMintResult = await axios.post(
    raribleMintUrl,
    JSON.stringify(form),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
  console.log(raribleMintResult);
}
