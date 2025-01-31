// frontend/components/TaskList.tsx
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onCompleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask, onCompleteTask }) => {
    return (
        <ul className="space-y-2">
            {tasks.map((task) => (
                <TaskItem
                    key={task._id}
                    task={task}
                    onEdit={() => onEditTask(task)}
                    onDelete={() => onDeleteTask(task._id!)} // Assuming _id is always present for existing tasks
                    onComplete={() => onCompleteTask(task._id!)}
                />
            ))}
        </ul>
    );
};

export default TaskList;