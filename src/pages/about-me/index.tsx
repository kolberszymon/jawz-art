import Navbar from '@/components/Navbar';
import MetaMaskButton from '@/components/MetaMaskButton';

import React, { useState } from 'react';

type CreateProps = {
  provider: any;
  accounts: string[];
};

const AboutMe: React.FC<CreateProps> = ({ provider, accounts }) => {
  const [pickedPage, setPickedPage] = useState<string>(`history`);

  const connectWalletHandler = async () => {
    await provider.request({ method: `eth_requestAccounts` });
  };

  const handleButtonClick = (): void => {
    connectWalletHandler();
  };

  const handlePageSelect = (page: string) => {
    setPickedPage(page);
  };

  return (
    <div className="h-screen w-full relative">
      <Navbar />
      <main className="w-full h-full flex flex-col justify-center items-center px-2 py-14">
        <h1 className="text-8xl mt-10">
          About <span className="text-white">me</span>_
        </h1>
        <div className="flex-1 w-full flex justify-center items-center">
          {pickedPage === `history` ? (
            <p className="w-full px-28">
              Mike (JAWZ) Vriesema was born in a small town in the Netherlands,
              80 kilometer North from Amsterdam where he was exposed to street
              art and graffiti at a very young age. In 1984 after being inspired
              by works of famous artists like Shoe, Delta and Bando he started
              to create his first pieces in and around Amsterdam which was the
              European capital city of graffiti in the early 80’s. In that time
              Amsterdam was a magnet for street artists. It was easy to meet and
              share knowledge with artists from all around the world. It
              happened that the Yaki Kornbilt gallery and a meeting with the
              famous street art photographer Henry Chalfant opened a few doors.
              During the 80’s and 90’s many pieces where made together with
              legal orders which created the necessary exposure throughout the
              Netherlands, Belgium and Germany. Since 2005 he mainly focused on
              canvas with main focus on people & tattoo’s combined with
              colourful hypnotizing backgrounds.
            </p>
          ) : (
            <ul className="px-28">
              <li>
                - 1988 Film decoration for the Dutch film “Amsterdamned”
                directed by Dick Maas
              </li>
              <li>- 1990 Expo Waterlooplein Amsterdam “Street view”</li>
              <li>
                - 1992 “Straat kunst” Openbare Bibliotheek Den Helder (NL)
              </li>
              <li>- 1993 RAS ART E.X.P.O. Alkmaar (NL)</li>
              <li>
                - 1993 “Blame it on the paint” International Graffiti Jam
                Amsterdam
              </li>
              <li>- 1996 “Graffisible” Graffiti Jam Antwerp (BE)</li>
              <li>- 1998 Boogie down expo, Turnhout (BE)</li>
              <li>- 2000 Graffiti Jam 2000 Rotterdam (NL)</li>
              <li>- 2001 UPSTAIRS Den Helder (NL)</li>
              <li>- 2002 Montana workshop LMSE festival, Den Helder (NL)</li>
              <li>- 2003/2008 Design for Dancevalley, ID&T, Heineken etc.</li>
              <li>- 2008 “Die Blaue Mauer” Graffiti Jam Berlin (GER)</li>
              <li>- 2017 Exhibition Ksiegowosc Polska, Krakow (PL)</li>
              <li>- 2018 HOMIES expo Krakow, (PL)</li>
              <li>- 2020 JAWZ EXPO, Rynek Krakow (PL)</li>
            </ul>
          )}
        </div>
      </main>
      <div className="absolute bottom-5 left-20 flex">
        <button
          type="button"
          className={`hover:text-white mr-10 ${
            pickedPage === `history` && `text-white`
          }`}
          onClick={() => handlePageSelect(`history`)}
        >
          history
        </button>
        <button
          type="button"
          className={`hover:text-white mr-10 ${
            pickedPage === `places` && `text-white`
          }`}
          onClick={() => handlePageSelect(`places`)}
        >
          places
        </button>
      </div>
      <MetaMaskButton onClick={handleButtonClick} accounts={accounts} />
    </div>
  );
};

export default AboutMe;
