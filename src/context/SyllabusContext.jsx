import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';

const SyllabusContext = createContext();

export const useSyllabus = () => {
    return useContext(SyllabusContext);
};

export const SyllabusProvider = ({ children }) => {
    const [syllabus, setSyllabus] = useState(null);
    const [progress, setProgress] = useState({}); // { [topicId]: 'Learning' | 'Mastered' }
    // Theme & Appearance State
    const [themeMode, setThemeMode] = useState('auto'); // 'auto' | 'dark' | 'light' | 'obsidian' | 'sunrise'
    const [autoType, setAutoType] = useState('device'); // 'device' | 'daylight'
    const [deviceDark, setDeviceDark] = useState('dark'); // 'dark' | 'obsidian'
    const [deviceLight, setDeviceLight] = useState('light'); // 'light' | 'sunrise'
    const [effectiveTheme, setEffectiveTheme] = useState('dark'); // The actual applied theme class

    const [searchHistory, setSearchHistory] = useState([]);
    const [expandedTopics, setExpandedTopics] = useState([]); // Array of IDs
    const [expansionMode, setExpansionMode] = useState('persist'); // 'persist' | 'reset' | 'accordion'
    const [startUpMode, setStartUpMode] = useState('dashboard'); // 'dashboard' | 'last'
    const [loading, setLoading] = useState(true);
    const [flatTopics, setFlatTopics] = useState([]);

    useEffect(() => {
        // Initialize storage
        localforage.config({
            name: 'VERTEX',
            storeName: 'syllabus_progress'
        });

        const initData = async () => {
            try {
                // ... (Load Syllabus & Progress - Keeping existing code structure if possible, but for brevity re-implementing relevant parts)
                // 1. Load Syllabus Data
                const response = await fetch('/resources/MERN/MERN-roadmap-data.json');
                const data = await response.json();
                setSyllabus(data);

                // 2. Flatten topics
                const flattened = [];
                const traverse = (node) => {
                    if (node.id) flattened.push(node);
                    if (node.children) node.children.forEach(traverse);
                };
                traverse(data);
                setFlatTopics(flattened);

                // 3. Load Progress
                const storedProgress = await localforage.getItem('progress');
                if (storedProgress) setProgress(storedProgress);

                // 4. Load Theme Settings
                const storedThemeMode = await localforage.getItem('themeMode');
                if (storedThemeMode) setThemeMode(storedThemeMode);

                const storedAutoType = await localforage.getItem('autoType');
                if (storedAutoType) setAutoType(storedAutoType);

                const storedDeviceDark = await localforage.getItem('deviceDark');
                if (storedDeviceDark) setDeviceDark(storedDeviceDark);

                const storedDeviceLight = await localforage.getItem('deviceLight');
                if (storedDeviceLight) setDeviceLight(storedDeviceLight);

                // Legacy theme support (migration)
                const legacyTheme = await localforage.getItem('theme');
                if (legacyTheme && !storedThemeMode) {
                    setThemeMode(legacyTheme); // 'light' or 'dark' maps directly
                }

                // 5. Load History & Expansion
                const storedHistory = await localforage.getItem('searchHistory');
                if (storedHistory) setSearchHistory(storedHistory);

                const storedMode = await localforage.getItem('expansionMode');
                if (storedMode) setExpansionMode(storedMode);

                if (storedMode !== 'reset') {
                    const storedExpansion = await localforage.getItem('expandedTopics');
                    if (storedExpansion) setExpandedTopics(storedExpansion);
                }

                const storedStartUp = await localforage.getItem('startUpMode');
                if (storedStartUp) setStartUpMode(storedStartUp);

            } catch (err) {
                console.error('Failed to init syllabus:', err);
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, []);

    // Calculate Effective Theme
    useEffect(() => {
        const calculateTheme = () => {
            if (themeMode !== 'auto') {
                setEffectiveTheme(themeMode);
                return;
            }

            if (autoType === 'daylight') {
                const hour = new Date().getHours();
                // 06-09: Sunrise
                // 09-16: Light
                // 16-21: Obsidian? Or maybe sunset/warm? Let's stick to user request: 16-21 Obsidian, 21-06 Dark
                // User Request: "sunrise from morning 6 to 9 then 9 to 16 light then 16 to 21 obsedian then 21 to 6 dark"

                if (hour >= 6 && hour < 9) setEffectiveTheme('sunrise');
                else if (hour >= 9 && hour < 16) setEffectiveTheme('light');
                else if (hour >= 16 && hour < 21) setEffectiveTheme('obsidian'); // User asked for Obsidian in evening
                else setEffectiveTheme('dark'); // Night
            } else {
                // Device Sync
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setEffectiveTheme(prefersDark ? deviceDark : deviceLight);
            }
        };

        calculateTheme();

        // Listeners
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = () => {
            if (themeMode === 'auto' && autoType === 'device') calculateTheme();
        };
        mediaQuery.addEventListener('change', handleSystemChange);

        // Interval for time-based checks (every minute is enough)
        const interval = setInterval(calculateTheme, 60000);

        return () => {
            mediaQuery.removeEventListener('change', handleSystemChange);
            clearInterval(interval);
        };
    }, [themeMode, autoType, deviceDark, deviceLight]);

    // Apply Effective Theme to DOM
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('dark', 'light', 'obsidian', 'sunrise');

        // Map abstract themes to Tailwind classes
        // 'dark' -> class 'dark'
        // 'light' -> no class (default) or explicit 'light' if needed? Tailwind is usually dark-mode based.
        // But we might need specific classes for obsidian/sunrise to override variables.

        if (effectiveTheme === 'dark') {
            root.classList.add('dark');
        } else if (effectiveTheme === 'obsidian') {
            root.classList.add('dark', 'obsidian'); // Obsidian inherits dark but adds overrides
        } else if (effectiveTheme === 'sunrise') {
            root.classList.add('sunrise'); // Sunrise is light-based
        }
        // 'light' just removes 'dark', no extra class needed unless we want to be explicit

    }, [effectiveTheme]);

    // Save changes
    useEffect(() => {
        if (!loading) {
            localforage.setItem('progress', progress).catch(err => console.error(err));
            localforage.setItem('themeMode', themeMode).catch(err => console.error(err));
            localforage.setItem('autoType', autoType).catch(err => console.error(err));
            localforage.setItem('deviceDark', deviceDark).catch(err => console.error(err));
            localforage.setItem('deviceLight', deviceLight).catch(err => console.error(err));

            localforage.setItem('searchHistory', searchHistory).catch(err => console.error(err));
            localforage.setItem('expandedTopics', expandedTopics).catch(err => console.error(err));
            localforage.setItem('expansionMode', expansionMode).catch(err => console.error(err));
            localforage.setItem('startUpMode', startUpMode).catch(err => console.error(err));
        }
    }, [progress, themeMode, autoType, deviceDark, deviceLight, searchHistory, expandedTopics, expansionMode, startUpMode, loading]);

    const updateStatus = (topicId, status) => {
        setProgress(prev => {
            // If status is null/undefined, remove it (reset)
            if (!status) {
                const next = { ...prev };
                delete next[topicId];
                return next;
            }
            return { ...prev, [topicId]: status };
        });
    };

    const resetProgress = async () => {
        setProgress({});
        await localforage.removeItem('progress');
    };


    const [focusedTopicId, setFocusedTopicId] = useState(null);

    const addToHistory = (query, topicId) => {
        setSearchHistory(prev => {
            // Remove duplicates of same query, keep newest
            const filtered = prev.filter(item => item.query !== query);
            return [{ query, topicId, timestamp: Date.now() }, ...filtered].slice(0, 50); // Keep last 50
        });
    };

    const clearHistory = async () => {
        setSearchHistory([]);
        await localforage.removeItem('searchHistory');
    };

    const focusTopic = (topicId) => {
        setFocusedTopicId(topicId);
        // Clear focus after a delay to allow re-triggering if needed, though usually navigation handles it
        // setTimeout(() => setFocusedTopicId(null), 2000); 
    };

    const getTopicStatus = (topicId) => progress[topicId] || 'Pending';

    // Expansion Logic
    const getSiblings = (topicId) => {
        // Find the parent's children
        // We need to traverse the syllabus tree to find the parent of this topicId
        // syllabus is an object { id, children: [] } or array if using syllabus.children directly
        if (!syllabus) return [];

        let siblings = [];

        const findSiblings = (node, parent) => {
            if (node.id === topicId) {
                // Found the node, return its parent's children (minus itself)
                // If it's a top level node, parent is the root syllabus object
                if (parent && parent.children) {
                    siblings = parent.children.filter(child => child.id !== topicId).map(child => child.id);
                } else if (Array.isArray(parent)) {
                    // Top level array passed as parent
                    siblings = parent.filter(child => child.id !== topicId).map(child => child.id);
                }
                return true;
            }
            if (node.children) {
                for (let child of node.children) {
                    if (findSiblings(child, node)) return true;
                }
            }
            return false;
        };

        // Handle root
        if (syllabus.children) {
            // Syllabus is the root object
            // Check if topicId is a direct child of root first?
            // Actually, the recursion handles it if we pass syllabus as node/parent structure appropriately.
            // But findSiblings expects `node` to check `.id`. Syllabus root might have ID but we usually iterate its children.

            // Check top level siblings first
            const isTopLevel = syllabus.children.find(c => c.id === topicId);
            if (isTopLevel) {
                return syllabus.children.filter(c => c.id !== topicId).map(c => c.id);
            }

            // Recursive search
            syllabus.children.forEach(child => findSiblings(child, syllabus));
        } else if (Array.isArray(syllabus)) {
            // If syllabus is just an array
            const isTopLevel = syllabus.find(c => c.id === topicId);
            if (isTopLevel) {
                return syllabus.filter(c => c.id !== topicId).map(c => c.id);
            }
            syllabus.forEach(child => findSiblings(child, syllabus));
        }

        return siblings;
    };

    // Expansion Logic
    const toggleTopicExpansion = (topicId) => {
        setExpandedTopics(prev => {
            if (prev.includes(topicId)) {
                return prev.filter(id => id !== topicId);
            } else {
                // Opening a topic
                let newExpanded = [...prev, topicId];

                if (expansionMode === 'accordion') {
                    // Find siblings and Close them
                    const siblingIds = getSiblings(topicId);
                    if (siblingIds.length > 0) {
                        newExpanded = newExpanded.filter(id => !siblingIds.includes(id));
                    }
                }
                return newExpanded;
            }
        });
    };

    const expandTopics = (topicIds) => {
        setExpandedTopics(prev => {
            const next = new Set([...prev, ...topicIds]);
            return Array.from(next);
        });
    };

    const isTopicExpanded = (topicId) => expandedTopics.includes(topicId);

    // Deep Dive Logic
    const [deepDiveUrl, setDeepDiveUrl] = useState(null);

    const openDeepDive = (query) => {
        // Try to use Google with igu=1 (Internal Google User - often allows framing for organizations/testing)
        const url = `https://www.google.com/search?igu=1&q=${encodeURIComponent(query)}`;
        setDeepDiveUrl(url);
    };

    // PWA Install Logic
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');
        if (isStandalone) setIsInstallable(false);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    const getStats = () => {
        if (!flatTopics.length) return { total: 0, mastered: 0, learning: 0, pending: 0 };

        // We might want to count only "leaf" nodes for accurate progress, 
        // or weighted progress. For simplicity, let's count all nodes for now, 
        // or maybe just specific priority ones. 
        // Actually, simple count of all tracked items is easiest to understand.

        const total = flatTopics.length;
        let mastered = 0;
        let learning = 0;

        Object.values(progress).forEach(status => {
            if (status === 'Mastered') mastered++;
            if (status === 'Learning') learning++;
        });

        return {
            total,
            mastered,
            learning,
            pending: total - mastered - learning
        };
    };

    return (
        <SyllabusContext.Provider value={{
            syllabus,
            flatTopics,
            progress,
            theme: effectiveTheme, // Backward compatibility for consumers using 'theme'
            themeMode,
            setThemeMode,
            autoType,
            setAutoType,
            deviceDark,
            setDeviceDark,
            deviceLight,
            setDeviceLight,
            searchHistory,
            loading,
            updateStatus,
            resetProgress,
            addToHistory,
            clearHistory,
            focusedTopicId,
            focusTopic,
            getTopicStatus,
            getStats,
            toggleTopicExpansion,
            expandTopics,
            isTopicExpanded,
            expansionMode,
            setExpansionMode,
            deepDiveUrl,
            setDeepDiveUrl,
            openDeepDive,
            isInstallable,
            installApp,
            startUpMode,
            setStartUpMode
        }}>
            {children}
        </SyllabusContext.Provider>
    );
};
