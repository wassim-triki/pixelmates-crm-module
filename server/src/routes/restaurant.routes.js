const express = require('express');
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  uploadImage,
} = require('../controllers/restaurant.controller.js');

const router = express.Router();

// Public routes
router.route('/').get(getRestaurants).post(createRestaurant);
router.route('/search').get(searchRestaurants);
router
  .route('/:id')
  .get(getRestaurantById)
  .put(updateRestaurant)
  .delete(deleteRestaurant);
router.route('/:id/images').post(uploadImage);

module.exports = router;
