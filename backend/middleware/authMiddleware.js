const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Fetch the latest user from the database
        const user = await User.findById(decoded.user.id);
        if (!user) return res.status(401).json({ msg: 'User not found' });
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};