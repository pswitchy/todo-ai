// backend/middleware/errorHandler.js
const config = require('../config/config');

module.exports = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = config.nodeEnv === 'development'
        ? err.message
        : 'Something went wrong';

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        ...(config.nodeEnv === 'development' && { stack: err.stack })
    });
};