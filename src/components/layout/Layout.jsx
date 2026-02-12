import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useSyllabus } from '../../context/SyllabusContext';
import DeepDiveModal from '../common/DeepDiveModal';
import InstallPrompt from '../common/InstallPrompt';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const { deepDiveUrl, setDeepDiveUrl, theme } = useSyllabus();

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    const scrollRef = React.useRef(null);

    // Dynamic Gradient based on Theme
    const getBrandGradient = () => {
        switch (theme) {
            case 'obsidian': return "from-fuchsia-400 to-amber-300"; // Mystic Royal
            case 'dark': return "from-amber-200 to-yellow-500"; // Pure Gold
            case 'sunrise': return "from-amber-600 to-yellow-800"; // Antique Bronze
            default: return "from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400";
        }
    };
    const gradientClass = getBrandGradient();

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
                    <span className={clsx("font-bold font-luxury tracking-widest text-lg bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500", gradientClass)}>
                        VERTEX
                    </span>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            <Outlet context={{ scrollRef }} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Global Deep Dive Modal */}
            {deepDiveUrl && (
                <DeepDiveModal
                    url={deepDiveUrl}
                    onClose={() => setDeepDiveUrl(null)}
                />
            )}

            {/* PWA Install Prompt (Mobile Only) */}
            <InstallPrompt />
        </div>
    );
};

export default Layout;
