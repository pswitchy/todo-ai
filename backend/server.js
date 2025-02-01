// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes'); // Import task routes
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const aiRoutes = require('./routes/aiRoutes');     // Import ai routes

const app = express();

// Enhanced security middleware
app.use(helmet());
app.use(cors({
    origin: config.nodeEnv === 'development'
        ? 'http://localhost:3000'
        : process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes - Correctly mount the route handlers
app.use('/api/auth', authRoutes); // Use authRoutes
app.use('/api/tasks', taskRoutes); // Use taskRoutes
app.use('/api/ai', aiRoutes);     // Use aiRoutes

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    console.log(`Routes mounted: /api/auth, /api/tasks, /api/ai`); // Log route mounting for verification
});