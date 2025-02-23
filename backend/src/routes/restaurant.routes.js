import express from 'express';
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  uploadImage,
} from '../controllers/restaurant.controller.js';

const router = express.Router();

// Public routes
router.route('/').get(getRestaurants).post(createRestaurant);
router.route('/search').get(searchRestaurants);
router.route('/:id').get(getRestaurantById).put(updateRestaurant).delete(deleteRestaurant);
router.route('/:id/images').post(uploadImage);

export default router;