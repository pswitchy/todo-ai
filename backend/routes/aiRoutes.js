// backend/routes/aiRoutes.js
const express = require('express');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // Protect AI routes as well

router.post('/prioritize-tasks', aiController.prioritizeTasks);
router.post('/reminders', aiController.getReminder);

module.exports = router;