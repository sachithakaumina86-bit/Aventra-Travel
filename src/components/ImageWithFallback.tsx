import React, { memo, useEffect, useRef, useState } from 'react';
import { STITCH_IMAGES } from '../data/initialSeedData';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = memo(({
  src,
  alt,
  fallbackSrc = STITCH_IMAGES.sigiriyaHero,
  priority = false,
  className = '',
  loading,
  decoding,
  fetchPriority,
  onLoad,
  onError,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(priority);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const nextSrc = src || fallbackSrc;
    setImgSrc(nextSrc);
    setFailed(false);
    setLoaded(priority);
  }, [src, fallbackSrc, priority]);

  useEffect(() => {
    if (!priority && imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [imgSrc, priority]);

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
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      decoding={decoding ?? (priority ? 'sync' : 'async')}
      fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else {
          setFailed(true);
        }
        onError?.(e);
      }}
      className={`${className} ${
        priority ? '' : `transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`
      }`}
      {...rest}
    />
  );
});

ImageWithFallback.displayName = 'ImageWithFallback';
