// MongoDB initialization script
db = db.getSiblingDB('alibai');

// Create collections
db.createCollection('users');
db.createCollection('excuses');
db.createCollection('calls');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.excuses.createIndex({ "userId": 1 });
db.excuses.createIndex({ "createdAt": -1 });
db.excuses.createIndex({ "isPublic": 1, "createdAt": -1 });

print('MongoDB initialized successfully!'); 