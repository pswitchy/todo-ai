// frontend/components/TaskList.tsx
import React, { useState } from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { useTask } from '../context/TaskContext';

interface TaskListProps {
    tasks: Task[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => Promise<void>;
    onCompleteTask: (taskId: string) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks: propTasks, onEditTask, onDeleteTask, onCompleteTask }) => {
    const { tasks, prioritizedTasks, loading, aiLoading, error } = useTask();
    const [viewMode, setViewMode] = useState<'all' | 'prioritized'>('all');
    const [sortBy, setSortBy] = useState<'priority' | 'deadline'>('priority');
    const [filterType, setFilterType] = useState<string>('all');

    const displayedTasks = viewMode === 'prioritized' ? prioritizedTasks : propTasks;

    const sortedTasks = [...displayedTasks].sort((a, b) => {
        if (sortBy === 'priority') {
            return (a.priority || 0) - (b.priority || 0);
        }
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    const filteredTasks = filterType === 'all' 
        ? sortedTasks 
        : sortedTasks.filter(task => task.taskType === filterType);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">View:</span>
                    <button
                        onClick={() => setViewMode('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            viewMode === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        All Tasks
                    </button>
                    <button
                        onClick={() => setViewMode('prioritized')}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            viewMode === 'prioritized'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        AI Prioritized
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'priority' | 'deadline')}
                        className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                        <option value="priority">Priority</option>
                        <option value="deadline">Deadline</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Filter:</span>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                        <option value="all">All Types</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Study">Study</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {/* AI Loading Indicator */}
            {aiLoading && viewMode === 'prioritized' && (
                <div className="flex items-center space-x-2 text-blue-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>AI is prioritizing your tasks...</span>
                </div>
            )}

            {/* Task List */}
            <ul className="space-y-2">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            onEdit={() => onEditTask(task)}
                            onDelete={() => task._id && onDeleteTask(task._id)}
                            onComplete={() => task._id && onCompleteTask(task._id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No tasks found. Add a new task to get started!
                    </div>
                )}
            </ul>

            {/* Stats */}
            <div className="text-sm text-gray-600 mt-4">
                Showing {filteredTasks.length} of {propTasks.length} tasks
                {viewMode === 'prioritized' && ' (AI prioritized)'}
            </div>
        </div>
    );
};

export default TaskList;