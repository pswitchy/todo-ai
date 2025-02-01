// backend/routes/taskRoutes.js
const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

const taskValidation = [
    check('description').trim().notEmpty().withMessage('Description is required'),
    check('deadline').isISO8601().withMessage('Deadline must be a valid date'),
    check('taskType').isIn(['Personal', 'Work', 'Study', 'Other']).withMessage('Invalid task type')
];

router.use(authMiddleware); // Apply authentication middleware to all task routes

router.post('/', taskValidation, taskController.createTask);
router.get('/', taskController.getTasks); // Removed taskValidation - Not needed for GET all tasks
router.get('/:id', taskController.getTask);
router.put('/:id', taskValidation, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/complete', taskController.completeTask); // Use PATCH for status update

module.exports = router;