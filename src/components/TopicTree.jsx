import React, { useState } from 'react';
import { ChevronRight, ChevronDown, CheckCircle2, BookOpen, Clock, AlertCircle, Bookmark, Star } from 'lucide-react';
import { useSyllabus } from '../context/SyllabusContext';
import clsx from 'clsx';

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

const TopicNode = ({ node, depth = 0, onDeepDive }) => {
    const { getTopicStatus, updateStatus, focusedTopicId, toggleTopicExpansion, isTopicExpanded, expandTopics } = useSyllabus();
    const isOpen = isTopicExpanded(node.id);
    const nodeRef = React.useRef(null);
    const status = getTopicStatus(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isLeaf = !hasChildren;

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
            // We need to expand this node.
            // Ideally we'd expand the whole path at once from the parent, but this works distributedly too.
            // However, expanding one by one might trigger multiple saves.
            // Better: The context's `expandTopics` handles batching if we passed an array, 
            // but here we are in a recursive component.
            // Let's just toggle this one if it's not open.
            toggleTopicExpansion(node.id);
        }
    }, [containsFocus]);

    // Scroll into view if matches exactly
    React.useEffect(() => {
        if (focusedTopicId === node.id && nodeRef.current) {
            nodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight effect?
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
                    "group flex flex-col sm:flex-row sm:items-center py-3 sm:py-3 pr-2 sm:pr-4 border-b border-slate-200 dark:border-slate-800/50 transition-all duration-200 cursor-pointer",
                    "hover:bg-slate-100 dark:hover:bg-slate-800/40",
                    isOpen && hasChildren ? "bg-slate-50 dark:bg-slate-800/20" : "bg-transparent"
                )}
                style={{ paddingLeft: `max(0.5rem, calc(${depth} * 1rem + 0.5rem))` }}
                onClick={() => toggleTopicExpansion(node.id)}
            >
                <div className="flex items-start w-full sm:w-auto">
                    {/* Expand/Collapse Icon */}
                    <div className="mr-2 mt-1 sm:mt-0 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors flex-shrink-0">
                        {hasChildren ? (
                            <div className={clsx("transform transition-transform duration-200", isOpen && "rotate-90")}>
                                <ChevronRight size={18} />
                            </div>
                        ) : (
                            // Dot for leaf nodes
                            <div className="w-[18px] flex justify-center pt-1 sm:pt-0">
                                <div className={clsx("w-2 h-2 rounded-full ring-2 ring-slate-200 dark:ring-slate-900", status === 'Mastered' ? "bg-emerald-500" : status === 'Learning' ? "bg-amber-500" : "bg-slate-400 dark:bg-slate-700")} />
                            </div>
                        )}
                    </div>

                    {/* Content Wrapper */}
                    <div className="flex-1 min-w-0 mr-2">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                            <span className={clsx(
                                "font-medium transition-colors text-sm sm:text-base",
                                status === 'Mastered' ? "text-slate-500 line-through decoration-slate-400 dark:decoration-slate-600" : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white",
                                depth === 0 && "text-base sm:text-lg font-semibold text-indigo-700 dark:text-indigo-100" // Larger root nodes
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
                                : "text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-400"
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
                                : "text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400"
                        )}
                    >
                        <CheckCircle2 size={16} />
                        <span className="sm:hidden">Done</span>
                    </button>
                </div>
            </div>

            {/* Description Panel */}
            {isOpen && node.description && (
                <div className="relative bg-slate-50 dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-800/50">
                    <div
                        className="py-3 pr-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                        style={{ paddingLeft: `calc(${depth} * 1rem + 2rem)` }}
                    >
                        <div className="mb-1.5 font-medium text-slate-500 dark:text-slate-300 flex items-center gap-2 text-xs uppercase tracking-wider opacity-70">
                            <BookOpen size={12} className="text-indigo-500 dark:text-indigo-400" />
                            Summary
                        </div>
                        {node.description}

                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/50">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onDeepDive) {
                                        onDeepDive(`${node.title} ${node.briefDescription || ''} full tutorial`, node.id);
                                    }
                                }}
                                className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                            >
                                <span>Deep Dive Analysis</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Children Container */}
            {isOpen && hasChildren && (
                <div className="relative">
                    {/* Guide line */}
                    <div
                        className="absolute top-0 bottom-0 border-l border-slate-200 dark:border-slate-800/50"
                        style={{ left: `calc(${depth} * 1rem + 0.9rem)` }}
                    />
                    {node.children.map(child => (
                        <TopicNode key={child.id} node={child} depth={depth + 1} onDeepDive={onDeepDive} />
                    ))}
                </div>
            )}
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
