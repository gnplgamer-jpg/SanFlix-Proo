import React, { useState, useEffect, useRef } from 'react';

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function BlurImage({ src, alt, className, ...props }: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Compute low-res placeholder if TMDB URL
  let lowResSrc = '';
  if (src && src.includes('image.tmdb.org/t/p/')) {
    lowResSrc = src.replace(/\/w\d+\//, '/w45/').replace(/\/original\//, '/w45/');
  }

  return (
    <div className={`relative overflow-hidden ${className || undefined}`} ref={imgRef}>
      {/* Low-res blurred placeholder */}
      {lowResSrc && !isLoaded && (
        <img
          src={lowResSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-md opacity-70"
          aria-hidden="true"
        />
      )}
      
      {/* Skeleton fallback if no low-res src available */}
      {!lowResSrc && !isLoaded && (
        <div className="absolute inset-0 w-full h-full bg-zinc-800 animate-pulse" />
      )}

      {/* Main high-res image */}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
}
