// backend/controllers/taskController.js
const Task = require('../models/Task');
const config = require('../config/config');

// Helper function for handling authorization
const authorizeTaskAccess = async (taskId, userId) => {
    const task = await Task.findById(taskId);
    if (!task) {
        throw new Error('Task not found');
    }
    if (task.userId.toString() !== userId) {
        throw new Error('Unauthorized task access');
    }
    return task;
};

exports.createTask = async (req, res) => {
    try {
        const { description, deadline, taskType } = req.body;
        const newTask = new Task({
            description,
            deadline,
            taskType,
            userId: req.userId
        });

        await newTask.save();
        res.status(201).json({
            _id: newTask._id,
            description: newTask.description,
            deadline: newTask.deadline,
            taskType: newTask.taskType,
            completed: newTask.completed
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            message: 'Failed to create task',
            error: config.nodeEnv === 'development' ? error.message : undefined
        });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId })
            .select('-__v -userId')
            .sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            message: 'Failed to fetch tasks',
            error: config.nodeEnv === 'development' ? error.message : undefined
        });
    }
};

exports.getTask = async (req, res) => {
    try {
        const task = await authorizeTaskAccess(req.params.id, req.userId);
        res.status(200).json({
            _id: task._id,
            description: task.description,
            deadline: task.deadline,
            taskType: task.taskType,
            completed: task.completed,
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        const statusCode = error.message.includes('not found') ? 404 : 403;
        res.status(statusCode).json({
            message: error.message,
            error: config.nodeEnv === 'development' ? error.message : undefined
        });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await authorizeTaskAccess(req.params.id, req.userId);

        // Prevent updating completed tasks
        if (task.completed) {
            return res.status(400).json({ message: 'Completed tasks cannot be modified' });
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = ['description', 'deadline', 'taskType'];
        const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

        if (!isValidUpdate) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.status(200).json({
            _id: task._id,
            description: task.description,
            deadline: task.deadline,
            taskType: task.taskType,
            completed: task.completed
        });
    } catch (error) {
        console.error('Error updating task:', error);
        const statusCode = error.message.includes('not found') ? 404 : 403;
        res.status(statusCode).json({
            message: error.message,
            error: config.nodeEnv === 'development' ? error.message : undefined
        });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await authorizeTaskAccess(req.params.id, req.userId);
        await task.remove();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        const statusCode = error.message.includes('not found') ? 404 : 403;
        res.status(statusCode).json({
            message: error.message,
            error: config.nodeEnv === 'development' ? error.message : undefined
        });
    }
};

exports.completeTask = async (req, res) => {
    try {
        const task = await authorizeTaskAccess(req.params.id, req.userId);

        if (task.completed) {
            return res.status(400).json({ message: 'Task already completed' });
        }

        task.completed = true;
        await task.save();

        res.status(200).json({
            message: 'Task marked as completed',
            task: {
                _id: task._id,
                completed: task.completed,
            }
        });
    } catch (error) {
        console.error('Error completing task:', error);
        const statusCode = error.message.includes('not found') ? 404 : 403;
        res.status(statusCode).json({
            message: error.message,
            error: config.nodeEnv === 'development' ? error.message : undefined
        });
    }
};