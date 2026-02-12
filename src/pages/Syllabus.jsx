import React, { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import localforage from 'localforage';
import { useSyllabus } from '../context/SyllabusContext';
import TopicTree from '../components/TopicTree';
import { Loader2, Search } from 'lucide-react';

export default function Syllabus() {
    const { syllabus, loading, progress } = useSyllabus();
    const { scrollRef } = useOutletContext();

    // Scroll Persistence
    useEffect(() => {
        if (loading || !scrollRef?.current) return;

        const restoreScroll = async () => {
            const savedY = await localforage.getItem('syllabusScrollY');
            if (savedY && scrollRef.current) {
                // A slight delay ensures content is rendered
                requestAnimationFrame(() => {
                    scrollRef.current.scrollTop = savedY;
                });
            }
        };

        restoreScroll();

        const handleScroll = () => {
            if (scrollRef.current) {
                // Simple debounce/throttle could be added but localforage is async anyway
                // We'll just save it. For high frequency, maybe debounce is better.
                localforage.setItem('syllabusScrollY', scrollRef.current.scrollTop);
            }
        };

        // Debounce storage writes
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

    // Calculate completion percentage
    // This is a rough estimation based on the progress object size vs total unique IDs
    // For a perfect bar we'd need total count from context

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
            <header className="mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                    MERN Breakdown
                </h1>
                <p className="text-slate-500 dark:text-slate-400 transition-colors">
                    Track your progress through the complete full-stack roadmap.
                </p>
            </header>

            <div className="space-y-4">
                {syllabus?.children ? (
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
                )}
            </div>
        </div>
    );
}
