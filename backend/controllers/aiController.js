const axios = require('axios');
const AI_SERVICE_URL = 'http://127.0.0.1:5001';

exports.prioritizeTasks = async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/prioritize`, {
            tasks: req.body.tasks
        });
        res.json(response.data);
    } catch (error) {
        console.error('AI prioritization error:', error);
        res.status(500).json({ 
            message: error.response?.data?.error || 'AI service error' 
        });
    }
};

exports.getReminder = async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/reminder`, {
            task: req.body
        });
        res.json({ reminder: response.data.reminder });
    } catch (error) {
        console.error('AI reminder error:', error);
        res.status(500).json({
            message: error.response?.data?.error || 'Reminder generation failed'
        });
    }
};