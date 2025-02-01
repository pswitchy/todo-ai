// frontend/components/AnalyticsDashboard.tsx
import React from 'react';
import { Task } from '../types';
import { prioritizeTasks } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

const AnalyticsDashboard: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(2) : 0;
    const [prioritizedTasks, setPrioritizedTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadPriorities = async () => {
            setLoading(true);
            try {
                const result = await prioritizeTasks(tasks);
                setPrioritizedTasks(result);
            } catch (error) {
                console.error('Failed to load priorities:', error);
            }
            setLoading(false);
        };
        if (tasks.length > 0) loadPriorities();
    }, [tasks]);
    const tasksByType = tasks.reduce((acc, task) => {
        acc[task.taskType] = (acc[task.taskType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Chart data calculations
    const priorityData = prioritizedTasks.reduce((acc, task) => {
        const priority = task.priority || 0;
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const chartData = Object.entries(priorityData).map(([key, value]) => ({
        priority: `P${key}`,
        tasks: value
    }));

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
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">AI-Powered Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Priority Distribution Chart */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Task Priority Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="priority" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="tasks" fill="#3B82F6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Priority Insights */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Top Priority Tasks</h3>
                        {loading ? (
                            <div className="animate-pulse space-y-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-12 bg-gray-200 rounded-md"></div>
                                ))}
                            </div>
                        ) : prioritizedTasks.slice(0, 3).map(task => (
                            <div key={task._id} className="p-3 bg-blue-50 rounded-md">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{task.description}</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        P{task.priority}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{task.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default AnalyticsDashboard;