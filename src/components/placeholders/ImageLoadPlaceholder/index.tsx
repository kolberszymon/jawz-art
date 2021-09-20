import React, { useState, useEffect } from 'react';
import ContentLoader from 'react-content-loader';
import Image from 'next/image';

type ImageLoadPlaceholderProps = {
  width: number;
  height: number;
  imgUrl: string;
};

const ImageLoadPlaceholder: React.FC<ImageLoadPlaceholderProps> = ({
  width,
  height,
  imgUrl,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  function onLoad() {
    console.log(`loaded`);
    setIsImageLoaded(true);
  }

  useEffect(() => {
    console.log(isImageLoaded);
  }, [isImageLoaded]);

  return (
    <div className=" block">
      <img
        src={imgUrl}
        onLoad={onLoad}
        className={` object-contain cursor-pointer up-on-hover ${
          !isImageLoaded ? `hidden` : `block`
        }`}
        style={{ width }}
      />
      {!isImageLoaded && (
        <ContentLoader
          speed={2}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          className={`${isImageLoaded ? `hidden` : ``}`}
        >
          <rect x="0" y="60" rx="2" ry="2" width="400" height="400" />
        </ContentLoader>
      )}
    </div>
  );
};

export default ImageLoadPlaceholder;
