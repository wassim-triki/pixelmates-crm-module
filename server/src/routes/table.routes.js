// routes/table.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const { saveTables, getTables } = require('../controllers/table.controller');

// GET  /api/restaurants/:restaurantId/tables
router.get('/', getTables);

// POST /api/restaurants/:restaurantId/tables
router.put('/', saveTables);

module.exports = router;
