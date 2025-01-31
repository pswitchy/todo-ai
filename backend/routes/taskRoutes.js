// backend/routes/taskRoutes.js
const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

const taskValidation = [
    check('description').trim().notEmpty(),
    check('deadline').isISO8601(),
    check('taskType').isIn(['Personal', 'Work', 'Study', 'Other'])
];

router.use(authMiddleware); // Apply authentication middleware to all task routes

router.post('/', taskValidation, taskController.createTask);
router.get('/', taskValidation, taskController.getTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/complete', taskController.completeTask); // Use PATCH for status update

module.exports = router;