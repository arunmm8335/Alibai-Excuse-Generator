const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/alibai_test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear test data
        await mongoose.connection.db.dropDatabase();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not register user with existing email', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            // Second registration with same email
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Another User',
                    email: 'test@example.com',
                    password: 'password456'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('msg', 'User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not login with invalid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('msg', 'Invalid Credentials');
        });
    });
}); 