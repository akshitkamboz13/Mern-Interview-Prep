import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Repeat, Settings, Database, Code, Server, Globe } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [time, setTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/tracker', label: 'Syllabus', icon: BookOpen },
        { path: '/revision', label: 'Revision', icon: Repeat },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="h-full flex flex-col pt-20 md:pt-6 pb-6 px-4">
            <div className="mb-8 px-2 hidden md:block">
                <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">
                        <Code size={20} />
                    </span>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        PrepPro
                    </h1>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 font-mono">MERN Stack Edition</p>
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
