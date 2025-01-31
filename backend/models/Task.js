// backend/models/Task.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    blockchainVerified: { type: Boolean, default: false },
    taskType: { type: String, enum: ['Personal', 'Work', 'Study', 'Other'], default: 'Personal' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User model
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);