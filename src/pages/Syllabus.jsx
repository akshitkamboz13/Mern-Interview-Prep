import React, { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import localforage from 'localforage';
import { useSyllabus } from '../context/SyllabusContext';
import TopicTree from '../components/TopicTree';
import { Loader2, Search } from 'lucide-react';

export default function Syllabus() {
    const { syllabus, loading, flatTopics } = useSyllabus();
    const { scrollRef } = useOutletContext();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState('');

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Scroll Persistence
    useEffect(() => {
        if (loading || !scrollRef?.current) return;

        const restoreScroll = async () => {
            const savedY = await localforage.getItem('syllabusScrollY');
            if (savedY && scrollRef.current) {
                requestAnimationFrame(() => {
                    scrollRef.current.scrollTop = savedY;
                });
            }
        };

        restoreScroll();

        const handleScroll = () => {
            if (scrollRef.current) {
                localforage.setItem('syllabusScrollY', scrollRef.current.scrollTop);
            }
        };

        let timeoutId;
        const debouncedScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleScroll, 100);
        };

        const container = scrollRef.current;
        container.addEventListener('scroll', debouncedScroll);

        return () => {
            container.removeEventListener('scroll', debouncedScroll);
            clearTimeout(timeoutId);
        };
    }, [loading, scrollRef]);

    const filteredTopics = React.useMemo(() => {
        if (!debouncedSearchQuery.trim()) return null;
        const lowerQuery = debouncedSearchQuery.toLowerCase();
        return flatTopics.filter(topic =>
            topic.title.toLowerCase().includes(lowerQuery) ||
            topic.description?.toLowerCase().includes(lowerQuery) ||
            topic.briefDescription?.toLowerCase().includes(lowerQuery)
        );
    }, [debouncedSearchQuery, flatTopics]);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 animate-pulse transition-colors">
                <Loader2 className="w-10 h-10 mb-4 animate-spin text-indigo-600 dark:text-indigo-500" />
                <p>Loading Syllabus...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-20">
            <header className="mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                    MERN Breakdown
                </h1>
                <p className="text-slate-500 dark:text-slate-400 transition-colors mb-6">
                    Track your progress through the complete full-stack roadmap.
                </p>

                {/* Search Bar */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search topics..."
                        className="block w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
            </header>

            <div className="space-y-4">
                {searchQuery ? (
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Found {filteredTopics?.length || 0} results
                        </h3>
                        {filteredTopics && filteredTopics.length > 0 ? (
                            <TopicTree data={filteredTopics} />
                        ) : (
                            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                <p>No topics found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                ) : (
                    syllabus?.children ? (
                        syllabus.children.map(section => (
                            <div key={section.id} className="mb-6">
                                <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3 px-1 border-l-4 border-indigo-500 pl-3 transition-colors">
                                    {section.title}
                                </h2>
                                <TopicTree data={section.children} />
                            </div>
                        ))
                    ) : (
                        <TopicTree data={syllabus} />
                    )
                )}
            </div>
        </div>
    );
}
