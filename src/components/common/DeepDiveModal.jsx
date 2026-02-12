import React, { useEffect, useState } from 'react';

const DeepDiveModal = ({ url, onClose }) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full h-[90vh] sm:h-[85vh] sm:w-[90vw] sm:max-w-6xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-700 rounded-t-2xl sm:rounded-xl shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-bottom-10 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl sm:rounded-t-xl">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                        <span className="p-1.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-md text-indigo-600 dark:text-indigo-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </span>
                        Deep Dive Browser
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/10 transition-colors"
                        >
                            <span className="hidden sm:inline">Open Externally</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* Iframe Container */}
                <div className="flex-1 bg-white w-full relative">
                    {/* Loading Spinner / Fallback Message underneath iframe */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-0">
                        <p className="mb-2">Loading Search Results...</p>
                        <p className="text-sm text-slate-400 max-w-xs text-center">If content doesn't appear, Google may have blocked the embed. Use the "Open Externally" button.</p>
                    </div>
                    <iframe
                        src={url}
                        className="w-full h-full relative z-10"
                        frameBorder="0"
                        title="Deep Dive Search"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </div>
            </div>
        </div>
    );
};

export default DeepDiveModal;
