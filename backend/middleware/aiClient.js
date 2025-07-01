// backend/middleware/aiClient.js
const { OpenAI } = require('openai');
const User = require('../models/User');
const CryptoJS = require('crypto-js');

// Default client using the system's key
const defaultOpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL,
});

const getOpenAIClient = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.userTier === 'pro' && user.userApiKey) {
            // Logic for Pro user with their own key
            const decryptedBytes = CryptoJS.AES.decrypt(user.userApiKey, process.env.ENCRYPTION_SECRET);
            const decryptedKey = decryptedBytes.toString(CryptoJS.enc.Utf8);
            if (decryptedKey && decryptedKey.startsWith("sk-")) {
                req.openai = new OpenAI({ apiKey: decryptedKey, baseURL: process.env.OPENAI_API_BASE_URL });
            } else {
                throw new Error("Invalid stored API key.");
            }
        } else {
            // Logic for Free user, including limit check
            if (user.apiCallCount >= process.env.FREE_TIER_LIMIT) {
                return res.status(429).json({ msg: "Free tier limit reached. Please upgrade to Pro for unlimited use." });
            }
            await User.findByIdAndUpdate(req.user.id, { $inc: { apiCallCount: 1 } });
            req.openai = defaultOpenAI; // Use the default client
        }
        next(); // Proceed to the actual route handler
    } catch (error) {
        console.error("AI Client Middleware Error:", error.message);
        return res.status(500).json({ msg: "Error setting up AI client." });
    }
};

module.exports = getOpenAIClient;