import React from 'react';

type MetaMaskButtonProps = {
  onClick: () => void;
  accounts: string[];
};

const MetaMaskButton: React.FC<MetaMaskButtonProps> = ({
  onClick,
  accounts,
}) => {
  const handleClick = function (): void {
    onClick();
  };

  return (
    <button
      className="w-48 h-14 bg-white shadow-circle items-center rounded-full fixed bottom-4 justify-around right-8  px-4 hidden md:flex"
      onClick={() => handleClick}
      onKeyDown={() => handleClick}
      tabIndex={0}
      type="button"
      disabled={!!accounts.length}
    >
      <img src="/icons/metamask_icon.svg" width={30} height={30} />
      <p className="font-bold">{accounts.length ? `Connected` : `Connect`}</p>
    </button>
  );
};

export default MetaMaskButton;
