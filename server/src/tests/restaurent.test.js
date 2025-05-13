const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const Table = require('../models/Table');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // Nettoyage final
  await mongoose.disconnect();
});

afterEach(async () => {
  await Restaurant.deleteMany({});
  await Table.deleteMany({});
});

describe('Restaurant Controller Tests', () => {
  describe('POST /api/restaurants', () => {
    test('should create a new restaurant (201)', async () => {
      const response = await request(app)
        .post('/api/restaurants')
        .send({
          name: 'Test Restaurant',
          address: '123 Test St',
          cuisineType: 'Italian',
          taxeTPS: 5,
          taxeTVQ: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('Test Restaurant');
    });
  });

  describe('GET /api/restaurants', () => {
    test('should get all restaurants (200)', async () => {
      await Restaurant.create({
        name: 'Test Restaurant',
        address: '123 Test St',
        cuisineType: 'Italian',
        taxeTPS: 5,
        taxeTVQ: 10,
      });

      const response = await request(app).get('/api/restaurants');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count', 1);
      expect(response.body.restaurants[0].name).toBe('Test Restaurant');
    });
  });

  describe('GET /api/restaurants/:id', () => {
    test('should get a restaurant by ID (200)', async () => {
      const restaurant = await Restaurant.create({
        name: 'Test Restaurant',
        address: '123 Test St',
        cuisineType: 'Italian',
        taxeTPS: 5,
        taxeTVQ: 10,
      });

      const response = await request(app).get(`/api/restaurants/${restaurant._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('Test Restaurant');
    });

    test('should return 404 if restaurant not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/restaurants/${fakeId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Restaurant not found');
    });
  });

  describe('DELETE /api/restaurants/:id', () => {
    test('should delete a restaurant (200)', async () => {
      const restaurant = await Restaurant.create({
        name: 'Test Restaurant',
        address: '123 Test St',
        cuisineType: 'Italian',
        taxeTPS: 5,
        taxeTVQ: 10,
      });

      const response = await request(app).delete(`/api/restaurants/${restaurant._id}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Restaurant and associated tables deleted');
    });

    test('should return 404 if restaurant not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/restaurants/${fakeId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Restaurant not found');
    });
  });
});
