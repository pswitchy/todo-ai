// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config'); // Import config

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>

        jwt.verify(token, config.jwtSecret, (err, user) => { // Use jwtSecret from config
            if (err) {
                return res.sendStatus(403); // Forbidden - invalid token
            }
            req.userId = user.userId; // Attach user ID to request object
            next(); // Proceed to the next middleware/route handler
        });
    } else {
        res.sendStatus(401); // Unauthorized - no token provided
    }
};

module.exports = authMiddleware;