// frontend/components/TaskExample.tsx
import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { Task } from '../types';

const TaskExample: React.FC = () => {
    const { tasks, addTask, updateTask, deleteTask, completeTask } = useTask();
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDeadline, setNewTaskDeadline] = useState('');
    const [newTaskType, setNewTaskType] = useState('Personal'); // Default Type
    const [updateTaskDescription, setUpdateTaskDescription] = useState('');
    const [updateTaskDeadline, setUpdateTaskDeadline] = useState('');
    const [updateTaskType, setUpdateTaskType] = useState('Personal'); // Default Type
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAddTask = async () => {
        try {
            setError(null);
           await addTask({ description: newTaskDescription, deadline: newTaskDeadline, taskType: newTaskType });
           setNewTaskDescription('');
           setNewTaskDeadline('');
           setNewTaskType('Personal'); // Set back to default after add
         } catch (error: any) {
            setError(error?.message || "Failed to add task");
         }
    };

    const handleUpdateTask = async () => {
         if (!selectedTaskId) {
             setError("No task selected for update.");
             return;
         }
        try {
            setError(null);
            await updateTask(selectedTaskId, { description: updateTaskDescription, deadline: updateTaskDeadline, taskType: updateTaskType });
             setUpdateTaskDescription('');
             setUpdateTaskDeadline('');
             setUpdateTaskType('Personal'); // Set back to default after add
             setSelectedTaskId(null);
         } catch (error: any) {
            setError(error?.message || "Failed to update task");
         }
    };


   const handleDeleteTask = async (taskId: string) => {
       try {
         setError(null);
         await deleteTask(taskId);
       } catch (error: any) {
         setError(error?.message || "Failed to delete task");
       }
   };

    const handleCompleteTask = async (taskId: string) => {
        try {
            setError(null);
            await completeTask(taskId);
        } catch (error: any) {
            setError(error?.message || "Failed to complete task");
        }
    };

    
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Task Example</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>}

             {/* Add task form */}
            <div className="mb-4 bg-white shadow-md rounded-md p-4">
                <h3 className="text-xl font-semibold mb-2">Add Task</h3>
                <input
                    type="text"
                    placeholder="New task description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
               <input
                   type="date"
                    placeholder="New task deadline"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                     className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                 />
               <select
                 value={newTaskType}
                 onChange={(e) => setNewTaskType(e.target.value)}
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Study">Study</option>
                    <option value="Other">Other</option>
               </select>
                <button onClick={handleAddTask} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Task</button>
            </div>

             {/* Update Task form */}
            <div className="mb-4 bg-white shadow-md rounded-md p-4">
                <h3 className="text-xl font-semibold mb-2">Update Task</h3>
                   <input
                    type="text"
                    placeholder="Update Task description"
                     value={updateTaskDescription}
                    onChange={(e) => setUpdateTaskDescription(e.target.value)}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                    <input
                        type="date"
                        placeholder="Update Task deadline"
                        value={updateTaskDeadline}
                        onChange={(e) => setUpdateTaskDeadline(e.target.value)}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                     />
                    <select
                         value={updateTaskType}
                         onChange={(e) => setUpdateTaskType(e.target.value)}
                          className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      >
                            <option value="Personal">Personal</option>
                             <option value="Work">Work</option>
                           <option value="Study">Study</option>
                            <option value="Other">Other</option>
                       </select>
                    <select
                       className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        onChange={(e) => setSelectedTaskId(e.target.value)}
                    >
                         <option value="">Select task to Update</option>
                         {tasks.map(task => {
                           return  <option key={task._id} value={task._id}>{task.description}</option>
                         })}

                      </select>

                    <button onClick={handleUpdateTask} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update Task</button>
            </div>

             {/* Task List */}
            <div className="bg-white shadow-md rounded-md p-4">
                <h3 className="text-xl font-semibold mb-2">Task List</h3>
                <ul className="space-y-2">
                    {tasks.map((task: Task) => (
                        <li key={task._id} className="flex items-center justify-between bg-gray-100 py-2 px-3 rounded-md">
                            <span className={`${task.completed ? 'line-through text-gray-500' : ''}`}>{task.description}</span>
                            <div>
                                <button onClick={() => handleCompleteTask(task._id!)} className="text-green-500 hover:text-green-700 mr-2">
                                    {task.completed ? 'Completed' : 'Complete'}
                                </button>
                                  <button onClick={() => handleDeleteTask(task._id!)} className="text-red-500 hover:text-red-700">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskExample;