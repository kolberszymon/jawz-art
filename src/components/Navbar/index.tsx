import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [isNavVisible, setIsNavVisible] = useState<boolean>(false);
  const router = useRouter();

  const handleMenuClick = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <nav className="w-full h-14 bg-transparent shadow-md fixed top-0 left-0 right-0 flex items-center px-14 justify-between z-10">
      <Link href="/">
        <h6 className="text-white uppercase font-bold cursor-pointer">
          jawzart
        </h6>
      </Link>
      <div
        className={`text-xl uppercase nav-menu nav-menu-bg ${
          isNavVisible ? `nav-menu-visible` : ``
        }`}
      >
        <div
          className={`cursor-pointer hover:text-white ${
            router.pathname === `/about-me` && `text-white`
          }`}
        >
          <Link href="/about-me">about me</Link>
        </div>
      </div>
      <div className="flex items-center md:hidden">
        <Image
          src="/icons/menu.svg"
          width={30}
          height={30}
          alt="Open menu icon"
          className="md:hidden cursor-pointer"
          onClick={handleMenuClick}
        />
      </div>
    </nav>
  );
};

export default Navbar;
