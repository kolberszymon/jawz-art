import React, {
  useState,
  useEffect,
  DetailedHTMLProps,
  ImgHTMLAttributes,
} from 'react';
import ContentLoader from 'react-content-loader';
import Image from 'next/image';
import CSS from 'csstype';

type ImageLoadPlaceholderProps = {
  imgUrl: string;
};

const ImageLoadPlaceholder: React.FC<ImageLoadPlaceholderProps> = ({
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
    <div className="block h-4/6">
      <img src={imgUrl} onLoad={onLoad} className={` object-contain h-full`} />
      {/* {!isImageLoaded && (
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
      )} */}
    </div>
  );
};

export default ImageLoadPlaceholder;
