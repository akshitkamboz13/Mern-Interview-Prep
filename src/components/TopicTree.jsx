import React, { useState } from 'react';
import { ChevronRight, ChevronDown, CheckCircle2, BookOpen, Clock, AlertCircle, Bookmark, Star } from 'lucide-react';
import { useSyllabus } from '../context/SyllabusContext';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// Priority Configuration
const PRIORITY_CONFIG = {
    must: { label: 'Essential', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: Star },
    imp: { label: 'Important', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertCircle },
    look: { label: 'Optional', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: Bookmark },
};

const PriorityBadge = ({ priority }) => {
    const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.look;
    const Icon = config.icon;

    return (
        <span className={clsx("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold border", config.color, config.bg, config.border)}>
            <Icon size={10} />
            {config.label}
        </span>
    );
};

// Level Color Configuration
const LEVEL_COLORS = [
    { name: 'indigo', border: 'border-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', title: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-50 dark:bg-indigo-500/10', hover: 'hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5' },
    { name: 'emerald', border: 'border-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', title: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-500/10', hover: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5' },
    { name: 'amber', border: 'border-amber-500', text: 'text-amber-600 dark:text-amber-400', title: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-500/10', hover: 'hover:bg-amber-50/50 dark:hover:bg-amber-500/5' },
    { name: 'rose', border: 'border-rose-500', text: 'text-rose-600 dark:text-rose-400', title: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-500/10', hover: 'hover:bg-rose-50/50 dark:hover:bg-rose-500/5' },
    { name: 'sky', border: 'border-sky-500', text: 'text-sky-600 dark:text-sky-400', title: 'text-sky-700 dark:text-sky-300', bg: 'bg-sky-50 dark:bg-sky-500/10', hover: 'hover:bg-sky-50/50 dark:hover:bg-sky-500/5' },
];

const getLevelStyle = (depth) => LEVEL_COLORS[depth % LEVEL_COLORS.length];

const TopicNode = ({ node, depth = 0, onDeepDive }) => {
    const { getTopicStatus, updateStatus, focusedTopicId, toggleTopicExpansion, isTopicExpanded, expandTopics } = useSyllabus();
    const isOpen = isTopicExpanded(node.id);
    const nodeRef = React.useRef(null);
    const status = getTopicStatus(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isLeaf = !hasChildren;

    const levelStyle = getLevelStyle(depth);

    // Check if this node is in the path of the focused topic
    const containsFocus = React.useMemo(() => {
        if (!focusedTopicId) return false;
        if (node.id === focusedTopicId) return true;
        const find = (n) => {
            if (n.id === focusedTopicId) return true;
            return n.children?.some(find);
        };
        return node.children?.some(find);
    }, [focusedTopicId, node]);

    // Auto-expand if in path
    React.useEffect(() => {
        if (containsFocus && !isOpen) {
            toggleTopicExpansion(node.id);
        }
    }, [containsFocus]);

    // Scroll into view if matches exactly
    React.useEffect(() => {
        if (focusedTopicId === node.id && nodeRef.current) {
            nodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [focusedTopicId, node.id]);

    const handleStatusClick = (e, newStatus) => {
        e.stopPropagation();
        updateStatus(node.id, newStatus === status ? null : newStatus);
    };

    return (
        <div className="select-none relative" ref={nodeRef}>
            <div
                className={clsx(
                    "group flex flex-col sm:flex-row sm:items-center py-3 sm:py-3 pr-2 sm:pr-4 border-b border-slate-100 dark:border-slate-800/30 transition-all duration-200 cursor-pointer border-l-4",
                    levelStyle.hover,
                    levelStyle.border,
                    isOpen && hasChildren ? levelStyle.bg : "bg-transparent"
                )}
                style={{ paddingLeft: `max(0.5rem, calc(${depth} * 1rem + 0.5rem))` }}
                onClick={() => toggleTopicExpansion(node.id)}
            >
                <div className="flex items-start w-full sm:w-auto">
                    {/* Expand/Collapse Icon */}
                    <div className={clsx("mr-2 mt-1 sm:mt-0 transition-colors flex-shrink-0", levelStyle.text)}>
                        {hasChildren ? (
                            <div className={clsx("transform transition-transform duration-200", isOpen && "rotate-90")}>
                                <ChevronRight size={18} />
                            </div>
                        ) : (
                            // Dot for leaf nodes
                            <div className="w-[18px] flex justify-center pt-1 sm:pt-0">
                                <div className={clsx("w-2 h-2 rounded-full ring-2 ring-slate-200 dark:ring-slate-900", status === 'Mastered' ? "bg-emerald-500" : status === 'Learning' ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700")} />
                            </div>
                        )}
                    </div>

                    {/* Content Wrapper */}
                    <div className="flex-1 min-w-0 mr-2">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                            <span className={clsx(
                                "font-medium transition-colors text-sm sm:text-base",
                                status === 'Mastered' ? "text-slate-500 line-through decoration-slate-400 dark:decoration-slate-600" : levelStyle.title,
                                depth === 0 && "text-base sm:text-lg font-bold" // Larger root nodes
                            )}>
                                {node.title}
                            </span>

                            {/* Priority Badge */}
                            {node.priority && <PriorityBadge priority={node.priority} />}
                        </div>

                        {node.briefDescription && (
                            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 sm:line-clamp-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                                {node.briefDescription}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-3 sm:mt-0 pl-7 sm:pl-0 sm:ml-auto">
                    <button
                        onClick={(e) => handleStatusClick(e, 'Learning')}
                        title="Mark as Learning"
                        className={clsx(
                            "flex flex-1 sm:flex-none items-center justify-center gap-2 sm:gap-0 px-3 py-1.5 sm:p-2 rounded-lg transition-all text-xs sm:text-sm font-medium border",
                            status === 'Learning'
                                ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-500/30"
                                : "text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-400"
                        )}
                    >
                        <Clock size={16} />
                        <span className="sm:hidden">Learning</span>
                    </button>
                    <button
                        onClick={(e) => handleStatusClick(e, 'Mastered')}
                        title="Mark as Mastered"
                        className={clsx(
                            "flex flex-1 sm:flex-none items-center justify-center gap-2 sm:gap-0 px-3 py-1.5 sm:p-2 rounded-lg transition-all text-xs sm:text-sm font-medium border",
                            status === 'Mastered'
                                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/30"
                                : "text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400"
                        )}
                    >
                        <CheckCircle2 size={16} />
                        <span className="sm:hidden">Done</span>
                    </button>
                </div>
            </div>

            {/* Description Panel */}
            <AnimatePresence>
                {isOpen && node.description && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className={clsx("relative border-b", levelStyle.bg, levelStyle.border)}>
                            <div
                                className="py-3 pr-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                                style={{ paddingLeft: `calc(${depth} * 1rem + 2rem)` }}
                            >
                                <div className={clsx("mb-1.5 font-medium flex items-center gap-2 text-xs uppercase tracking-wider opacity-90", levelStyle.text)}>
                                    <BookOpen size={12} />
                                    Summary
                                </div>
                                {node.description}

                                <div className={clsx("mt-4 pt-3 border-t", levelStyle.border)}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onDeepDive) {
                                                onDeepDive(`${node.title} ${node.briefDescription || ''} full tutorial`, node.id);
                                            }
                                        }}
                                        className={clsx("flex items-center gap-2 text-xs font-semibold hover:opacity-80 transition-opacity", levelStyle.text)}
                                    >
                                        <span>Deep Dive Analysis</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Children Container */}
            <AnimatePresence>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative overflow-hidden"
                    >
                        {/* Guide line - Uses current level color to indicate 'this block belongs to X' */}
                        <div
                            className={clsx("absolute top-0 bottom-0 border-l", levelStyle.border)}
                            style={{ left: `calc(${depth} * 1rem + 0.9rem)` }}
                        />
                        {node.children.map(child => (
                            <TopicNode key={child.id} node={child} depth={depth + 1} onDeepDive={onDeepDive} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function TopicTree({ data }) {
    if (!data) return null;
    const nodes = Array.isArray(data) ? data : [data];
    const { addToHistory, openDeepDive } = useSyllabus();

    return (
        <>
            <div className="border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden bg-white/50 dark:bg-slate-900/20 backdrop-blur-sm shadow-sm">
                {nodes.map(node => (
                    <TopicNode
                        key={node.id}
                        node={node}
                        onDeepDive={(query, topicId) => {
                            addToHistory(query, topicId);
                            openDeepDive(query);
                        }}
                    />
                ))}
            </div>
        </>
    );
}
