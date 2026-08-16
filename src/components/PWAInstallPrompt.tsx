import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle, Sparkles, ChevronRight, Apple } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAInstallPromptProps {
  isForceOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  isForceOpenModal = false,
  onCloseModal
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (isForceOpenModal) {
      setShowModal(true);
    }
  }, [isForceOpenModal]);

  useEffect(() => {
    // Check if already installed / running standalone
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    
    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if user dismissed banner recently (within 4 days)
    const dismissedAt = localStorage.getItem('pwa_banner_dismissed_at');
    const fourDaysInMs = 4 * 24 * 60 * 60 * 1000;
    const isRecentlyDismissed = dismissedAt && (Date.now() - parseInt(dismissedAt, 10) < fourDaysInMs);

    // Listen for Android / Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isRecentlyDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // On iOS Safari, show prompt banner after 2.5s if not dismissed
    if (isIosDevice && !isRecentlyDismissed) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger native install prompt on Android / Chrome
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setShowBanner(false);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('PWA install prompt error:', err);
      }
    } else {
      // Show iOS / manual instructions modal
      setShowModal(true);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_banner_dismissed_at', Date.now().toString());
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onCloseModal?.();
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Floating Bottom Install Banner */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slideUp">
          <div className="bg-white/95 dark:bg-[#1A282F]/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border-2 border-[#FFE66D] dark:border-slate-700 flex items-center justify-between gap-3">
            
            {/* App Icon preview */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0 border border-[#FFE66D]/60 bg-[#FF6B6B] flex items-center justify-center p-1">
                <img src="/favicon.svg" alt="App Icon" className="w-full h-full object-contain" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h5 className="text-xs font-black font-display text-[#1A535C] dark:text-white truncate">
                    Europe 2026 App
                  </h5>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#FFE66D] text-[#1A535C] text-[9px] font-black uppercase">
                    Free
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Install on phone for full-screen offline access
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] text-white text-xs font-black shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
              <button
                onClick={handleDismissBanner}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Install Guide Modal (especially helpful for iOS Safari) */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white dark:bg-[#1A282F] rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-[#FFE66D] dark:border-slate-800 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm bg-[#FF6B6B] p-1 flex items-center justify-center">
                  <img src="/favicon.svg" alt="App Icon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-sm font-black font-display text-[#1A535C] dark:text-white">
                    Install "Europe 2026"
                  </h4>
                  <p className="text-[11px] text-slate-400 font-semibold">
                    Home Screen Web App • Works Offline
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 text-slate-400 hover:text-[#FF6B6B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* iOS Instructions */}
            {isIOS ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Follow these 2 quick steps in Safari to add the app icon to your iPhone or iPad:
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF9F2] dark:bg-slate-800/60 border border-[#FFE66D]/80">
                    <div className="w-7 h-7 rounded-full bg-[#1A535C] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div className="text-xs text-[#1A535C] dark:text-slate-200">
                      Tap the <strong className="inline-flex items-center gap-1 font-black text-[#FF6B6B]"><Share2 className="w-3.5 h-3.5 inline" /> Share</strong> button at the bottom of Safari.
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF9F2] dark:bg-slate-800/60 border border-[#FFE66D]/80">
                    <div className="w-7 h-7 rounded-full bg-[#1A535C] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div className="text-xs text-[#1A535C] dark:text-slate-200">
                      Scroll down and tap <strong className="inline-flex items-center gap-1 font-black text-[#FF6B6B]"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</strong>.
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                    <div className="text-[11px] leading-snug">
                      Tap <strong>"Add"</strong> in top-right. The Europe 2026 app icon will appear on your home screen!
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Android / Desktop Chrome Instructions */
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Install this app on your device for instant launch and offline access:
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF9F2] dark:bg-slate-800/60 border border-[#FFE66D]/80">
                    <div className="w-7 h-7 rounded-full bg-[#1A535C] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div className="text-xs text-[#1A535C] dark:text-slate-200">
                      In Chrome, tap the <strong className="font-black text-[#1A535C] dark:text-white">three dots (⋮)</strong> menu in the top right.
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF9F2] dark:bg-slate-800/60 border border-[#FFE66D]/80">
                    <div className="w-7 h-7 rounded-full bg-[#1A535C] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div className="text-xs text-[#1A535C] dark:text-slate-200">
                      Tap <strong className="font-black text-[#FF6B6B]">"Install app"</strong> or <strong className="font-black text-[#FF6B6B]">"Add to Home screen"</strong>.
                    </div>
                  </div>
                </div>

                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install Now</span>
                  </button>
                )}
              </div>
            )}

            {/* Benefits footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" /> Full screen & 100% Offline
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="font-bold text-[#1A535C] dark:text-[#FFE66D] hover:underline cursor-pointer"
              >
                Got it
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
