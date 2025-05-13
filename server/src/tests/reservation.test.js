const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');
const Table = require('../models/Table');
const User = require('../models/User');

// Configuration de la base de données de test
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  });
}, 10000); // Augmentation du timeout pour la connexion

// Nettoyage après les tests
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  await mongoose.disconnect();
});

describe('Reservation Controller Tests', () => {
  let userId, restaurantId, tableId, token;

  // Données de test communes
  const reservationData = {
    reservationDate: '2025-05-15',
    startTime: '18:00',
    endTime: '20:00',
    partySize: 4,
  };

  // Création des données de test avant chaque test
  beforeEach(async () => {
    // Création d'un utilisateur
    const user = await User.create({ 
      name: 'Test User', 
      email: `test-${Date.now()}@example.com`,
      password: 'test123'
    });
    
    // Création d'un restaurant
    const restaurant = await Restaurant.create({ 
      name: 'Test Restaurant', 
      address: '123 Test St',
      openingHours: {
        1: { start: '08:00', end: '22:00' } // Lundi
      }
    });
    
    // Création d'une table
    const table = await Table.create({ 
      nbtable: 1, 
      chairnb: 4, 
      restauId: restaurant._id,
      features: ['standard'],
      view: 'garden'
    });

    userId = user._id;
    restaurantId = restaurant._id;
    tableId = table._id;

    // Génération du token JWT
    token = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
  });

  // Nettoyage après chaque test
  afterEach(async () => {
    await Reservation.deleteMany({});
    await Table.deleteMany({});
    await Restaurant.deleteMany({});
    await User.deleteMany({});
  });

  describe('POST /api/reservations', () => {
    test('should create a new reservation (201)', async () => {
      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user: userId,
          restaurant: restaurantId,
          table: tableId,
          ...reservationData
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('reservation');
      expect(response.body.reservation.partySize).toBe(4);
      expect(response.body.reservation.user).toBe(userId.toString());
    });
  });

  describe('GET /api/reservations/restaurant/:restaurantId', () => {
    test('should get all reservations for a restaurant (200)', async () => {
      // Création d'une réservation de test
      await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user: userId,
          restaurant: restaurantId,
          table: tableId,
          ...reservationData
        });

      const response = await request(app)
        .get(`/api/reservations/restaurant/${restaurantId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].restaurant).toBe(restaurantId.toString());
    });
  });
});