const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const { logger, errorLogger } = require('./middleware/logger');
const { apiLimiter, aiGenerationLimiter } = require('./middleware/rateLimiter');

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Initialize Middlewares
  app.use(cors({
    origin: [
      'https://alibai-excuse-generator-49h6txazj-roys-projects-55a11432.vercel.app/',
      // add other allowed origins if needed
    ],
    credentials: true
  }));
app.use(express.json({ limit: '2mb' })); // or '5mb' if you want to be extra safe
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(logger);

// Apply rate limiting only to AI generation routes (temporarily disabled for testing)
// app.use('/api/excuses/generate-stream', aiGenerationLimiter);
// app.use('/api/excuses/apology', aiGenerationLimiter);
// app.use('/api/excuses/proof', aiGenerationLimiter);

// Define API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/excuses', require('./routes/excuses'));
app.use('/api/calls', require('./routes/calls'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Add a root route for '/'
app.get('/', (req, res) => {
    res.json({ message: 'Alibai Excuse Generator API is running!', status: 'OK' });
});

// Error handling middleware (must be last)
app.use(errorLogger);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend Server started on port ${PORT}`));
