const express = require('express');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Initialize Twilio Client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// @route   POST /api/calls/trigger
// @desc    Trigger a phone call to the user
// @access  Private
router.post('/trigger', auth, async (req, res) => {
    const { userPhoneNumber, excuseText } = req.body;

    if (!userPhoneNumber || !excuseText) {
        return res.status(400).json({ msg: 'Phone number and excuse text are required.' });
    }

    try {
        // Use Twilio to create a call
        await client.calls.create({
            // TwiML (Twilio Markup Language) tells Twilio what to do when the call connects.
            // Here, we use the <Say> verb to read the excuse text aloud.
            twiml: `<Response><Say voice="alice" language="en-US">${excuseText}</Say></Response>`,
            to: userPhoneNumber, // The user's (verified) phone number
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
        });

        console.log(`Call triggered to ${userPhoneNumber}`);
        res.json({ success: true, msg: 'Call initiated successfully!' });

    } catch (error) {
        console.error("Twilio API Error:", error.message);
        // Twilio often gives specific error codes and messages
        res.status(500).json({ success: false, msg: `Twilio Error: ${error.message}` });
    }
});

module.exports = router;