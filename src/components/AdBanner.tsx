import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';
import { AD_CONFIG } from '../config/ads';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className = "" }: AdBannerProps) {
  const adRef = useRef<any>(null);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      
      // Native AdMob Banner
      const showNativeBanner = async () => {
        try {
          // Listen for errors to understand why it's not showing
          AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (info) => {
            console.error("AdMob Banner Failed:", info);
            // alert("Banner failed to load. If it's a new AdMob ID, it may take 24 hours to show ads.");
          });

          await AdMob.showBanner({
            adId: AD_CONFIG.admob.banner,
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.TOP_CENTER, // Moved to top so it doesn't block BottomNav
            margin: 60, // Push below header
            isTesting: false
          });
        } catch (e) {
          console.error("AdMob Banner Error", e);
        }
      };
      showNativeBanner();


      return () => {
        AdMob.hideBanner().catch(console.error);
        AdMob.removeBanner().catch(console.error);
      };
    } else {
      // Web AdSense Banner
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
    }
  }, []);

  if (Capacitor.isNativePlatform()) {
    // Native banner overlays the screen, no need to render DOM element except maybe a placeholder
    return <div className={`w-full min-h-[50px] ${className}`}></div>;
  }

  return (
    <div className={`w-full overflow-hidden flex items-center justify-center bg-zinc-900/30 min-h-[60px] relative ${className}`}>
      <div className="absolute top-1 left-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Advertisement</div>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '320px', height: '50px' }}
        data-ad-client={AD_CONFIG.admob.banner.split('/')[0]} 
        data-ad-slot={AD_CONFIG.admob.banner.split('/')[1]}
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      ></ins>
    </div>
  );
}
