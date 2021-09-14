import React from 'react';
import ContentLoader from 'react-content-loader';

type ImagePlaceholderProps = {
  width: number;
  height: number;
};

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width,
  height,
}) => (
  <ContentLoader
    speed={2}
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="60" rx="2" ry="2" width="400" height="400" />
  </ContentLoader>
);

export default ImagePlaceholder;
