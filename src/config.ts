export type NETWORKS = 'MAINNET' | 'ROPSTEN' | 'RINKEBY';

export const currentNetwork: NETWORKS = `MAINNET`;
const creatorSplitKolbyPercentage = 50;

export const creatorSplitKolby = `${creatorSplitKolbyPercentage * 100}`;
export const creatorSplitJawz = `${10000 - creatorSplitKolbyPercentage * 100}`;
