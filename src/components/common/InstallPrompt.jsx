import React, { useState, useEffect } from 'react';
import { X, Download, Share, Smartphone } from 'lucide-react';
import { useSyllabus } from '../../context/SyllabusContext';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
    const { isInstallable, installApp } = useSyllabus();
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // 1. Check if dismissing needed based on localStorage
        const dismissedAt = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissedAt) {
            const daysSinceDismissal = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissal < 3) return; // Hide for 3 days
        }

        // 2. Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

        setIsIOS(isIosDevice);

        // 3. Show prompt logic
        if (isInstallable) {
            // Android/Desktop Chrome installable
            if (window.innerWidth < 768) setShowPrompt(true);
        } else if (isIosDevice && !isStandalone && window.innerWidth < 768) {
            // iOS unique logic (since no isInstallable event)
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [isInstallable]);

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-[2px]"
                    />

                    {/* MD3 Bottom Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100) handleDismiss();
                        }}
                        className="fixed bottom-0 left-0 right-0 z-50 md:hidden touch-none"
                    >
                        <div className="bg-slate-100 dark:bg-slate-900 rounded-t-[28px] p-6 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:shadow-none border-t border-white/50 dark:border-slate-800">
                            {/* Drag Handle */}
                            <div className="w-8 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-6" />

                            <div className="flex flex-col gap-6">
                                {/* Header */}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-300">
                                        <Smartphone size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                            Install VERTEX
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            Get the full app experience. Faster access, simpler navigation, and offline support.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleDismiss}
                                        className="p-2 -mr-2 -mt-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Actions */}
                                {isIOS ? (
                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300">1</span>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Tap the <Share size={16} className="inline mx-1 text-blue-500" /> Share button</span>
                                        </div>
                                        <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50" />
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300">2</span>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Select "Add to Home Screen"</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleDismiss}
                                            className="flex-1 py-3 text-indigo-600 dark:text-indigo-300 font-medium text-sm rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
                                        >
                                            Not now
                                        </button>
                                        <button
                                            onClick={installApp}
                                            className="flex-[1.5] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-full shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            <Download size={18} />
                                            Install
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default InstallPrompt;
