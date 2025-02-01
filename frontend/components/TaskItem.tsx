// frontend/components/TaskItem.tsx
import React from 'react';
import { Task } from '../types';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { MdCheckCircleOutline, MdCheckCircle } from 'react-icons/md';

interface TaskItemProps {
    task: Task;
    onEdit: () => void;
    onDelete: () => void;
    onComplete: () => void;
}

const getPriorityColor = (priority: number) => {
    if (priority <= 1) return 'bg-red-100 text-red-800';
    if (priority <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
};

const TaskItem: React.FC<{
    task: Task;
    onEdit: () => void;
    onDelete: () => void;
    onComplete: () => void;
}> = ({ task, onEdit, onDelete, onComplete }) => {
    return (
        <li className="bg-white shadow rounded-lg p-4 flex items-start justify-between transition-all hover:shadow-md">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.description}
                    </h3>
                    {task.priority && (
                        <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                            P{task.priority}
                        </span>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-500">Deadline:</span>{' '}
                        <span className="font-medium">
                            {new Date(task.deadline).toLocaleDateString()}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">Type:</span>{' '}
                        <span className="font-medium">{task.taskType}</span>
                    </div>
                    {task.reason && (
                        <div className="col-span-2">
                            <span className="text-gray-500">AI Insight:</span>{' '}
                            <span className="italic text-gray-600">{task.reason}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 ml-4">
                {!task.completed ? (
                    <button 
                        onClick={onComplete}
                        className="p-1 hover:bg-green-50 rounded-full transition-colors"
                    >
                        <MdCheckCircleOutline className="text-green-500 w-6 h-6" />
                    </button>
                ) : (
                    <MdCheckCircle className="text-green-500 w-6 h-6" />
                )}
                <button 
                    onClick={onEdit}
                    className="p-1 hover:bg-blue-50 rounded-full transition-colors"
                >
                    <AiFillEdit className="text-blue-500 w-5 h-5" />
                </button>
                <button 
                    onClick={onDelete}
                    className="p-1 hover:bg-red-50 rounded-full transition-colors"
                >
                    <AiFillDelete className="text-red-500 w-5 h-5" />
                </button>
            </div>
        </li>
    );
};

export default TaskItem;