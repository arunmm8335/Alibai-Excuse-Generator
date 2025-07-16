const express = require('express');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Excuse = require('../models/Excuse');
const router = express.Router();
const CryptoJS = require('crypto-js');
const { validateProfileUpdate, handleValidationErrors } = require('../middleware/validation');

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        const excuses = await Excuse.find({ user: req.user.id });
        const totalExcuses = excuses.length;
        const favoritesCount = excuses.filter(e => e.isFavorite).length;
        const successfulCount = excuses.filter(e => e.effectiveness === 1).length;
        const failedCount = excuses.filter(e => e.effectiveness === -1).length;
        const favoriteExcuses = excuses.filter(e => e.isFavorite).sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
        res.json({ user, stats: { totalExcuses, favoritesCount, successfulCount, failedCount }, favoriteExcuses });
    } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/upgrade', auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { userTier: 'pro' });
        const updatedUser = await User.findById(req.user.id).select('-password');
        res.json(updatedUser);
    } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/api-key', auth, async (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ msg: 'API key is required' });
    try {
        const user = await User.findById(req.user.id);
        if (user.userTier !== 'pro') return res.status(403).json({ msg: 'Only Pro users can add an API key' });
        const encryptedKey = CryptoJS.AES.encrypt(apiKey, process.env.ENCRYPTION_SECRET).toString();
        user.userApiKey = encryptedKey;
        await user.save();
        res.json({ msg: 'API Key saved successfully!' });
    } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/api-key', auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { userApiKey: null });
        res.json({ msg: 'API Key removed successfully!' });
    } catch (err) { res.status(500).send('Server Error'); }
});

router.put('/profile', auth, validateProfileUpdate, handleValidationErrors, async (req, res) => {
    try {
        const { name, email, profilePic, bio, mobile, github, linkedin, twitter, smartPreferences } = req.body;

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (existingUser) {
                return res.status(400).json({ msg: 'Email is already in use' });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (profilePic !== undefined) updateData.profilePic = profilePic;
        if (bio !== undefined) updateData.bio = bio;
        if (mobile !== undefined) updateData.mobile = mobile;
        if (github !== undefined) updateData.github = github;
        if (linkedin !== undefined) updateData.linkedin = linkedin;
        if (twitter !== undefined) updateData.twitter = twitter;

        // Handle smartPreferences update (merge with existing)
        if (smartPreferences) {
            const user = await User.findById(req.user.id);
            updateData.smartPreferences = {
                ...user.smartPreferences.toObject ? user.smartPreferences.toObject() : user.smartPreferences,
                ...smartPreferences
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ user: updatedUser, msg: 'Profile updated successfully!' });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;