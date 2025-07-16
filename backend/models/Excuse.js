const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, default: 'anonymous' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { _id: true });

const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, default: 'anonymous' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [ReplySchema]
}, { _id: true });

const ExcuseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scenario: { type: String, required: true },
    excuseText: { type: String, required: true },
    context: { type: String, enum: ['work', 'school', 'social', 'family', 'dating', 'travel', 'health', 'legal', 'tech', 'other'], default: 'social' },
    isFavorite: { type: Boolean, default: false },
    effectiveness: { type: Number, default: 0 }, // -1 for failed, 1 for worked, 0 for neutral
    createdAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 }, // Number of times viewed
    // Community Wall fields
    isPublic: { type: Boolean, default: false }, // If true, shown on community wall
    reports: { type: Number, default: 0 }, // Number of reports for moderation
    status: { type: String, enum: ['active', 'hidden', 'removed'], default: 'active' }, // Moderation status
    publicAuthor: { type: String, default: 'anonymous' }, // Display name or 'anonymous'
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema]
});

ExcuseSchema.index({ isPublic: 1, status: 1, createdAt: -1 });
ExcuseSchema.index({ isPublic: 1, status: 1, likes: -1, createdAt: -1 });

module.exports = mongoose.model('Excuse', ExcuseSchema);