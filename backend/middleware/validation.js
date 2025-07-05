const { body, validationResult } = require('express-validator');

// Validation rules
const validateRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const validateExcuseGeneration = [
    body('scenario')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Scenario must be between 10 and 500 characters'),
    body('context')
        .isIn(['work', 'school', 'social', 'family'])
        .withMessage('Context must be work, school, social, or family'),
    body('urgency')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Urgency must be low, medium, or high'),
    body('language')
        .optional()
        .isLength({ min: 2, max: 20 })
        .withMessage('Language must be between 2 and 20 characters')
];

const validateApiKey = [
    body('apiKey')
        .trim()
        .isLength({ min: 20 })
        .withMessage('API key must be at least 20 characters long')
        .matches(/^sk-/)
        .withMessage('API key must start with "sk-"')
];

const validatePhoneCall = [
    body('userPhoneNumber')
        .matches(/^\+[1-9]\d{1,14}$/)
        .withMessage('Phone number must be in E.164 format (e.g., +14155552671)'),
    body('excuseText')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Excuse text must be between 10 and 500 characters')
];

// Middleware to check for validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateExcuseGeneration,
    validateApiKey,
    validatePhoneCall,
    handleValidationErrors
}; 