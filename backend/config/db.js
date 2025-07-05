const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Not set');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully!');

        // Test the connection
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', function () {
            console.log('MongoDB connection is open and ready');
        });

    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;