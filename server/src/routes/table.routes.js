const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table.controller.js');

// Create a table
router.post('/', tableController.createTable);

// Get all tables (across all restaurants)
router.get('/', tableController.getAllTables);

// Get all tables for a restaurant
router.get('/restaurant/:restauId', tableController.getTablesByRestaurant);

// Get a single table by ID
router.get('/:id', tableController.getTableById);

// Update a table
router.put('/:id', tableController.updateTable);

// Delete a table
router.delete('/:id', tableController.deleteTable);

module.exports = router;