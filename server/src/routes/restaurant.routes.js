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
  getRestaurantSchedule,
  deleteTable,
} = require('../controllers/restaurant.controller');
const { protect } = require('../middlewares/auth.middleware');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });
const router = express.Router();

// Restaurant routes
router.route('/').get(getRestaurants).post(createRestaurant);

router.route('/search').get(searchRestaurants);

router.route('/:id').get(getRestaurantById).delete(deleteRestaurant);
router.route('/:id/schedule').get(getRestaurantSchedule); // For getting restaurant schedule

router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  updateRestaurant
);

router.route('/:id/images').post(uploadImage);

// Table routes
router.route('/:restauId/tables').get(getTablesByRestaurant).post(createTable);

router
  .route('/:restauId/tables/:id')
  .get(getTableById)
  .put(updateTable)
  .delete(deleteTable);

module.exports = router;
