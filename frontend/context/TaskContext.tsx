import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Task } from '../types';
import * as api from '../utils/api';
import { useAuth } from './AuthContext'; // Import useAuth

interface TaskContextType {
    tasks: Task[];
    prioritizedTasks: Task[];
    fetchTasks: () => Promise<void>;
    addTask: (newTaskData: { description: string; deadline: string; taskType: string }) => Promise<void>;
    updateTask: (taskId: string, updatedTaskData: { description: string; deadline: string; taskType: string }) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    completeTask: (taskId: string) => Promise<void>;
    prioritizeTasks: () => Promise<void>;
    loading: boolean;
    error: string | null;
    aiLoading: boolean;
    setAiLoading: (loading: boolean) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [prioritizedTasks, setPrioritizedTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { isLoggedIn } = useAuth(); // Get authentication state

    const fetchTasks = async () => {
        if (!isLoggedIn) return; // Do not fetch tasks if user is not logged in

        setLoading(true);
        setError(null);
        try {
            const fetchedTasks = await api.getTasks();
            setTasks(fetchedTasks);
        } catch (error: any) { // Capture error as any to access response details
            console.error("Failed to fetch tasks:", error);
            setError(`Failed to fetch tasks. Please try again. ${error?.response?.status === 403 ? 'Forbidden - Check Permissions.' : ''} ${error?.message}`); // More informative error
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (newTaskData: { description: string; deadline: string; taskType: string }) => {
        setLoading(true);
        setError(null);
        try {
            const taskWithCompleted = { ...newTaskData, completed: false };
            await api.createTask(taskWithCompleted);
            await fetchTasks();
        } catch (error) {
            console.error("Failed to add task:", error);
            setError("Failed to add task. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async (taskId: string, updatedTaskData: { description: string; deadline: string; taskType: string }) => {
        setLoading(true);
        setError(null);
        try {
            await api.updateTask(taskId, updatedTaskData);
            await fetchTasks();
        } catch (error) {
            console.error("Failed to update task:", error);
            setError("Failed to update task. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (taskId: string) => {
        setLoading(true);
        setError(null);
        try {
            await api.deleteTask(taskId);
            await fetchTasks();
        } catch (error) {
            console.error("Failed to delete task:", error);
            setError("Failed to delete task. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const completeTask = async (taskId: string) => {
        setLoading(true);
        setError(null);
        try {
            await api.completeTask(taskId);
            await fetchTasks();
        } catch (error) {
            console.error("Failed to complete task:", error);
            setError("Failed to complete task. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const prioritizeTasks = async () => {
        setAiLoading(true);
        setError(null);
        try {
            const prioritized = await api.prioritizeTasks(tasks);
            setPrioritizedTasks(prioritized);
        } catch (error) {
            console.error("Failed to prioritize tasks:", error);
            setError("Failed to prioritize tasks. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    // Fetch tasks only if the user is logged in
    useEffect(() => {
        if (isLoggedIn) {
            fetchTasks();
        }
    }, [isLoggedIn]); // Add isLoggedIn as a dependency

    // Prioritize tasks only if the user is logged in and tasks are available
    useEffect(() => {
        if (isLoggedIn && tasks.length > 0) {
            prioritizeTasks();
        }
    }, [tasks, isLoggedIn]); // Add isLoggedIn as a dependency

    return (
        <TaskContext.Provider value={{
            tasks,
            prioritizedTasks,
            fetchTasks,
            addTask,
            updateTask,
            deleteTask,
            completeTask,
            prioritizeTasks,
            loading,
            error,
            aiLoading,
            setAiLoading
        }}>
            {children}
        </TaskContext.Provider>
    );
};

const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTask must be used within a TaskProvider");
    }
    return context;
};

export { TaskProvider, useTask };