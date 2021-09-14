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
    <div
      className="w-48 h-14 bg-white shadow-circle items-center rounded-full fixed bottom-4 justify-around right-8 flex px-4 cursor-pointer"
      onClick={() => handleClick}
      onKeyDown={() => handleClick}
      role="button"
      tabIndex={0}
    >
      <img src="/icons/metamask_icon.svg" width={30} height={30} />
      <p className="font-bold">{accounts.length ? `Connected` : `Connect`}</p>
    </div>
  );
};

export default MetaMaskButton;
