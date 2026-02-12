import React, { useState } from 'react';

const QuestionForm = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        company: '',
        role: '',
        questionText: '',
        difficulty: 'Medium',
        status: 'To Learn',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Company</label>
                <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g. Google"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Role</label>
                <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g. Frontend Engineer"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Question</label>
                <textarea
                    name="questionText"
                    value={formData.questionText}
                    onChange={handleChange}
                    className="input"
                    rows="3"
                    placeholder="What was the question?"
                    required
                />
            </div>

            <div className="flex gap-4 mb-4">
                <div className="form-group flex-1">
                    <label className="form-label">Difficulty</label>
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        className="input form-select"
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>

                <div className="form-group flex-1">
                    <label className="form-label">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input form-select"
                    >
                        <option>To Learn</option>
                        <option>Learning</option>
                        <option>Mastered</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input"
                    rows="2"
                    placeholder="Any hints or approach?"
                />
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onCancel} className="btn btn-ghost">
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    Save Question
                </button>
            </div>
        </form>
    );
};

export default QuestionForm;
