import React from 'react';

type NFTTileProps = {
  bgColor: string;
  sendData: (index: number) => void;
  index: number;
  imgSrc: string;
  title: string;
};

const NFTTile: React.FC<NFTTileProps> = ({
  bgColor,
  sendData,
  index,
  imgSrc,
  title,
}) => {
  const handleClick = () => {
    sendData(index);
  };

  return (
    <button
      className="w-full h-20 mb-6"
      type="button"
      onClick={() => handleClick()}
      onKeyDown={() => handleClick()}
    >
      <div
        className={`flex flex-row items-center w-full h-20 square-shadow cursor-pointer  px-4 ${bgColor}`}
      >
        <img src={imgSrc} className="max-h-3/4 max-w-1/2" />
        <div className="flex-1 text-center">
          <p
            className={`font-bold text-xl ${
              bgColor === `bg-ruby` && `text-white`
            }`}
          >
            {title}
          </p>
        </div>
      </div>
    </button>
  );
};

export default NFTTile;
