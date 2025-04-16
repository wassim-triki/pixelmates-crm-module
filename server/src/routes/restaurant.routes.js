const express = require('express');
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  uploadImage,
  createTable,
  getTablesByRestaurant,
  getTableById,
  updateTable,
  deleteTable,
} = require('../controllers/restaurant.controller');

const router = express.Router();

// Restaurant routes
router.route('/')
  .get(getRestaurants)
  .post(createRestaurant);

router.route('/search')
  .get(searchRestaurants);

router.route('/:id')
  .get(getRestaurantById)
  .put(updateRestaurant)
  .delete(deleteRestaurant);

router.route('/:id/images')
  .post(uploadImage);

// Table routes
router.route('/:restauId/tables')
  .get(getTablesByRestaurant)
  .post(createTable);

router.route('/:restauId/tables/:id')
  .get(getTableById)
  .put(updateTable)
  .delete(deleteTable);

module.exports = router;