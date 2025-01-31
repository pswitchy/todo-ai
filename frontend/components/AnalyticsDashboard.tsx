// frontend/components/AnalyticsDashboard.tsx
import React from 'react';
import { Task } from '../types';

const AnalyticsDashboard: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(2) : 0;

    const tasksByType = tasks.reduce((acc, task) => {
        acc[task.taskType] = (acc[task.taskType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Task Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600">Total Tasks</h3>
                    <p className="text-2xl font-bold text-blue-700">{totalTasks}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600">Completed</h3>
                    <p className="text-2xl font-bold text-green-700">{completedTasks}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600">Completion Rate</h3>
                    <p className="text-2xl font-bold text-purple-700">{completionRate}%</p>
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Tasks by Type</h3>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(tasksByType).map(([type, count]) => (
                        <div key={type} className="bg-gray-50 p-3 rounded-md">
                            <span className="font-medium">{type}:</span> {count}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;