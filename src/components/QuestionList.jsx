import React from 'react';
import QuestionItem from './QuestionItem';

const QuestionList = ({ questions, onEdit, onDelete }) => {
    if (!questions || questions.length === 0) {
        return (
            <div className="text-center py-12 text-muted">
                <p className="text-lg">No questions added yet.</p>
                <p className="text-sm">Start by adding a question you want to master.</p>
            </div>
        );
    }

    return (
        <div className="question-list">
            {questions.map((question) => (
                <QuestionItem
                    key={question.id}
                    question={question}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default QuestionList;
