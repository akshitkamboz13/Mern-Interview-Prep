import React from 'react';
import { useSyllabus } from '../context/SyllabusContext';
import { Link } from 'react-router-dom';
import { Brain, Trophy, Target, BookOpen, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const { getStats, loading } = useSyllabus();
    const stats = getStats();

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-pulse">
                <Loader2 className="w-10 h-10 mb-4 animate-spin text-indigo-500" />
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-20">
            <header className="mb-10">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                    Dashboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Track your journey through the MERN stack.
                </p>
            </header>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
                <div className="bg-white dark:bg-slate-800 p-3 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group transition-colors">
                    {/* Background Glow - Hidden on mobile */}
                    <div className="hidden sm:block absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3 mb-1 sm:mb-3 text-slate-600 dark:text-slate-300 relative z-10 transition-colors">
                        <div className="p-1.5 sm:p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/10 transition-colors">
                            <Target size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <h3 className="font-medium text-[10px] sm:text-base uppercase tracking-wider sm:tracking-normal sm:normal-case mt-1 sm:mt-0">To Learn</h3>
                    </div>
                    <div className="text-center sm:text-left relative z-10">
                        <p className="text-xl sm:text-3xl font-bold text-slate-800 dark:text-white transition-colors">{stats.pending}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 transition-colors">Pending</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group transition-colors">
                    <div className="hidden sm:block absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3 mb-1 sm:mb-3 text-slate-600 dark:text-slate-300 relative z-10 transition-colors">
                        <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/10 transition-colors">
                            <BookOpen size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <h3 className="font-medium text-[10px] sm:text-base uppercase tracking-wider sm:tracking-normal sm:normal-case mt-1 sm:mt-0">Learning</h3>
                    </div>
                    <div className="text-center sm:text-left relative z-10">
                        <p className="text-xl sm:text-3xl font-bold text-amber-500 dark:text-amber-400 transition-colors">{stats.learning}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 transition-colors">In Progress</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group transition-colors">
                    <div className="hidden sm:block absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3 mb-1 sm:mb-3 text-slate-600 dark:text-slate-300 relative z-10 transition-colors">
                        <div className="p-1.5 sm:p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/10 transition-colors">
                            <Trophy size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <h3 className="font-medium text-[10px] sm:text-base uppercase tracking-wider sm:tracking-normal sm:normal-case mt-1 sm:mt-0">Mastered</h3>
                    </div>
                    <div className="text-center sm:text-left relative z-10">
                        <p className="text-xl sm:text-3xl font-bold text-emerald-500 dark:text-emerald-400 transition-colors">{stats.mastered}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 transition-colors">Completed</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/syllabus" className="group relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-indigo-900 dark:to-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-indigo-500/30 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all shadow-sm dark:shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                        <BookOpen size={100} className="text-indigo-900 dark:text-white" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-2 transition-colors">Explore Syllabus</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-xs leading-relaxed transition-colors">
                            Browse the roadmap, mark topics as learning, and track your progress.
                        </p>
                        <span className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                            Go to Syllabus <Brain size={16} />
                        </span>
                    </div>
                </Link>

                <Link to="/revision" className="group relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-amber-900 dark:to-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-amber-500/20 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all shadow-sm dark:shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                        <Brain size={100} className="text-amber-900 dark:text-white" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-2 transition-colors">Instant Revision</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-xs leading-relaxed transition-colors">
                            Spin the wheel to test your knowledge on random topics you're learning.
                        </p>
                        <span className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                            Start Session <Brain size={16} />
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
