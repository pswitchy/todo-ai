// frontend/types/index.ts
export interface Task {
    _id?: string; // Optional because it might not be present when creating a task
    description: string;
    deadline: string;
    completed: boolean;
    taskType: string;
    userId?: string; // Or however you manage user association
    createdAt?: string;
    updatedAt?: string;
}