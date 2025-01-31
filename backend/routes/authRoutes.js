// backend/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { body } = require('express-validator'); // Import validation middleware


const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.register); // Add validation middleware *before* the controller

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').exists().withMessage('Password is required'),
], authController.login);

module.exports = router;