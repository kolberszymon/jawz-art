import axios from 'axios';
import { contractAddresses } from '@/constants/addresses';

export async function getTokenId(NETWORK, creatorAddress) {
  const raribleUrl = `https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/collections/${contractAddresses[NETWORK]}/generate_token_id?minter=${creatorAddress}`;
  const response = await axios.get(raribleUrl);

  return response.data.tokenId;
}
