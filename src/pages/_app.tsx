import { AppProps } from 'next/app';
import '../styles/global.css';
import { useEffect, useState } from 'react';
import Web3 from 'web3';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [provider, setProvider] = useState<any>();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [web3, setWeb3] = useState<Web3 | null>();

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

  useEffect(() => {
    if (web3) {
      // set current account if already connected
      web3.eth.getAccounts().then((e) => {
        setAccounts(e);
      });
    }
  }, [web3]);

  function handleInit() {
    const { ethereum } = window as any;
    if (ethereum && ethereum.isMetaMask) {
      console.log(`Ethereum successfully detected!`);
      setProvider(ethereum);

      // add listener on accountsChanged event to render actual address
      ethereum.on(`accountsChanged`, setAccounts);
      // configure web3
      setWeb3(new Web3(ethereum));
      // configure raribleSdk
    } else {
      alert(`Please install MetaMask!`);
    }
  }

  const blockchainProps = { ...pageProps, provider, accounts, web3 };

  return <Component {...blockchainProps} />;
}
