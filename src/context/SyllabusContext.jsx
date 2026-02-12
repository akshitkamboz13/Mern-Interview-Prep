import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';

const SyllabusContext = createContext();

export const useSyllabus = () => {
    return useContext(SyllabusContext);
};

export const SyllabusProvider = ({ children }) => {
    const [syllabus, setSyllabus] = useState(null);
    const [progress, setProgress] = useState({}); // { [topicId]: 'Learning' | 'Mastered' }
    const [theme, setTheme] = useState('dark');
    const [searchHistory, setSearchHistory] = useState([]);
    const [expandedTopics, setExpandedTopics] = useState([]); // Array of IDs
    const [expansionMode, setExpansionMode] = useState('persist'); // 'persist' | 'reset' | 'accordion'
    const [loading, setLoading] = useState(true);
    const [flatTopics, setFlatTopics] = useState([]);

    useEffect(() => {
        // Initialize storage
        localforage.config({
            name: 'InterviewPrepPRO',
            storeName: 'syllabus_progress'
        });

        const initData = async () => {
            try {
                // 1. Load Syllabus Data
                // In a real app we might fetch this, but for now we import it or fetch from public
                const response = await fetch('/resources/MERN/MERN-roadmap-data.json');
                const data = await response.json();
                setSyllabus(data);

                // 2. Flatten topics for easy access/random selection
                const flattened = [];
                const traverse = (node) => {
                    // Only add leaf nodes or substantive nodes to the flat list for revision?
                    // actually, let's add everything that has an ID.
                    if (node.id) flattened.push(node);
                    if (node.children) node.children.forEach(traverse);
                };
                traverse(data);
                setFlatTopics(flattened);

                // 3. Load Progress
                const storedProgress = await localforage.getItem('progress');
                if (storedProgress) {
                    setProgress(storedProgress);
                }

                // 4. Load Theme & History
                const storedTheme = await localforage.getItem('theme');
                if (storedTheme) setTheme(storedTheme);

                const storedHistory = await localforage.getItem('searchHistory');
                if (storedHistory) setSearchHistory(storedHistory);

                // 5. Load Expansion Settings
                const storedMode = await localforage.getItem('expansionMode');
                if (storedMode) setExpansionMode(storedMode);

                // Only load expanded topics if we are NOT in reset mode
                // If init mode is 'reset', we just leave it empty []
                if (storedMode !== 'reset') {
                    const storedExpansion = await localforage.getItem('expandedTopics');
                    if (storedExpansion) setExpandedTopics(storedExpansion);
                }

            } catch (err) {
                console.error('Failed to init syllabus:', err);
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, []);

    // Apply Theme Side Effect
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Save changes
    useEffect(() => {
        if (!loading) {
            localforage.setItem('progress', progress).catch(err => console.error(err));
            localforage.setItem('theme', theme).catch(err => console.error(err));
            localforage.setItem('searchHistory', searchHistory).catch(err => console.error(err));
            localforage.setItem('expandedTopics', expandedTopics).catch(err => console.error(err));
            localforage.setItem('expansionMode', expansionMode).catch(err => console.error(err));
        }
    }, [progress, theme, searchHistory, expandedTopics, expansionMode, loading]);

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

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
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
            theme,
            searchHistory,
            loading,
            updateStatus,
            resetProgress,
            toggleTheme,
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
            openDeepDive
        }}>
            {children}
        </SyllabusContext.Provider>
    );
};
