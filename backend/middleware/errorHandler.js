const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = {
        message: err.message || 'Server Error',
        statusCode: err.statusCode || 500
    };

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        error.message = messages.join(', ');
        error.statusCode = 400;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }

    // Mongoose cast error
    if (err.name === 'CastError') {
        error.message = 'Resource not found';
        error.statusCode = 404;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.message = 'Invalid token';
        error.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        error.message = 'Token expired';
        error.statusCode = 401;
    }

    // OpenAI API errors
    if (err.message && err.message.includes('OpenAI')) {
        error.message = 'AI service temporarily unavailable';
        error.statusCode = 503;
    }

    // Twilio errors
    if (err.message && err.message.includes('Twilio')) {
        error.message = 'Phone service temporarily unavailable';
        error.statusCode = 503;
    }

    res.status(error.statusCode).json({
        success: false,
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler; 