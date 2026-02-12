import React, { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // 1. Check if running in standalone mode (already installed)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');
        if (isStandalone) return;

        // 2. Check if dismissed recently (e.g., within 3 days)
        const dismissedAt = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissedAt) {
            const daysSinceDismissal = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissal < 3) return;
        }

        // 3. Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // 4. Capture 'beforeinstallprompt' event (Android/Chrome)
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Only show on mobile widths
            if (window.innerWidth < 768) {
                setShowPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // For iOS, just check width and show (since no event exists)
        if (isIosDevice && window.innerWidth < 768) {
            // Wait a bit before showing to not be intrusive immediately
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!isIOS && deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setShowPrompt(false);
            }
        } else {
            // For iOS, we might just expand the instructions or it's handled by rendering below
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-500 md:hidden">
            <div className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                        <div className="p-2 bg-indigo-500 rounded-xl shrink-0">
                            <Download size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-base">Install App</h3>
                            <p className="text-xs text-slate-300 mt-0.5">
                                Add to Home Screen for the best experience.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {isIOS ? (
                    <div className="text-sm text-slate-300 bg-slate-800/50 rounded-lg p-3 space-y-2 border border-slate-700/50">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-700 text-xs font-bold">1</span>
                            <span>Tap the <Share size={14} className="inline mx-1" /> Share button below</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-700 text-xs font-bold">2</span>
                            <span>Select "Add to Home Screen"</span>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleInstallClick}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98]"
                    >
                        Install Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default InstallPrompt;
