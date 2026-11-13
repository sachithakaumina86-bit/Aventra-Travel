import React, { useState } from 'react';
import { STITCH_IMAGES } from '../data/initialSeedData';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = STITCH_IMAGES.sigiriyaHero,
  className = '',
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [failed, setFailed] = useState(false);

  React.useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setFailed(false);
  }, [src, fallbackSrc]);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#0F766E] text-[#D6B56D] ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="px-4 text-center">
          <span className="font-serif text-sm tracking-widest uppercase block">AVENTRA</span>
          <span className="text-[11px] text-[#FAF9F5]/75 line-clamp-2 mt-1">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else {
          setFailed(true);
        }
      }}
      className={className}
      {...rest}
    />
  );
};
