const helmet = require('helmet');

const securityMiddleware = (req, res, next) => {
    // Basic security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Remove server information
    res.removeHeader('X-Powered-By');

    next();
};

module.exports = securityMiddleware; 