// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    try {
        const { email, password } = req.body;
        console.log("Received registration data:", req.body); // Log received data for debugging

        // Check if user already exists (case-insensitive email check)
        const existingUser = await User.findOne({ email: email.toLowerCase() }); // Case-insensitive
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' }); // 409 Conflict is more appropriate
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Salt rounds should be 12 or higher

        const newUser = new User({
            email: email.toLowerCase(), // Store email in lowercase to avoid duplicates
            password: hashedPassword
        });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, config.jwtSecret, { expiresIn: config.jwtExpiration });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Registration error:', error); // Log the detailed error for debugging
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
            return res.status(409).json({ message: 'Email already registered' }); // Explicitly handle duplicate email error
        }
        res.status(500).json({ message: 'Registration failed', error: error.message }); // Include error message for debugging (but don't expose sensitive details in production)
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() }); // Case-insensitive search

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Do not reveal if email exists or not
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' }); // Same message for invalid email or password
        }


        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: config.jwtExpiration });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};