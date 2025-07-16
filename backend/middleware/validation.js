const { body, validationResult } = require('express-validator');

// Validation rules
const validateRegistration = [
    body('name')
        .trim().escape()
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
        .trim().escape()
        .isLength({ min: 10, max: 500 })
        .withMessage('Scenario must be between 10 and 500 characters'),
    body('context')
        .isIn(['work', 'school', 'social', 'family', 'dating', 'travel', 'health', 'legal', 'tech', 'other'])
        .withMessage('Context must be work, school, social, family, dating, travel, health, legal, tech, or other'),
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
        .trim().escape()
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
        .trim().escape()
        .isLength({ min: 10, max: 500 })
        .withMessage('Excuse text must be between 10 and 500 characters')
];

const validateComment = [
    body('text')
        .trim().escape()
        .isLength({ min: 2, max: 300 })
        .withMessage('Comment must be between 2 and 300 characters'),
    body('authorName')
        .optional()
        .trim().escape()
        .isLength({ min: 2, max: 50 })
        .withMessage('Author name must be between 2 and 50 characters')
];

const validateProfileUpdate = [
    body('name')
        .optional()
        .trim().escape()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('bio')
        .optional()
        .trim().escape()
        .isLength({ max: 300 })
        .withMessage('Bio must be at most 300 characters'),
    body('mobile')
        .optional()
        .matches(/^\+[1-9]\d{1,14}$/)
        .withMessage('Mobile number must be in E.164 format (e.g., +1234567890)'),
    body('github')
        .optional()
        .trim()
        .isURL()
        .withMessage('GitHub must be a valid URL'),
    body('linkedin')
        .optional()
        .trim()
        .isURL()
        .withMessage('LinkedIn must be a valid URL'),
    body('twitter')
        .optional()
        .trim()
        .isURL()
        .withMessage('Twitter must be a valid URL')
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
    validateComment,
    validateProfileUpdate,
    handleValidationErrors
}; 