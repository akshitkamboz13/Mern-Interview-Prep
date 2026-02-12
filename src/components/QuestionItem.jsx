import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

const QuestionItem = ({ question, onEdit, onDelete }) => {
    const difficultyColor = {
        Easy: 'badge-easy',
        Medium: 'badge-medium',
        Hard: 'badge-hard'
    }[question.difficulty] || 'badge-medium';

    return (
        <div className="card mb-4 relative group">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg">{question.company}</h3>
                    <p className="text-muted text-sm">{question.role}</p>
                </div>
                <div className="flex gap-2">
                    <span className={clsx('badge', difficultyColor)}>
                        {question.difficulty}
                    </span>
                    <span className="badge badge-status">
                        {question.status}
                    </span>
                </div>
            </div>

            <p className="mb-4 text-pretty">{question.questionText}</p>

            {question.notes && (
                <div className="bg-slate-800/50 p-3 rounded-md mb-4 text-sm text-muted">
                    <p className="font-semibold mb-1 text-xs uppercase tracking-wider">Notes</p>
                    {question.notes}
                </div>
            )}

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700/50">
                <span className="text-xs text-muted">
                    Added {formatDistanceToNow(new Date(question.dateAdded))} ago
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(question)}
                        className="p-2 hover:bg-slate-700 rounded-full transition-colors text-muted hover:text-white"
                        title="Edit"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(question.id)}
                        className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors text-muted"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionItem;
