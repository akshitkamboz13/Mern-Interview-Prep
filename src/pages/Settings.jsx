import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSyllabus } from '../context/SyllabusContext';
import { Trash2, Github, Info, AlertTriangle, Moon, Sun, Check, Download, Pizza, Globe, Linkedin, Mail, Rocket } from 'lucide-react';
import clsx from 'clsx';

const Settings = () => {
    const { resetProgress, themeMode, setThemeMode, autoType, setAutoType, deviceDark, setDeviceDark, deviceLight, setDeviceLight, searchHistory, clearHistory, focusTopic, expansionMode, setExpansionMode, openDeepDive, isInstallable, installApp, startUpMode, setStartUpMode, notificationSettings, setNotificationSettings, requestNotificationPermission, sendRandomNotification } = useSyllabus();

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
                {/* Visual Settings */}
                <section className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 transition-colors shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 transition-colors">
                        <Sun size={20} className="text-amber-500 dark:text-amber-400" />
                        Appearance
                    </h2>

                    <div className="space-y-6">
                        {/* Theme Mode Selection */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-1 rounded-xl flex flex-wrap gap-1">
                            {['light', 'sunrise', 'auto', 'obsidian', 'dark'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setThemeMode(mode)}
                                    className={clsx(
                                        "flex-1 min-w-[80px] py-2 rounded-lg text-xs font-medium capitalize transition-all",
                                        themeMode === mode
                                            ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                                    )}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        {/* Auto Settings */}
                        {themeMode === 'auto' && (
                            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                                {/* Auto Logic Type */}
                                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Auto Switching Logic</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {autoType === 'device' ? 'Matches your system settings.' : 'Changes based on time of day.'}
                                        </p>
                                    </div>
                                    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                                        <button
                                            onClick={() => setAutoType('device')}
                                            className={clsx("px-3 py-1.5 rounded-md text-xs font-medium transition-all", autoType === 'device' ? "bg-white dark:bg-slate-800 shadow-sm" : "opacity-60")}
                                        >
                                            Device
                                        </button>
                                        <button
                                            onClick={() => setAutoType('daylight')}
                                            className={clsx("px-3 py-1.5 rounded-md text-xs font-medium transition-all", autoType === 'daylight' ? "bg-white dark:bg-slate-800 shadow-sm" : "opacity-60")}
                                        >
                                            Daylight
                                        </button>
                                    </div>
                                </div>

                                {/* Device Preference Logic */}
                                {autoType === 'device' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                            <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">On Light Mode</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => setDeviceLight('light')} className={clsx("flex-1 py-1.5 text-xs rounded border transition-colors", deviceLight === 'light' ? "bg-white border-slate-300 shadow-sm text-slate-900 font-medium" : "border-transparent opacity-60 text-slate-600")}>Light</button>
                                                <button onClick={() => setDeviceLight('sunrise')} className={clsx("flex-1 py-1.5 text-xs rounded border", deviceLight === 'sunrise' ? "bg-amber-50 border-amber-200 text-amber-900 shadow-sm" : "border-transparent opacity-60")}>Sunrise</button>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                            <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">On Dark Mode</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => setDeviceDark('obsidian')} className={clsx("flex-1 py-1.5 text-xs rounded border", deviceDark === 'obsidian' ? "bg-black text-white border-slate-800 shadow-sm" : "border-transparent opacity-60")}>Obsidian</button>
                                                <button onClick={() => setDeviceDark('dark')} className={clsx("flex-1 py-1.5 text-xs rounded border", deviceDark === 'dark' ? "bg-slate-800 text-white border-slate-700 shadow-sm" : "border-transparent opacity-60")}>Dark</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Daylight Info */}
                                {autoType === 'daylight' && (
                                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                                        Schedule: <span className="font-semibold">Sunrise</span> (6-9 AM) → <span className="font-semibold">Light</span> (9 AM-4 PM) → <span className="font-semibold">Obsidian</span> (4-9 PM) → <span className="font-semibold">Dark</span> (9 PM-6 AM).
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Smart Startup */}
                <section className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 transition-colors shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 dark:text-indigo-400"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
                        Smart Startup
                    </h2>
                    <div className="space-y-4">
                        {/* Option 1: Dashboard */}
                        <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group">
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="startUpMode"
                                    className="peer sr-only"
                                    checked={startUpMode === 'dashboard'}
                                    onChange={() => setStartUpMode('dashboard')}
                                />
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-colors"></div>
                                <div className="absolute w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Always Open Dashboard</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Start fresh every time you open the app.</p>
                            </div>
                        </label>

                        {/* Option 2: Resume */}
                        <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group">
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="startUpMode"
                                    className="peer sr-only"
                                    checked={startUpMode === 'last'}
                                    onChange={() => setStartUpMode('last')}
                                />
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-colors"></div>
                                <div className="absolute w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Resume Last Session</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Automatically take me back to where I was.</p>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 transition-colors shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2 transition-colors">
                        <Rocket size={20} className="text-rose-500 dark:text-rose-400" />
                        Study Reminders
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Enable Notifications</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {Notification.permission === 'denied'
                                        ? <span className="text-rose-500 font-medium">Permission blocked in browser settings.</span>
                                        : "Get random topic suggestions to keep you on track."
                                    }
                                </p>
                            </div>
                            <label className={clsx("relative inline-flex items-center cursor-pointer", Notification.permission === 'denied' && "opacity-50 pointer-events-none")}>
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={notificationSettings.enabled}
                                    disabled={Notification.permission === 'denied'}
                                    onChange={async (e) => {
                                        const isEnabled = e.target.checked;
                                        if (isEnabled) {
                                            const granted = await requestNotificationPermission();
                                            if (granted) {
                                                setNotificationSettings(prev => ({ ...prev, enabled: true }));
                                            } else {
                                                // If denied during request, force update
                                                alert("Permission denied. Please enable notifications in your browser settings.");
                                                // Trigger re-render or check
                                            }
                                        } else {
                                            setNotificationSettings(prev => ({ ...prev, enabled: false }));
                                        }
                                    }}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        {notificationSettings.enabled && (
                            <div className="animate-in slide-in-from-top-4 duration-300 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Frequency</label>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {['hourly', 'daily', 'weekly', 'custom'].map((freq) => (
                                                <button
                                                    key={freq}
                                                    onClick={() => setNotificationSettings(prev => ({ ...prev, frequency: freq }))}
                                                    className={clsx(
                                                        "py-2 rounded-lg text-xs font-medium capitalize transition-all border",
                                                        notificationSettings.frequency === freq
                                                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30"
                                                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                                    )}
                                                >
                                                    {freq}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Custom Frequency Input */}
                                        {notificationSettings.frequency === 'custom' && (
                                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/50 animate-in slide-in-from-top-2">
                                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                                    Notifications per day
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="20"
                                                        value={notificationSettings.customFrequency || ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            // Handle empty string temporarily
                                                            if (val === '') {
                                                                setNotificationSettings(prev => ({ ...prev, customFrequency: '' }));
                                                                return;
                                                            }

                                                            let num = parseInt(val);
                                                            if (!isNaN(num)) {
                                                                // Clamp immediately
                                                                if (num < 1) num = 1;
                                                                if (num > 20) num = 20;

                                                                setNotificationSettings(prev => ({
                                                                    ...prev,
                                                                    customFrequency: num,
                                                                    // Force regeneration on change (debouncing would be better but this works for now)
                                                                    lastGeneratedDate: null
                                                                }));
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            // Ensure not empty on blur
                                                            if (!notificationSettings.customFrequency) {
                                                                setNotificationSettings(prev => ({ ...prev, customFrequency: 3, lastGeneratedDate: null }));
                                                            }
                                                        }}
                                                        className="w-20 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                    />
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                        Randomly distributed with weighted probability (more in evening, less at night).
                                                        <br /> Max 20/day.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => sendRandomNotification()}
                                    className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-lg transition-colors border border-dashed border-indigo-200 dark:border-indigo-800"
                                >
                                    <Rocket size={16} />
                                    Send Test Notification
                                </button>
                            </div>
                        )}
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
                                                navigate('/syllabus');
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

                {/* App Installation (Only visible if installable) */}
                {isInstallable && (
                    <section className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2-10 10-5-10-5-10 5 10 5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                                    <Download size={20} className="text-white/90" />
                                    Install App
                                </h2>
                                <p className="text-indigo-100 text-sm max-w-xs">
                                    Install VERTEX on your device for a faster, native-like experience.
                                </p>
                            </div>
                            <button
                                onClick={installApp}
                                className="px-5 py-2.5 bg-white text-indigo-600 font-semibold rounded-xl shadow-md hover:bg-indigo-50 transition-colors active:scale-95"
                            >
                                Install
                            </button>
                        </div>
                    </section>
                )}

                {/* Support & Community (Premium BMC Card) */}
                <section className="relative overflow-hidden rounded-2xl p-0.5 shadow-lg shadow-amber-500/10 transition-transform hover:scale-[1.01] duration-300">
                    {/* Gradient Border/Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-purple-600 animate-gradient-xy"></div>

                    <div className="relative bg-white dark:bg-slate-900 rounded-[14px] p-6 h-full border border-transparent">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
                                    <span className="text-amber-500">
                                        <Pizza size={24} strokeWidth={2.5} />
                                    </span>
                                    Fuel the Development
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-md">
                                    VERTEX is built with passion to help you crack your dream job. If this roadmap helps you land a massive offer, consider buying me a pizza! 🍕
                                </p>
                            </div>

                            <a
                                href="https://www.buymeacoffee.com/akshitkamboz13"
                                target="_blank"
                                rel="noreferrer"
                                className="group relative px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg hover:shadow-amber-500/25 transition-all active:scale-95 flex items-center gap-2 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    Buy me a Pizza
                                    <Pizza size={18} />
                                </span>
                            </a>
                        </div>
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
                            <span className="text-slate-800 dark:text-slate-200 font-mono text-sm transition-colors">v{__APP_VERSION__}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50">
                            <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Developer</span>
                            <a
                                href="https://si4k.online"
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-500 dark:text-indigo-400 font-medium text-sm hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                            >
                                Akshit
                            </a>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50">
                            <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
                                Github Repository
                            </span>
                            <a
                                href="https://github.com/akshitkamboz13/VERTEX-Master-Mern-Stack"
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-500 dark:text-indigo-400 font-medium text-sm hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                            >
                                repo/Vertex
                            </a>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50">
                            <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
                                Report Issue
                            </span>
                            <a
                                href="https://github.com/akshitkamboz13/VERTEX-Master-Mern-Stack/issues"
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-500 dark:text-indigo-400 font-medium text-sm hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                            >
                                github/Issues
                            </a>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50">
                            <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
                                Privacy Policy
                            </span>
                            <Link
                                to="/privacy"
                                className="text-indigo-500 dark:text-indigo-400 font-medium text-sm hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                            >
                                Read Policy
                            </Link>
                        </div>
                        <div className="flex justify-center gap-6 py-4">
                            <a href="https://si4k.online" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-500 transition-colors" title="Website">
                                <Globe size={20} />
                            </a>
                            <a href="https://linkedin.com/in/akshitkamboz13" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" title="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://github.com/akshitkamboz13" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="GitHub">
                                <Github size={20} />
                            </a>
                            <a href="mailto:akshit@si4k.online" className="text-slate-400 hover:text-rose-500 transition-colors" title="Email">
                                <Mail size={20} />
                            </a>
                        </div>

                        <div className="pt-0 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors">
                            Designed for effective MERN Stack preparation.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
