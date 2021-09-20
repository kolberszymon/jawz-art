import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isNavVisible, setIsNavVisible] = useState<boolean>(false);

  const handleMenuClick = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <nav className="w-full h-14 bg-white shadow-md fixed top-0 left-0 right-0 flex items-center px-14 justify-between z-10">
      <h6>jawzart</h6>
      <div
        className={`text-xl uppercase nav-menu ${
          isNavVisible ? `nav-menu-visible` : ``
        }`}
      >
        <div className="mb-6 md:mb-0 md:mr-6 cursor-pointer hover:text-red-700">
          <Link href="/">art</Link>
        </div>
        <div className="cursor-pointer hover:text-red-700">
          <Link href="/">about me</Link>
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
