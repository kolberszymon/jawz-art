const assetAddresses = {
  RINKEBY: {
    address: '0x6ede7f3c26975aad32a475e1021d8f6f39c89d82',
    chainId: 4,
  },
  ROPSTEN: {
    address: '0xB0EA149212Eb707a1E5FC1D2d3fD318a8d94cf05',
    chainId: 3,
  },
  MAINNET: {
    address: '0xF6793dA657495ffeFF9Ee6350824910Abc21356C',
    chainId: 1,
  },
};

const makerAddress = {
  JAWZ: '0xc5b8d196970f9506A1E6151d8E3cc284dE4F1d86',
  KOLBY: '0x79Ea2d536b5b7144A3EabdC6A7E43130199291c0',
};

const getRaribleUrl = (network, contractId, tokenId) => {
  let raribleUrl = '';

  switch (network) {
    case 'RINKEBY':
      raribleUrl = `https://rinkey.rarible.com/token/${contractId}:${tokenId}?tab=details`;
      break;
    case 'ROPSTEN':
      raribleUrl = `https://ropsten.rarible.com/token/${contractId}:${tokenId}?tab=details`;
      break;
    case 'MAINNET':
      raribleUrl = `https://rarible.com/token/${contractId}:${tokenId}?tab=details`;
      break;
    default:
      break;
  }

  return raribleUrl;
};

module.exports = { assetAddresses, makerAddress, getRaribleUrl };
