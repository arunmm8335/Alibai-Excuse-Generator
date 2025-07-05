const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: null },
    bio: { type: String, default: '' },
    mobile: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    smartPreferences: {
        tone: { type: String, default: 'friendly' },
        length: { type: String, default: 'medium' },
        humor: { type: Boolean, default: false },
    },
    smartRank: { type: String, default: 'Newbie' },
    createdAt: { type: Date, default: Date.now },
    userTier: { type: String, enum: ['free', 'pro'], default: 'free' },
    apiCallCount: { type: Number, default: 0 },
    userApiKey: { type: String, default: null }, // Stores the ENCRYPTED key
    isModerator: { type: Boolean, default: false } // For moderation tools
});

module.exports = mongoose.model('User', UserSchema);