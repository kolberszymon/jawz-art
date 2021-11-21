export type NETWORKS = 'MAINNET' | 'ROPSTEN' | 'RINKEBY';

export const currentNetwork: NETWORKS = `ROPSTEN`;
export const apiDomain: string = 'https://api-dev.rarible.com';

const creatorSplitKolbyPercentage = 50;

export const creatorSplitKolby = creatorSplitKolbyPercentage * 100;
export const creatorSplitJawz = 10000 - creatorSplitKolbyPercentage * 100;

// Apparently...
// https://api.rarible.com -> Mainnet
// https://api-dev.rarible.com -> Ropsten / Rinkeby

// Metadata can be see after a few minutes
// You can refresh them in rarible
