// frontend/pages/index.tsx
import React, { useState, useEffect, useContext } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { Task } from '../types';
import { useTask } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();
    const { tasks, fetchTasks, addTask, updateTask, deleteTask, completeTask } = useTask();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        fetchTasks();
    }, [isLoggedIn, router, fetchTasks]);

    const handleAddTask = async (newTaskData: { description: string; deadline: string; taskType: string }) => {
        try {
            await addTask(newTaskData);
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    };

    const handleUpdateTask = async (updatedTaskData: { description: string; deadline: string; taskType: string }) => {
        if (!editingTask) return;
        try {
            await updateTask(editingTask._id!, updatedTaskData);
            setEditingTask(null);
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask(taskId);
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const handleCompleteTask = async (taskId: string) => {
        try {
            await completeTask(taskId);
        } catch (error) {
            console.error("Failed to complete task:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Decentralized To-Do App</h1>

            <AnalyticsDashboard tasks={tasks} />

            {editingTask ? (
                <TaskForm
                    onSubmit={handleUpdateTask}
                    initialTask={editingTask}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <TaskForm onSubmit={handleAddTask} />
            )}

            <TaskList
                tasks={tasks}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={handleDeleteTask}
                onCompleteTask={handleCompleteTask}
            />
        </div>
    );
};

export default HomePage;