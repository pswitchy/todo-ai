// frontend/utils/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { Task } from '../types';

interface AuthCredentials {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

interface RegisterCredentials {
    email: string;
    password: string;
    confirmPassword?: string;
}

const API_BASE_URL = 'http://localhost:5000/api'; // Backend API URL

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Add response interceptor for 401 handling
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

interface ValidationError {
    field: string;
    message: string;
}

export const validateRegistration = (credentials: RegisterCredentials): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!credentials.email?.trim()) {
        errors.push({ field: 'email', message: 'Email is required' });
    }
    if (!credentials.password?.trim()) {
        errors.push({ field: 'password', message: 'Password is required' });
    }
    if (!credentials.confirmPassword?.trim()) {
        errors.push({ field: 'confirmPassword', message: 'Password confirmation is required' });
    }

    return errors;
};

// Authentication
export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    // Validate inputs
    if (!credentials.email || !credentials.password || !credentials.confirmPassword) {
        throw new Error('All fields are required');
    }

    if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
    }

    if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }

    try {
        const response = await api.post<AuthResponse>('/auth/register', {
            email: credentials.email,
            password: credentials.password
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            return response.data;
        }
        throw new Error('Invalid response from server');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            throw new Error(errorMessage);
        }
        throw new Error('Network error. Please try again.');
    }
};

export const loginUser = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    try {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

// Tasks

export const getTasks = async (): Promise<Task[]> => {
    try {
        const response = await api.get('/tasks');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        throw error;
    }
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
    try {
        const response = await api.post('/tasks', task);
        return response.data;
    } catch (error) {
        console.error('Failed to create task:', error);
        throw error;
    }
};

export const updateTask = async (taskId: string, taskData: any) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
};

export const deleteTask = async (taskId: string) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
};

export const completeTask = async (taskId: string) => {
    const response = await api.patch(`/tasks/${taskId}/complete`); // PATCH for updating status
    return response.data;
};

// AI (Example, adjust endpoints as needed in your backend)
export const prioritizeTasks = async (tasks: Task[]): Promise<Task[]> => {
    const response = await api.post('/ai/prioritize-tasks', { tasks });
    return response.data;
};

export const getReminder = async (task: Task): Promise<string> => {
    const response = await api.post('/ai/reminders', task);
    return response.data.reminder;
};
