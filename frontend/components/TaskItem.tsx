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

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onComplete }) => {
    return (
        <li className="bg-white shadow rounded p-4 flex items-center justify-between">
            <div>
                <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.description}</h3>
                <p className="text-gray-600 text-sm">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                <p className="text-gray-600 text-sm">Type: {task.taskType}</p>
            </div>
            <div className="flex items-center space-x-2">
                {!task.completed ? (
                    <button onClick={onComplete} className="text-green-500 hover:text-green-700">
                        <MdCheckCircleOutline size={24} />
                    </button>
                ) : (
                    <MdCheckCircle size={24} className="text-green-500" />
                )}
                <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">
                    <AiFillEdit size={20} />
                </button>
                <button onClick={onDelete} className="text-red-500 hover:text-red-700">
                    <AiFillDelete size={20} />
                </button>
            </div>
        </li>
    );
};

export default TaskItem;