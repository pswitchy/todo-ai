// backend/config/config.js - Example if you want to centralize config loading
require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '1h',
    nodeEnv: process.env.NODE_ENV || 'development',
};

// Validate required configuration in production
if (config.nodeEnv === 'production') {
    const requiredFields = ['jwtSecret', 'mongoUri']; // Removed privateKey and contractAddress if not strictly required for core functionality
    requiredFields.forEach(field => {
        if (!config[field]) {
            throw new Error(`Missing required environment variable: ${field}`);
        }
    });
}

module.exports = config;