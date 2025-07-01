const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Initialize Middlewares
app.use(cors());
app.use(express.json({ extended: false }));

// Define API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/excuses', require('./routes/excuses'));
app.use('/api/calls', require('./routes/calls')); // Register the new Twilio calls route

// backend/server.js

app.use('/api/users', require('./routes/users')); // --- ADD THIS LINE ---

const PORT = process.env.PORT || 5000;
// ...
app.listen(PORT, () => console.log(`Backend Server started on port ${PORT}`));