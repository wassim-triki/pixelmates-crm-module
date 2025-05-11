// routes/table.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const { saveTables, getTables } = require('../controllers/table.controller');
const { createTable } = require('../controllers/restaurant.controller');

// GET  /api/restaurants/:restaurantId/tables
router.get('/', getTables);

// POST /api/restaurants/:restaurantId/tables - Create a single table
router.post('/', createTable);

// PUT /api/restaurants/:restaurantId/tables - Bulk save tables
router.put('/', saveTables);

module.exports = router;
