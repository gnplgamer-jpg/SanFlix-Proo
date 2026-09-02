import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className = "" }: AdBannerProps) {
  const adRef = useRef<any>(null);

  useEffect(() => {
    // Only push if running in production or real environment
    if (typeof window !== 'undefined') {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        if (adRef.current && adRef.current.children.length === 0) {
           adsbygoogle.push({});
        }
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden flex items-center justify-center bg-zinc-900/30 min-h-[60px] relative ${className}`}>
      <div className="absolute top-1 left-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Advertisement</div>
      {/* Replace data-ad-client and data-ad-slot with your actual Google AdSense IDs */}
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '320px', height: '50px' }}
        data-ad-client="ca-pub-8551073579787342" 
        data-ad-slot="8283186792"
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      ></ins>
    </div>
  );
}
