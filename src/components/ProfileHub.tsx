import React, { useState, useEffect } from 'react';
import { Lock, Shield, Settings, AlertTriangle, Facebook, Youtube, Info, FileText, CheckCircle, Trash2, Smartphone, Download, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { InstallPWA } from './InstallPWA';

interface ProfileHubProps {
  user?: any;
  isAdultEnabled: boolean;
  setIsAdultEnabled: (val: boolean) => void;
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (val: boolean) => void;
  onChangeTab: (tab: string) => void;
  batterySaver: boolean;
  appLockEnabled: boolean;
  setAppLockEnabled: (val: boolean) => void;
  setBatterySaver: (val: boolean) => void;
}

export function ProfileHub({
  user,
  isAdultEnabled,
  setIsAdultEnabled,
  isAdminUnlocked,
  setIsAdminUnlocked,
  onChangeTab,
  batterySaver,
  appLockEnabled,
  setAppLockEnabled,
  setBatterySaver
}: ProfileHubProps) {
  const openInChrome = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, url: string) => {
    e.preventDefault();
    const isAndroid = /android/i.test(navigator.userAgent || "");
    if (isAndroid) {
      const intentUrl = url.replace(/^https?:\/\//, "intent://") + "#Intent;scheme=https;package=com.android.chrome;end";
      window.location.href = intentUrl;
      setTimeout(() => {
        window.open(url, "_blank");
      }, 1000);
    } else {
      window.open(url, "_blank");
    }
  };
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<'adult' | 'phub' | 'disable_pin'>('adult');
  
  // PIN Logic
  const [adultPin, setAdultPin] = useState(localStorage.getItem('SANFLIX_ADULT_PIN') || '');
  const [showPinGate, setShowPinGate] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [setupPinInput, setSetupPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Legal Popups
  const [activePopup, setActivePopup] = useState<string | null>(null);

  // Admin Update Engine
  const [updateForm, setUpdateForm] = useState({
    iconUrl: '',
    appName: '',
    packageName: '',
    description: '',
    versionCode: ''
  });
  const [liveUpdate, setLiveUpdate] = useState<any>(null);
  const [showUpdatePortal, setShowUpdatePortal] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      setLiveUpdate(e.detail);
    };
    window.addEventListener('sanflix-app-update', handleUpdate);
    return () => window.removeEventListener('sanflix-app-update', handleUpdate);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'SKR350870') {
      setIsAdminUnlocked(true);
      setError('');
      setPassword('');
    } else {
      setError('Incorrect password');
    }
  };

  const publishUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateForm.appName || !updateForm.versionCode) {
      alert("App Name and Version Code are required.");
      return;
    }
    // Dispatch global event for live update popup
    window.dispatchEvent(new CustomEvent('sanflix-app-update', { detail: updateForm }));
    // Reset form
    setUpdateForm({ iconUrl: '', appName: '', packageName: '', description: '', versionCode: '' });
  };

  const handleToggleAttempt = (target: 'adult' | 'phub') => {
    setToggleTarget(target);
    if (adultPin) {
      setPinInput('');
      setPinError('');
      setShowPinGate(true);
    } else {
      setShowAgeGate(true);
    }
  };

  const confirmPinGate = () => {
    if (pinInput === adultPin) {
      setShowPinGate(false);
      if (toggleTarget === 'disable_pin') {
        setAdultPin('');
        localStorage.removeItem('SANFLIX_ADULT_PIN');
      } else {
        setShowAgeGate(true);
      }
    } else {
      setPinError('Incorrect PIN');
    }
  };

  const savePinSetup = () => {
    if (setupPinInput.length === 4 && /^\d{4}$/.test(setupPinInput)) {
      setAdultPin(setupPinInput);
      localStorage.setItem('SANFLIX_ADULT_PIN', setupPinInput);
      setShowPinSetup(false);
      setSetupPinInput('');
      setPinError('');
    } else {
      setPinError('PIN must be exactly 4 digits');
    }
  };

  const confirmToggle = () => {
    if (toggleTarget === 'adult') {
      setIsAdultEnabled(!isAdultEnabled);
    } else {
      const currentVal = localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true';
      localStorage.setItem('SANFLIX_PHUB_ENABLED', String(!currentVal));
      window.location.reload();
    }
    setShowAgeGate(false);
  };

  const clearCache = () => {
    // Clear all application cache
    try {
      localStorage.removeItem('SANFLIX_NOTIFICATIONS');
      localStorage.removeItem('SANFLIX_HAS_NEW_NOTS');
      localStorage.removeItem('SANFLIX_CW');
      localStorage.removeItem('SANFLIX_MYLIST');
      localStorage.removeItem('SANFLIX_SEARCH_HISTORY');
      
      // Adding a small visual delay for premium feel
      const btn = document.getElementById('cache-btn');
      if (btn) btn.innerHTML = '<span class="animate-pulse">Clearing...</span>';
      setTimeout(() => {
        if (btn) btn.innerHTML = 'Cache Cleared Successfully';
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }, 800);
    } catch(e) {}
  };

  return (
    <div className="px-4 py-8 bg-[#060608] min-h-screen">
      
      {/* 1. Top Layout & Logo Modification */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-28 h-28 rounded-2xl overflow-hidden border border-[#E50914] shadow-[0_0_25px_rgba(229,9,20,0.6)] mb-4 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center relative">
          <div 
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', 
              backgroundPosition: '0 0, 10px 10px', 
              backgroundSize: '20px 20px' 
            }}
          />
          <img src="https://i.ibb.co/4gSBBzc6/34fadc44-2a42-43f4-a5de-ab551cbbf4d4.png" alt="SanFlix-Pro" className="w-full h-full object-cover z-10" />
        </div>
        <h2 className="text-sm font-bold text-[#E50914] tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]">Premium Member</h2>
      </div>

      <div className="space-y-6">
        
        {/* Old 18+ Alert Logic - Preserved */}
        <div className="bg-zinc-900/80 border border-[#E50914]/30 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-[#E50914]">Adult Content (18+)</span>
              <span className="text-xs text-zinc-400 mt-1">Enable encrypted hot networks</span>
            </div>
            <button
              onClick={() => handleToggleAttempt('adult')}
              className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${isAdultEnabled ? 'bg-[#E50914]' : 'bg-zinc-700'}`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-md ${isAdultEnabled ? 'left-8' : 'left-1'}`}
              />
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> PIN Lock</span>
              <span className="text-xs text-zinc-400 mt-0.5">
                {adultPin ? "PIN is enabled" : "Set 4-digit PIN"}
              </span>
            </div>
            <button
              onClick={() => {
                if (adultPin) {
                  setToggleTarget('disable_pin');
                  setPinInput('');
                  setPinError('');
                  setShowPinGate(true);
                } else {
                  setSetupPinInput('');
                  setPinError('');
                  setShowPinSetup(true);
                }
              }}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded font-medium transition-colors border border-white/10"
            >
              {adultPin ? 'Disable' : 'Setup'}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600/20 mt-6 to-zinc-900/80 border border-orange-500/50 rounded-xl p-4 shadow-[0_4px_20px_rgba(249,115,22,0.15)] relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                   <span className="font-bold text-white bg-black px-2 py-0.5 rounded font-mono border border-zinc-800">Porn <span className="text-orange-500">Hub</span></span>
                </div>
                <span className="text-xs text-zinc-400 mt-1">Exclusive content hub (Separate Home)</span>
              </div>
              <button
                onClick={() => handleToggleAttempt('phub')}
                className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true' ? 'bg-orange-500' : 'bg-zinc-700'}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-md ${localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true' ? 'left-8' : 'left-1'}`}
                />
              </button>
            </div>
          </div>

        {/* 2. Official Socials Section */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4 backdrop-blur-md">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2 border-l-2 border-[#E50914] pl-2">Follow Us</h3>
          <div className="grid grid-cols-1 gap-3">
            <a href="https://www.facebook.com/profile.php?id=61591278745249" onClick={(e) => openInChrome(e, 'https://www.facebook.com/profile.php?id=61591278745249')} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-[#1877F2]/20 flex items-center justify-center group-hover:bg-[#1877F2]/40 transition-colors">
                <Facebook className="w-4 h-4 text-[#1877F2]" />
              </div>
              <span className="font-medium text-sm text-zinc-200">Facebook Page</span>
            </a>
            <a href="https://tiktok.com/@sanflix.pro.offici" onClick={(e) => openInChrome(e, 'https://tiktok.com/@sanflix.pro.offici')} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-[#010101]/60 flex items-center justify-center group-hover:bg-white/10 border border-white/10 transition-colors">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </div>
              <span className="font-medium text-sm text-zinc-200">TikTok Handle</span>
            </a>
            <a href="https://youtube.com/@sanflixpro_official" onClick={(e) => openInChrome(e, 'https://youtube.com/@sanflixpro_official')} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-[#FF0000]/20 flex items-center justify-center group-hover:bg-[#FF0000]/40 transition-colors">
                <Youtube className="w-4 h-4 text-[#FF0000]" />
              </div>
              <span className="font-medium text-sm text-zinc-200">YouTube Channel</span>
            </a>
          </div>
        </div>

        {/* 3. Legal & Info Section */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4 backdrop-blur-md">
           <h3 className="font-bold text-white mb-4 flex items-center gap-2 border-l-2 border-[#E50914] pl-2">Legal & Info</h3>
           <div className="flex flex-col gap-2">
             <button onClick={() => setActivePopup('privacy')} className="flex items-center justify-between bg-zinc-800/30 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors text-left">
               <span className="text-sm font-medium text-zinc-300">Privacy Policy</span>
               <FileText className="w-4 h-4 text-zinc-500" />
             </button>
             <button onClick={() => setActivePopup('terms')} className="flex items-center justify-between bg-zinc-800/30 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors text-left">
               <span className="text-sm font-medium text-zinc-300">Terms & Conditions</span>
               <FileText className="w-4 h-4 text-zinc-500" />
             </button>
             <button onClick={() => setActivePopup('about')} className="flex items-center justify-between bg-zinc-800/30 hover:bg-zinc-800 border border-white/5 rounded-lg p-3 transition-colors text-left">
               <span className="text-sm font-medium text-zinc-300">About Us</span>
               <Info className="w-4 h-4 text-zinc-500" />
             </button>
           </div>
        </div>

        {/* 4. App Settings (Clear Cache) */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4 backdrop-blur-md">
           <h3 className="font-bold text-white mb-4 flex items-center gap-2 border-l-2 border-[#E50914] pl-2">App Settings</h3>
           
           <div className="flex items-center justify-between mb-4 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${batterySaver ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}>
                   <Smartphone className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-sm font-bold text-white">Battery Saver Mode</p>
                   <p className="text-[10px] text-zinc-400 max-w-[200px]">Limits playback to 480p and dims screen on low power.</p>
                </div>
             </div>
             <button
               onClick={() => setBatterySaver(!batterySaver)}
               className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${batterySaver ? 'bg-emerald-500' : 'bg-zinc-700'}`}
             >
               <div
                 className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-md ${batterySaver ? 'left-7' : 'left-1'}`}
               />
             </button>
           </div>

           <button 
             id="cache-btn"
             onClick={clearCache}
             className="w-full flex items-center justify-center gap-2 bg-[#E50914]/10 border border-[#E50914]/30 hover:bg-[#E50914]/20 text-[#E50914] rounded-lg p-3 font-semibold transition-all">
             <Trash2 className="w-4 h-4" />
             Clear App Cache
           </button>
        </div>

        {/* 4.5 Check for Updates Section */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4 backdrop-blur-md">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2 border-l-2 border-[#E50914] pl-2">Check for Updates</h3>
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            Make sure you are running the latest version of SANFLIX PRO for the best streaming speed, error fixes, and new features.
          </p>
          <a 
            href="https://sanflixpremuim.blogspot.com/2026/06/sanflix-pro-latest-apk.html?m=1"
            onClick={(e) => openInChrome(e, 'https://sanflixpremuim.blogspot.com/2026/06/sanflix-pro-latest-apk.html?m=1')}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#E50914] hover:bg-red-700 text-white rounded-lg p-3 font-bold transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] text-sm"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            Check Update
          </a>
        </div>

        {/* 5. Admin App Update Engine */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#E50914]" />
            <span className="font-bold text-white">Admin Access</span>
          </div>

          {!isAdminUnlocked ? (
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-3">
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:border-[#E50914] focus:outline-none transition-colors"
                />
              </div>
              {error && <p className="text-xs text-[#E50914] font-medium">{error}</p>}
              <button
                type="submit"
                className="w-full bg-[#E50914] hover:bg-red-700 text-white rounded-lg py-2.5 text-sm font-bold transition-colors shadow-[0_0_15px_rgba(229,9,20,0.4)]"
              >
                Unlock Context
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-[#E50914]/10 border border-[#E50914]/20 rounded-lg p-3 flex items-center justify-center gap-2">
                 <CheckCircle className="w-4 h-4 text-[#E50914]" />
                 <span className="text-xs text-[#E50914] font-bold tracking-wide uppercase">Administrator Unlocked</span>
              </div>
              
              {/* Previous Old Admin DB Button preserved */}
              <button
                onClick={() => onChangeTab('admin')}
                className="w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Open Database Panel
              </button>

              <button
                onClick={() => setShowUpdatePortal(!showUpdatePortal)}
                className="w-full bg-[#E50914]/10 border border-[#E50914] hover:bg-[#E50914]/20 text-[#E50914] rounded-lg py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.2)]"
              >
                <Smartphone className="w-4 h-4" />
                App Update Control
              </button>

              {/* NEW Update Portal */}
              <AnimatePresence>
                {showUpdatePortal && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 pt-4 border-t border-zinc-800">
                      <h4 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-blue-400" /> App Update Portal
                      </h4>
                      <form onSubmit={publishUpdate} className="flex flex-col gap-3">
                        <input type="text" placeholder="New App Icon URL" value={updateForm.iconUrl} onChange={e => setUpdateForm({...updateForm, iconUrl: e.target.value})} className="bg-black/50 border border-zinc-800 rounded px-3 py-2 text-xs focus:border-[#E50914] outline-none" />
                        <input type="text" placeholder="New App Name" value={updateForm.appName} onChange={e => setUpdateForm({...updateForm, appName: e.target.value})} className="bg-black/50 border border-zinc-800 rounded px-3 py-2 text-xs focus:border-[#E50914] outline-none" required />
                        <input type="text" placeholder="New Package Name" value={updateForm.packageName} onChange={e => setUpdateForm({...updateForm, packageName: e.target.value})} className="bg-black/50 border border-zinc-800 rounded px-3 py-2 text-xs focus:border-[#E50914] outline-none" />
                        <textarea placeholder="Update Description / Changelog" value={updateForm.description} onChange={e => setUpdateForm({...updateForm, description: e.target.value})} className="bg-black/50 border border-zinc-800 rounded px-3 py-2 text-xs h-20 focus:border-[#E50914] outline-none" />
                        <input type="text" placeholder="New Version Code (e.g. v2.0.1)" value={updateForm.versionCode} onChange={e => setUpdateForm({...updateForm, versionCode: e.target.value})} className="bg-black/50 border border-zinc-800 rounded px-3 py-2 text-xs focus:border-[#E50914] outline-none" required />
                        
                        <button type="submit" className="bg-[#E50914] hover:bg-red-700 text-white rounded py-2.5 text-xs font-bold transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)] mt-1 uppercase tracking-wider">
                          Publish Update Live
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setIsAdminUnlocked(false)}
                className="w-full bg-transparent hover:bg-zinc-800 text-zinc-500 rounded-lg py-2 mt-2 text-xs font-medium transition-colors"
              >
                Lock Admin Access
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popups & Modals */}

      {/* 18+ Age Gate (Old Preservation) */}
      <AnimatePresence>
        {showAgeGate && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#060608]/95 backdrop-blur-md" onClick={() => setShowAgeGate(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-sm relative z-10 rounded-3xl p-[1px] bg-gradient-to-br ${toggleTarget === 'phub' ? 'from-orange-500/80 via-zinc-800 to-orange-500/10 shadow-[0_0_40px_rgba(249,115,22,0.2)]' : 'from-[#E50914]/80 via-zinc-800 to-[#E50914]/10 shadow-[0_0_40px_rgba(229,9,20,0.2)]'}`}
            >
              <div className="w-full h-full bg-[#060608] rounded-[23px] overflow-hidden flex flex-col">
                <div className={`relative p-8 text-center pb-6 bg-gradient-to-b ${toggleTarget === 'phub' ? 'from-orange-500/10' : 'from-[#E50914]/10'} to-transparent`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border shadow-[0_0_20px_rgba(229,9,20,0.5)] animate-pulse ${toggleTarget === 'phub' ? 'bg-orange-500/20 border-orange-500/50 shadow-orange-500/30' : 'bg-[#E50914]/20 border-[#E50914]/50 shadow-[#E50914]/30'}`}>
                    <AlertTriangle className={`w-8 h-8 ${toggleTarget === 'phub' ? 'text-orange-500' : 'text-[#E50914]'}`} />
                  </div>
                  {toggleTarget === 'phub' ? (
                    <>
                      <h3 className="text-xl font-black text-orange-500 mb-2 uppercase tracking-wider">⚠️ चेतावनी (Warning)</h3>
                      <p className="text-[14px] text-zinc-300 leading-relaxed font-medium">
                        {localStorage.getItem('SANFLIX_PHUB_ENABLED') === 'true'
                          ? "आप एडल्ट (Porn) कंटेंट बंद कर रहे हैं। यह आपकी स्क्रीन से हटा दिया जाएगा।"
                          : "सावधान! आप अब एडल्ट (Porn) कंटेंट चालू कर रहे हैं। यह सामग्री केवल 18+ दर्शकों के लिए है। क्या आप सच में इसे चालू करना चाहते हैं?"}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wider text-[#E50914]">Restriction Warning</h3>
                      <p className="text-[14px] text-zinc-400 leading-relaxed font-medium">
                        {isAdultEnabled 
                          ? "You are about to hide 18+ content from your feed. It will be removed from your categories." 
                          : "You are attempting to access 18+ restricted networks. You must explicitly agree that you are over 18 years of age."}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex border-t border-white/5 bg-black/40 p-4 gap-3">
                  <button onClick={() => setShowAgeGate(false)} className="flex-1 py-3 text-zinc-400 font-bold hover:bg-white/5 transition rounded-xl text-[13px]">Cancel</button>
                  <button onClick={confirmToggle} className={`flex-1 py-3 font-bold transition rounded-xl text-[13px] ${toggleTarget === 'phub' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/50 hover:bg-orange-500 hover:text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/50 hover:bg-[#E50914] hover:text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'}`}>Agree & Continue</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PIN Gate Modal */}
      <AnimatePresence>
        {showPinGate && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#060608]/95 backdrop-blur-md" onClick={() => setShowPinGate(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm relative z-10 rounded-3xl p-[1px] bg-gradient-to-br from-zinc-600 via-zinc-800 to-zinc-900 shadow-2xl"
            >
              <div className="w-full h-full bg-[#060608] rounded-[23px] overflow-hidden flex flex-col p-6">
                <div className="text-center mb-6">
                  <Lock className="w-10 h-10 text-white mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-1">Enter PIN</h3>
                  <p className="text-sm text-zinc-400">Please enter your 4-digit adult PIN</p>
                </div>
                
                <input 
                  type="password" 
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center text-2xl tracking-[1em] text-white focus:border-[#E50914] outline-none mb-2"
                  placeholder="••••"
                  autoFocus
                />
                
                {pinError && <p className="text-red-500 text-xs text-center mb-4">{pinError}</p>}
                
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setShowPinGate(false)} className="flex-1 py-3 text-zinc-400 font-bold hover:bg-white/5 transition rounded-xl text-sm">Cancel</button>
                  <button onClick={confirmPinGate} className="flex-1 py-3 bg-white text-black font-bold hover:bg-gray-200 transition rounded-xl text-sm">Unlock</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PIN Setup Modal */}
      <AnimatePresence>
        {showPinSetup && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#060608]/95 backdrop-blur-md" onClick={() => setShowPinSetup(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm relative z-10 rounded-3xl p-[1px] bg-gradient-to-br from-zinc-600 via-zinc-800 to-zinc-900 shadow-2xl"
            >
              <div className="w-full h-full bg-[#060608] rounded-[23px] overflow-hidden flex flex-col p-6">
                <div className="text-center mb-6">
                  <Shield className="w-10 h-10 text-white mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-1">Set Up PIN</h3>
                  <p className="text-sm text-zinc-400">Create a 4-digit PIN to lock Adult Content</p>
                </div>
                
                <input 
                  type="password" 
                  maxLength={4}
                  value={setupPinInput}
                  onChange={(e) => setSetupPinInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center text-2xl tracking-[1em] text-white focus:border-[#E50914] outline-none mb-2"
                  placeholder="••••"
                  autoFocus
                />
                
                {pinError && <p className="text-red-500 text-xs text-center mb-4">{pinError}</p>}
                
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setShowPinSetup(false)} className="flex-1 py-3 text-zinc-400 font-bold hover:bg-white/5 transition rounded-xl text-sm">Cancel</button>
                  <button onClick={savePinSetup} className="flex-1 py-3 bg-[#E50914] text-white font-bold hover:bg-red-700 transition rounded-xl text-sm shadow-[0_0_15px_rgba(229,9,20,0.3)]">Save PIN</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Legal Popups */}
      <AnimatePresence>
        {activePopup && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActivePopup(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm relative z-10 bg-[#060608] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
                <h3 className="font-bold text-white text-lg">
                  {activePopup === 'privacy' && 'Privacy Policy'}
                  {activePopup === 'terms' && 'Terms & Conditions'}
                  {activePopup === 'about' && 'About Us'}
                </h3>
                <button onClick={() => setActivePopup(null)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
                  <span className="font-bold">X</span>
                </button>
              </div>
              <div className="p-5 overflow-y-auto text-sm text-zinc-300 leading-relaxed font-medium space-y-4">
                {activePopup === 'privacy' && (
                  <>
                    <p>At SanFlix-Pro, we take your privacy seriously. This policy describes how we collect and use your data.</p>
                    <p>We do not sell your personal information. Any data collected is strictly for improving your streaming experience and app functionality.</p>
                  </>
                )}
                {activePopup === 'terms' && (
                  <>
                    <p>By using SanFlix-Pro, you agree to comply with all local and international laws regarding digital content consumption.</p>
                    <div className="p-3 bg-[#E50914]/10 border-l-2 border-[#E50914] text-[#E50914] font-bold rounded">
                      ⚠️ 18+ Content Restriction: You agree that accessing Adult (18+) restricted networks inside this application requires you to be of legal age in your jurisdiction. SanFlix-Pro is not liable for unauthorized access by minors.
                    </div>
                  </>
                )}
                {activePopup === 'about' && (
                  <>
                    <p className="font-bold text-lg text-white mb-2">SanFlix-Pro</p>
                    <p>The ultimate premium streaming client developed for delivering the finest entertainment experience.</p>
                    <p className="text-zinc-500 text-xs mt-4">© 2026 SanFlix-Pro Official. All rights reserved.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Live Update App Popup Component */}
      <AnimatePresence>
        {liveUpdate && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm relative z-10 bg-gradient-to-b from-zinc-900 to-[#060608] border border-[#E50914]/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(229,9,20,0.2)] text-center overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#E50914] via-orange-500 to-[#E50914]" />
              
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-zinc-800 border-2 border-zinc-700 shadow-xl mb-4 relative">
                {liveUpdate.iconUrl ? (
                  <img src={liveUpdate.iconUrl} alt="App Icon" className="w-full h-full object-cover" />
                ) : (
                  <Smartphone className="w-10 h-10 text-zinc-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
              
              <span className="bg-[#E50914]/20 text-[#E50914] text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest mb-2 inline-block">New Update Available</span>
              <h2 className="text-2xl font-black text-white leading-tight mb-1">{liveUpdate.appName}</h2>
              <p className="text-zinc-400 font-bold text-sm mb-4">Version {liveUpdate.versionCode}</p>
              
              <div className="bg-black/50 border border-white/5 rounded-xl p-4 text-left mb-6 max-h-32 overflow-y-auto">
                <h4 className="text-xs font-bold text-zinc-300 uppercase mb-2">What's New:</h4>
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{liveUpdate.description || 'Bug fixes and performance improvements.'}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setLiveUpdate(null)} className="flex-1 py-3.5 rounded-xl font-bold text-sm text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800 transition">
                  Later
                </button>
                <button onClick={(e) => { openInChrome(e as any, 'https://sanflixpremuim.blogspot.com/2026/06/sanflix-pro-latest-apk.html?m=1'); setLiveUpdate(null); }} className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white bg-[#E50914] hover:bg-red-700 shadow-[0_0_20px_rgba(229,9,20,0.4)] transition flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Update Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

