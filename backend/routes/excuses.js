const express = require('express');
const auth = require('../middleware/authMiddleware');
const getOpenAIClient = require('../middleware/aiClient'); // Import the new centralized middleware
const Excuse = require('../models/Excuse');
const router = express.Router();


// @route   POST /api/excuses/generate-stream
// @desc    Generates an excuse using the correct AI client from middleware
// @access  Private
router.post('/generate-stream', [auth, getOpenAIClient], async (req, res) => {
    // By the time this function runs, req.openai is already correctly set by the middleware
    const { scenario, context, urgency, language } = req.body;
    let systemPrompt = `You are Alibai, an intelligent excuse generator. Generate one single, high-quality, creative excuse for the user's situation. Be concise and natural-sounding. Generate the excuse in ${language}. Do not add any extra commentary, introductory phrases, or formatting like numbering.`;
    
    try {
        const successfulExcuses = await Excuse.find({ user: req.user.id, effectiveness: 1 }).sort({ createdAt: -1 }).limit(2);
        if (successfulExcuses.length > 0) {
            const examples = successfulExcuses.map(e => `- "${e.excuseText}"`).join('\n');
            systemPrompt += `\n\nLEARNING: The user has previously had success with excuses like these. Generate a new excuse in a similar style:\n${examples}`;
        }

        const userPrompt = `My situation is: "${scenario}". Context: ${context}. Urgency: ${urgency}.`;
        const stream = await req.openai.chat.completions.create({ model: "gpt-4o-mini", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], stream: true });
        
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
    } catch (error) {
        console.error("AI Generation Error in Route:", error.message);
        const userErrorMessage = "An error occurred with the AI. If using your own key, it may be invalid or out of credits.";
        res.write(`data: ${JSON.stringify({ content: userErrorMessage })}\n\ndata: [DONE]\n\n`);
        res.end();
    }
});


// @route   POST /api/excuses/apology
// @desc    Generate an apology using the correct AI client from middleware
// @access  Private
router.post('/apology', [auth, getOpenAIClient], async (req, res) => {
    const { scenario, excuseText, language } = req.body;
    const systemPrompt = `You are Alibai, an AI specializing in apologies. Craft a professional or emotional apology in ${language}. Make it sound sincere, with a subtle guilt-tripping tone.`;
    const userPrompt = `The situation was: "${scenario}". My excuse was: "${excuseText}". Now create a suitable apology.`;
    try {
        const chatCompletion = await req.openai.chat.completions.create({ model: "gpt-3.5-turbo", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], temperature: 0.8 });
        res.json({ apologyText: chatCompletion.choices[0].message.content.trim() });
    } catch (error) {
        console.error("Apology Generation Error:", error.message);
        res.status(500).json({ msg: "Error communicating with AI for apology." });
    }
});


// @route   POST /api/excuses/proof
// @desc    Generate proof using the correct AI client from middleware
// @access  Private
router.post('/proof', [auth, getOpenAIClient], async (req, res) => {
    const { scenario, excuseText, language } = req.body;
    const systemPrompt = `You are a scriptwriter. Create a short, realistic text message conversation (3-5 lines) between 'Me' and another person (e.g., 'Mom', 'Boss') that supports an excuse. Format as a script, with each line starting with the speaker's name then a colon. Example: 'Mom: Are you okay?'. Generate the dialogue in ${language}.`;
    const userPrompt = `The situation: "${scenario}". The excuse used: "${excuseText}". Write a fake chat log for this.`;
    try {
        const chatCompletion = await req.openai.chat.completions.create({ model: "gpt-4o-mini", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], temperature: 0.9 });
        res.json({ proofText: chatCompletion.choices[0].message.content.trim() });
    } catch (error) {
        console.error("Proof Generation Error:", error.message);
        res.status(500).json({ msg: "Error communicating with AI for proof." });
    }
});


// ALL OTHER DATA-ONLY ROUTES (no AI calls) DO NOT NEED THE `getOpenAIClient` MIDDLEWARE
router.post('/save', auth, async (req, res) => { try { const { scenario, context, excuseText } = req.body; if (!scenario || !context || !excuseText) { return res.status(400).json({ msg: "Missing fields." }); } const newExcuse = new Excuse({ user: req.user.id, scenario, excuseText, context }); await newExcuse.save(); res.status(201).json(newExcuse); } catch (err) { res.status(500).send('Server Error'); } });
router.get('/history', auth, async (req, res) => { try { const excuses = await Excuse.find({ user: req.user.id }).sort({ createdAt: -1 }); res.json(excuses); } catch (err) { res.status(500).send('Server Error'); } });
router.patch('/:id/favorite', auth, async (req, res) => { try { const excuse = await Excuse.findById(req.params.id); if (!excuse) return res.status(404).json({ msg: 'Excuse not found' }); if (excuse.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' }); excuse.isFavorite = !excuse.isFavorite; await excuse.save(); res.json(excuse); } catch (err) { res.status(500).send('Server Error'); } });
router.patch('/:id/rate', auth, async (req, res) => { const { rating } = req.body; if (rating !== 1 && rating !== -1) { return res.status(400).json({ msg: 'Invalid rating.' }); } try { const excuse = await Excuse.findById(req.params.id); if (!excuse) return res.status(404).json({ msg: 'Excuse not found' }); if (excuse.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' }); excuse.effectiveness = rating; await excuse.save(); res.json(excuse); } catch (err) { res.status(500).send('Server Error'); } });
router.delete('/:id', auth, async (req, res) => { try { const excuse = await Excuse.findById(req.params.id); if (!excuse) { return res.status(404).json({ msg: 'Excuse not found' }); } if (excuse.user.toString() !== req.user.id) { return res.status(401).json({ msg: 'User not authorized' }); } await excuse.deleteOne(); res.json({ msg: 'Excuse removed' }); } catch (err) { res.status(500).send('Server Error'); } });
router.get('/pattern', auth, async (req, res) => { try { const userHistory = await Excuse.find({ user: req.user.id }); if (userHistory.length < 3) return res.json({ suggestion: null }); const keywordMap = { sick: ["sick", "unwell", "fever"], appointment: ["appointment", "doctor"], family: ["family", "emergency"], }; const dayCounts = {}; const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; userHistory.forEach(excuse => { const day = daysOfWeek[new Date(excuse.createdAt).getDay()]; if (!dayCounts[day]) dayCounts[day] = {}; for (const category in keywordMap) { if (keywordMap[category].some(k => excuse.scenario.toLowerCase().includes(k))) { dayCounts[day][category] = (dayCounts[day][category] || 0) + 1; } } }); let suggestion = null; for (const day in dayCounts) { for (const category in dayCounts[day]) { if (dayCounts[day][category] >= 3) { suggestion = `We've noticed you often need an excuse about being '${category}' on ${day}s. Need help preparing one?`; break; } } if (suggestion) break; } res.json({ suggestion }); } catch (err) { res.status(500).send('Server Error'); } });

module.exports = router;