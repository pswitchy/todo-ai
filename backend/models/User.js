// backend/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true }, // Unique and required
    password: { type: String, required: true }, // Required
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);