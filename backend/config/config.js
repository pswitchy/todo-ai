// backend/config/config.js - Example if you want to centralize config loading
require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '1h',
    polygonMumbaiRpcUrl: process.env.POLYGON_MUMBAI_RPC_URL,
    privateKey: process.env.PRIVATE_KEY,
    contractAddress: process.env.CONTRACT_ADDRESS,
    nodeEnv: process.env.NODE_ENV || 'development',
};

// Validate required configuration in production
if (config.nodeEnv === 'production') {
    const requiredFields = ['jwtSecret', 'mongoUri', 'privateKey', 'contractAddress'];
    requiredFields.forEach(field => {
        if (!config[field]) {
            throw new Error(`Missing required environment variable: ${field}`);
        }
    });
}

module.exports = config;