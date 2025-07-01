const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userTier: { type: String, enum: ['free', 'pro'], default: 'free' },
    apiCallCount: { type: Number, default: 0 },
    userApiKey: { type: String, default: null } // Stores the ENCRYPTED key
});

module.exports = mongoose.model('User', UserSchema);