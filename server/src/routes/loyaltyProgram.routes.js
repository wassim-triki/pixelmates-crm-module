const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyProgram.controller');

// Create or initialize loyalty program for a user
router.post('/', loyaltyController.createOrUpdateLoyalty);

// Get loyalty data by user ID
router.get('/user/:userId', loyaltyController.getLoyaltyByUser);

// Get loyalty data by restaurant ID
router.get('/restaurant/:restaurantId', loyaltyController.getLoyaltyByRestaurant);

// Update loyalty program manually (e.g., points, level)
router.put('/:id', loyaltyController.updateLoyalty);

// Delete a loyalty record
router.delete('/:id', loyaltyController.deleteLoyalty);


 
module.exports = router;
