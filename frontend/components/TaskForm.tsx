// frontend/components/TaskForm.tsx
import React, { useState, useEffect } from 'react';

interface TaskFormProps {
    onSubmit: (task: { description: string; deadline: string; taskType: string }) => Promise<void>;
    initialTask?: { description: string; deadline: string; taskType: string };
    onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialTask, onCancel }) => {
    const [description, setDescription] = useState(initialTask?.description || '');
    const [deadline, setDeadline] = useState(initialTask?.deadline || '');
    const [taskType, setTaskType] = useState(initialTask?.taskType || 'Personal');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialTask) {
            setDescription(initialTask.description);
            setDeadline(initialTask.deadline);
            setTaskType(initialTask.taskType);
        }
    }, [initialTask]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({ description, deadline, taskType });
            if (!initialTask) {
                setDescription('');
                setDeadline('');
                setTaskType('Personal');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-2">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-2">
                <label htmlFor="deadline" className="block text-gray-700 text-sm font-bold mb-2">Deadline:</label>
                <input
                    type="date"
                    id="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="taskType" className="block text-gray-700 text-sm font-bold mb-2">Task Type:</label>
                <select
                    id="taskType"
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Study">Study</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div className="flex justify-between">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : initialTask ? 'Update Task' : 'Add Task'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default TaskForm;