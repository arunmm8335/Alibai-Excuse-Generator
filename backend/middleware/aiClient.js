// backend/middleware/aiClient.js
const { OpenAI } = require('openai');
const User = require('../models/User');
const CryptoJS = require('crypto-js');

// Default client using a free API service
console.log('Setting up default OpenAI client with:', {
    hasApiKey: !!process.env.OPENAI_API_KEY,
    hasBaseURL: !!process.env.OPENAI_API_BASE_URL,
    baseURL: process.env.OPENAI_API_BASE_URL
});

const defaultOpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-1234567890abcdef', // Fallback key for testing
    baseURL: process.env.OPENAI_API_BASE_URL || 'https://api.chatanywhere.tech/v1',
});

const getOpenAIClient = async (req, res, next) => {
    try {
        console.log('AI Client Middleware - Setting up client for user:', req.user.id);

        const user = await User.findById(req.user.id);
        console.log('User found:', { userTier: user.userTier, hasApiKey: !!user.userApiKey, apiCallCount: user.apiCallCount });

        if (user.userTier === 'pro' && user.userApiKey) {
            // Logic for Pro user with their own key
            console.log('Using Pro user API key');
            const decryptedBytes = CryptoJS.AES.decrypt(user.userApiKey, process.env.ENCRYPTION_SECRET || 'default-secret');
            const decryptedKey = decryptedBytes.toString(CryptoJS.enc.Utf8);
            if (decryptedKey && decryptedKey.startsWith("sk-")) {
                req.openai = new OpenAI({
                    apiKey: decryptedKey,
                    baseURL: process.env.OPENAI_API_BASE_URL || 'https://api.chatanywhere.tech/v1'
                });
            } else {
                throw new Error("Invalid stored API key.");
            }
        } else {
            // Logic for Free user, including limit check
            console.log('Using Free user with system API key');
            const limit = parseInt(process.env.FREE_TIER_LIMIT) || 10;
            console.log('API call count:', user.apiCallCount, 'Limit:', limit);

            if (user.apiCallCount >= limit) {
                return res.status(429).json({ msg: "Free tier limit reached. Please upgrade to Pro for unlimited use." });
            }
            await User.findByIdAndUpdate(req.user.id, { $inc: { apiCallCount: 1 } });
            req.openai = defaultOpenAI; // Use the default client
        }

        console.log('OpenAI client setup complete');
        next(); // Proceed to the actual route handler
    } catch (error) {
        console.error("AI Client Middleware Error:", error.message);
        return res.status(500).json({ msg: "Error setting up AI client." });
    }
};

module.exports = getOpenAIClient;