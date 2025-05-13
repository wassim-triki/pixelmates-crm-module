const request = require('supertest');
const app = require('../index'); // Assuming app.js is the entry point of your application
const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Complaint Controller Tests', () => {
    let userId, restaurantId, complaintId;

    beforeEach(async () => {
        // Create a test user and restaurant
        const user = await User.create({ name: 'Test User', email: 'testuser@example.com' });
        const restaurant = await Restaurant.create({ name: 'Test Restaurant', address: '123 Test St' });

        userId = user._id;
        restaurantId = restaurant._id;
    });

    afterEach(async () => {
        await Complaint.deleteMany({});
        await User.deleteMany({});
        await Restaurant.deleteMany({});
    });

    test('should create a new complaint', async () => {
        const response = await request(app)
            .post('/api/complaints')
            .send({
                user: userId,
                restaurant: restaurantId,
                title: 'Test Complaint',
                description: 'This is a test complaint',
                category: 'Service',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('complaint');
        expect(response.body.complaint.title).toBe('Test Complaint');
    });

    test('should get all complaints', async () => {
        await Complaint.create({
            user: userId,
            restaurant: restaurantId,
            title: 'Test Complaint',
            description: 'This is a test complaint',
            category: 'Service',
        });

        const response = await request(app).get('/api/complaints');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('should get a complaint by ID', async () => {
        const complaint = await Complaint.create({
            user: userId,
            restaurant: restaurantId,
            title: 'Test Complaint',
            description: 'This is a test complaint',
            category: 'Service',
        });

        const response = await request(app).get(`/api/complaints/${complaint._id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('title', 'Test Complaint');
    });

    test('should update a complaint', async () => {
        const complaint = await Complaint.create({
            user: userId,
            restaurant: restaurantId,
            title: 'Test Complaint',
            description: 'This is a test complaint',
            category: 'Service',
        });

        const response = await request(app)
            .put(`/api/complaints/${complaint._id}`)
            .send({ title: 'Updated Complaint' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('title', 'Updated Complaint');
    });

    test('should delete a complaint', async () => {
        const complaint = await Complaint.create({
            user: userId,
            restaurant: restaurantId,
            title: 'Test Complaint',
            description: 'This is a test complaint',
            category: 'Service',
        });

        const response = await request(app).delete(`/api/complaints/${complaint._id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Complaint deleted successfully');
    });
});