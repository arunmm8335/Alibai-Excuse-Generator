const mongoose = require('mongoose');

const ExcuseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scenario: { type: String, required: true },
    excuseText: { type: String, required: true },
    context: { type: String, enum: ['work', 'school', 'social', 'family'], default: 'social' },
    isFavorite: { type: Boolean, default: false },
    effectiveness: { type: Number, default: 0 }, // -1 for failed, 1 for worked, 0 for neutral
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Excuse', ExcuseSchema);