import React, { useState, useEffect } from 'react';
import { useSyllabus } from '../context/SyllabusContext';
import { RefreshCw, CheckCircle, BookOpen, Brain, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

const Revision = () => {
    const { flatTopics, progress, updateStatus } = useSyllabus();
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);

    // Initialize/Reset Queue
    const initSession = () => {
        // Filter topics: Prioritize Learning, but also include Mastered for review
        const learning = flatTopics.filter(t => progress[t.id] === 'Learning');
        const mastered = flatTopics.filter(t => progress[t.id] === 'Mastered');

        // Strategy: Review all 'Learning' + 20% of 'Mastered' (Randomly)
        const masteredSample = mastered.sort(() => 0.5 - Math.random()).slice(0, Math.ceil(mastered.length * 0.2));

        const combined = [...learning, ...masteredSample];
        // Shuffle
        const shuffled = combined.sort(() => 0.5 - Math.random());

        setQueue(shuffled);
        setCurrentIndex(0);
        setIsRevealed(false);
        setSessionComplete(false);
    };

    useEffect(() => {
        initSession();
    }, [flatTopics.length]); // Init on load, but not on every progress update to avoid re-shuffling mid-session

    const currentTopic = queue[currentIndex];

    // Progress handlers
    const handleNext = () => {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsRevealed(false);
        } else {
            setSessionComplete(true);
        }
    };

    const handleUpdate = (status) => {
        if (!currentTopic) return;
        updateStatus(currentTopic.id, status);
        // Move to next after active updating
        handleNext();
    };

    if (queue.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <Brain className="w-20 h-20 text-slate-300 dark:text-slate-700 mb-6 transition-colors" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3 transition-colors">No Topics to Revise</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 transition-colors">
                    Start by exploring the Syllabus and marking topics as "Learning".
                </p>
                <a href="/syllabus" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition-colors shadow-lg shadow-indigo-500/20">
                    Go to Syllabus
                </a>
            </div>
        );
    }

    if (sessionComplete) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 transition-colors">
                    <Trophy className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-3 transition-colors">Session Complete!</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 transition-colors">
                    You've reviewed {queue.length} topics. Great job keeping your knowledge fresh.
                </p>
                <button
                    onClick={initSession}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <RefreshCw size={18} /> Start New Session
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 md:py-12 px-4">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 dark:from-amber-200 dark:to-yellow-500 bg-clip-text text-transparent">
                        Revision Session
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Topic {currentIndex + 1} of {queue.length}
                    </p>
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full transition-colors border border-slate-200 dark:border-slate-700">
                    {Math.round(((currentIndex) / queue.length) * 100)}% Complete
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full mb-8 overflow-hidden transition-colors">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / queue.length) * 100}%` }}
                />
            </div>

            <div className="relative perspective-1000">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-xl min-h-[400px] flex flex-col justify-between transition-colors">
                    {currentTopic && (
                        <>
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/50 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6 transition-colors">
                                    {progress[currentTopic.id] === 'Mastered' ? (
                                        <><CheckCircle size={12} className="text-emerald-500" /> Mastered</>
                                    ) : (
                                        <><BookOpen size={12} className="text-amber-500" /> Learning</>
                                    )}
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight transition-colors">
                                    {currentTopic.title}
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 transition-colors">
                                    {currentTopic.briefDescription}
                                </p>
                            </div>

                            {isRevealed ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 text-slate-700 dark:text-slate-300 text-sm leading-relaxed border border-slate-200 dark:border-slate-800/50 text-left max-h-60 overflow-y-auto transition-colors">
                                        {currentTopic.description}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleUpdate('Learning')}
                                            className="flex flex-col md:flex-row items-center justify-center gap-2 p-4 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 hover:bg-amber-200 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/20 transition-colors"
                                        >
                                            <BookOpen size={20} />
                                            <span>Needs Review</span>
                                        </button>
                                        <button
                                            onClick={() => handleUpdate('Mastered')}
                                            className="flex flex-col md:flex-row items-center justify-center gap-2 p-4 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 transition-colors"
                                        >
                                            <Trophy size={20} />
                                            <span>I Know This</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsRevealed(true)}
                                    className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-lg shadow-indigo-900/20"
                                >
                                    Reveal Details
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center px-2">
                <button
                    onClick={() => {
                        if (currentIndex > 0) {
                            setCurrentIndex(prev => prev - 1);
                            setIsRevealed(true); // reveal when going back
                        }
                    }}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ArrowLeft size={20} /> Previous
                </button>

                <button
                    onClick={handleNext}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    Skip <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Revision;
