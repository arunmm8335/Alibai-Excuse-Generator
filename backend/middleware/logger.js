const logger = (req, res, next) => {
    const start = Date.now();

    // Log request
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const statusColor = status >= 400 ? '\x1b[31m' : status >= 300 ? '\x1b[33m' : '\x1b[32m';

        console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${statusColor}${status}\x1b[0m - ${duration}ms`);
    });

    next();
};

// Error logger
const errorLogger = (err, req, res, next) => {
    console.error(`${new Date().toISOString()} - ERROR: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    next(err);
};

module.exports = { logger, errorLogger }; 