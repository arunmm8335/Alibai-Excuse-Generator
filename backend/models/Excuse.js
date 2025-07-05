const mongoose = require('mongoose');

const ExcuseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scenario: { type: String, required: true },
    excuseText: { type: String, required: true },
    context: { type: String, enum: ['work', 'school', 'social', 'family'], default: 'social' },
    isFavorite: { type: Boolean, default: false },
    effectiveness: { type: Number, default: 0 }, // -1 for failed, 1 for worked, 0 for neutral
    createdAt: { type: Date, default: Date.now },
    // Community Wall fields
    isPublic: { type: Boolean, default: false }, // If true, shown on community wall
    likes: { type: Number, default: 0 }, // Upvotes/likes from community
    reports: { type: Number, default: 0 }, // Number of reports for moderation
    status: { type: String, enum: ['active', 'hidden', 'removed'], default: 'active' }, // Moderation status
    publicAuthor: { type: String, default: 'anonymous' }, // Display name or 'anonymous'
    // Comments array
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            authorName: { type: String, default: 'anonymous' },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Excuse', ExcuseSchema);