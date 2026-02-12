import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSyllabus } from '../context/SyllabusContext';
import { Trash2, Github, Info, AlertTriangle, Moon, Sun, Check } from 'lucide-react';
import clsx from 'clsx';

const Settings = () => {
    const { resetProgress, theme, toggleTheme, searchHistory, clearHistory, focusTopic, expansionMode, setExpansionMode, openDeepDive } = useSyllabus();

    // ... (rest of component state)

    // ... (inside history mapping)
    <button
        onClick={() => openDeepDive(item.query)}
        className="ml-2 p-1.5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
        title="Deep Dive Search"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    </button>
    const [confirmReset, setConfirmReset] = useState(false);
    const navigate = useNavigate();

    const handleReset = () => {
        if (confirmReset) {
            resetProgress();
            setConfirmReset(false);
            // Optional: Show toast
        } else {
            setConfirmReset(true);
            setTimeout(() => setConfirmReset(false), 3000); // Reset confirmation after 3s
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
                    Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 transition-colors">
                    Manage your preferences and data.
                </p>
            </header>

            <div className="space-y-8">
                {/* Visual Settings */}
                <section className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 transition-colors shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 transition-colors">
                        <Sun size={20} className="text-amber-500 dark:text-amber-400" />
                        Appearance
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-700 dark:text-slate-300 font-medium transition-colors">Theme</p>
                            <p className="text-xs text-slate-500">Customize the application look.</p>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700 transition-colors">
                            <button
                                onClick={() => theme !== 'dark' && toggleTheme()}
                                className={clsx(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                    theme === 'dark'
                                        ? "bg-slate-700 text-slate-200 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                Dark
                            </button>
                            <button
                                onClick={() => theme !== 'light' && toggleTheme()}
                                className={clsx(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                    theme === 'light'
                                        ? "bg-white text-slate-700 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                Light
                            </button>
                        </div>
                    </div>
                </section>

                {/* Sidebar Behavior */}
                <section className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 transition-colors shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 dark:text-indigo-400"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /><path d="m16 15-3-3 3-3" /></svg>
                        Sidebar Behavior
                    </h2>
                    <div className="space-y-4">
                        {/* Option 1: Persist */}
                        <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group">
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="expansionMode"
                                    className="peer sr-only"
                                    checked={expansionMode === 'persist'}
                                    onChange={() => setExpansionMode('persist')}
                                />
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-colors"></div>
                                <div className="absolute w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Stay Expanded (Default)</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Remembers exactly which topics you opened, even after you close the app.</p>
                            </div>
                        </label>

                        {/* Option 2: Reset */}
                        <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group">
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="expansionMode"
                                    className="peer sr-only"
                                    checked={expansionMode === 'reset'}
                                    onChange={() => setExpansionMode('reset')}
                                />
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-colors"></div>
                                <div className="absolute w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Collapse on Close</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Keeps topics open while you're here, but resets to all collapsed when you re-open the app.</p>
                            </div>
                        </label>

                        {/* Option 3: Accordion */}
                        <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group">
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="expansionMode"
                                    className="peer sr-only"
                                    checked={expansionMode === 'accordion'}
                                    onChange={() => setExpansionMode('accordion')}
                                />
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-colors"></div>
                                <div className="absolute w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Accordion Mode</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Focus mode. Opening a topic automatically closes its neighbors to keep the list short.</p>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Search History */}
                <section className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 dark:text-indigo-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            Search History
                        </h2>
                        {searchHistory.length > 0 && (
                            <button
                                onClick={clearHistory}
                                className="text-xs font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20"
                            >
                                Clear History
                            </button>
                        )}
                    </div>

                    {searchHistory.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                            <p>No recent searches.</p>
                            <p className="text-xs mt-1">Deep Dive into topics to see them here.</p>
                        </div>
                    ) : (
                        <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                            {searchHistory.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 hover:bg-indigo-50 dark:hover:bg-slate-700/50 transition-colors group">
                                    <div
                                        className={clsx(
                                            "truncate flex-1 font-medium text-slate-700 dark:text-slate-300 text-sm",
                                            item.topicId && "cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                                        )}
                                        onClick={() => {
                                            if (item.topicId) {
                                                focusTopic(item.topicId);
                                                navigate('/tracker');
                                            }
                                        }}
                                        title={item.topicId ? "Go to Topic" : "Topic"}
                                    >
                                        {item.query}
                                    </div>
                                    <div className="text-xs text-slate-400 min-w-[100px] text-right">
                                        {formatDate(item.timestamp)}
                                    </div>
                                    <button
                                        onClick={() => openDeepDive(item.query)}
                                        className="ml-2 p-1.5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                        title="Deep Dive Search"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Data Management (Danger Zone) */}
                <section className="bg-rose-50 dark:bg-slate-800/50 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-6 overflow-hidden relative transition-colors shadow-sm">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <AlertTriangle size={100} />
                    </div>
                    <h2 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-2 relative z-10 transition-colors">
                        <AlertTriangle size={20} />
                        Danger Zone
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div>
                            <p className="text-slate-800 dark:text-slate-200 font-medium transition-colors">Reset Progress</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 transition-colors">
                                This will permanently delete all your tracking data. All topics will be reset to "Pending". This action cannot be undone.
                            </p>
                        </div>
                        <button
                            onClick={handleReset}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${confirmReset
                                ? 'bg-rose-600 text-white hover:bg-rose-700 ring-2 ring-rose-500/50 shadow-md'
                                : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20'
                                }`}
                        >
                            {confirmReset ? (
                                <>
                                    <AlertTriangle size={16} />
                                    Confirm Reset?
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    Reset Data
                                </>
                            )}
                        </button>
                    </div>
                </section>

                {/* About */}
                <section className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 transition-colors shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 transition-colors">
                        <Info size={20} className="text-indigo-500 dark:text-indigo-400" />
                        About
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50">
                            <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Version</span>
                            <span className="text-slate-800 dark:text-slate-200 font-mono text-sm transition-colors">v1.2.0 (Beta)</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50">
                            <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Source Code</span>
                            <a
                                href="https://github.com/akshitkamboz13/Mern-Interview-Prep.git"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm transition-colors"
                            >
                                <Github size={14} />
                                View on GitHub
                            </a>
                        </div>
                        <div className="pt-2 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors">
                            Designed for effective MERN Stack preparation.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
