// frontend/context/TaskContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Task } from '../types';
import * as api from '../utils/api';

interface TaskContextType {
    tasks: Task[];
    fetchTasks: () => Promise<void>;
    addTask: (newTaskData: { description: string; deadline: string; taskType: string }) => Promise<void>;
    updateTask: (taskId: string, updatedTaskData: { description: string; deadline: string; taskType: string }) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    completeTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = async () => {
        try {
            const fetchedTasks = await api.getTasks();
            setTasks(fetchedTasks);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    const addTask = async (newTaskData: { description: string; deadline: string; taskType: string }) => {
        try {
            const taskWithCompleted = { ...newTaskData, completed: false };
            await api.createTask(taskWithCompleted);
            await fetchTasks();
        } catch (error) {
            console.error("Failed to add task:", error);
            throw error;
        }
    };

    const updateTask = async (taskId: string, updatedTaskData: { description: string; deadline: string; taskType: string }) => {
        try {
            await api.updateTask(taskId, updatedTaskData);
            await fetchTasks();
        } catch (error) {
            console.error("Failed to update task:", error);
            throw error;
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            await api.deleteTask(taskId);
            await fetchTasks();
        } catch (error) {
            console.error("Failed to delete task:", error);
            throw error;
        }
    };

    const completeTask = async (taskId: string) => {
        try {
            await api.completeTask(taskId);
            await fetchTasks();
        } catch (error) {
            console.error("Failed to complete task:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <TaskContext.Provider value={{ tasks, fetchTasks, addTask, updateTask, deleteTask, completeTask }}>
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