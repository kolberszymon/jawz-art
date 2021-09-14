import { AppProps } from 'next/app';
import '../styles/global.css';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { createRaribleSdk, RaribleSdk } from '@rarible/protocol-ethereum-sdk';
import { Web3Ethereum } from '@rarible/web3-ethereum';

const NETWORK = `rinkeby`;

export default function MyApp({ Component, pageProps }: AppProps) {
  const [provider, setProvider] = useState<any>();
  const [sdk, setSdk] = useState<RaribleSdk>();
  const [accounts, setAccounts] = useState<string[]>([]);

  // Initialize SDK

  useEffect(() => {
    if ((window as any).ethereum) {
      handleInit();
    } else {
      window.addEventListener(`ethereum#initalized`, handleInit, {
        once: true,
      });
      setTimeout(handleInit, 3000);
    }
  }, []);

  function handleInit() {
    const { ethereum } = window as any;
    if (ethereum && ethereum.isMetaMask) {
      console.log(`Ethereum successfully detected!`);
      setProvider(ethereum);

      // add listener on accountsChanged event to render actual address
      ethereum.on(`accountsChanged`, setAccounts);
      // configure web3
      const web3 = new Web3(ethereum);
      // configure raribleSdk
      const raribleSdk = createRaribleSdk(new Web3Ethereum({ web3 }), NETWORK);
      setSdk(raribleSdk);
      // set current account if already connected
      web3.eth.getAccounts().then((e) => {
        setAccounts(e);
      });
    } else {
      alert(`Please install MetaMask!`);
    }
  }

  const blockchainProps = { ...pageProps, provider, sdk, accounts };

  return <Component {...blockchainProps} />;
}
