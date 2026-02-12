import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Repeat, Settings, Database, Code, Server, Globe, Crown } from 'lucide-react';
import clsx from 'clsx';
import { useSyllabus } from '../../context/SyllabusContext';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [time, setTime] = React.useState(new Date());
    const { theme } = useSyllabus();

    React.useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/syllabus', label: 'Syllabus', icon: BookOpen },
        { path: '/revision', label: 'Revision', icon: Repeat },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    // Dynamic Gradient based on Theme
    const getBrandGradient = () => {
        switch (theme) {
            case 'obsidian': return "from-fuchsia-400 to-amber-300"; // Mystic Royal
            case 'dark': return "from-amber-200 to-yellow-500"; // Pure Gold
            case 'sunrise': return "from-amber-600 to-yellow-800"; // Antique Bronze
            default: return "from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"; // Fallback (though theme is always set)
        }
    };

    const gradientClass = getBrandGradient();

    return (
        <aside className="h-full flex flex-col pt-6 pb-6 px-4">
            <div className="mb-8 px-2 block">
                <div className="flex items-center gap-2 mb-1">
                    {/* <span className="p-1 bg-amber-500/10 text-amber-500 rounded-lg">
                        <Crown size={14} />
                    </span> */}
                    <h1 className={clsx("text-xl font-bold font-luxury tracking-[0.15em] uppercase bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500", gradientClass)}>
                        VERTEX
                    </h1>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-medium ml-1">MERN Stack Mastery</p>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)} // Close on mobile navigation
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                            isActive
                                ? "bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-300"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    size={20}
                                    className={clsx("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400")}
                                />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Info: System Clock */}
            <div className="mt-auto px-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">System Online</span>
                </div>
                <div className="text-2xl font-mono font-bold text-slate-800 dark:text-slate-200 tracking-wider">
                    {time.toLocaleTimeString([], { hour12: false })}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
