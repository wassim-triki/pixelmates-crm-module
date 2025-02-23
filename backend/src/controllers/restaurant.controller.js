import Restaurant from '../models/Restaurant.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Public
export const createRestaurant = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    cuisineType,
    taxeTPS,
    taxeTVQ,
    color,
    logo,
    promotion,
    payCashMethod,
    images,
  } = req.body;

  // Basic validation
  if (!name || !address || !cuisineType || !taxeTPS || !taxeTVQ) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  const restaurant = await Restaurant.create({
    name,
    address,
    cuisineType,
    taxeTPS,
    taxeTVQ,
    color: color || '#FFFFFF',
    logo,
    promotion,
    payCashMethod: payCashMethod || 'not-accepted',
    images: images || [],
  });

  res.status(201).json(restaurant);
});

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({})

  res.json({
    count: restaurants.length,
    restaurants,
  });
});

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = asyncHandler(async (req, res) => {
  const { id } = req.params;



  const restaurant = await Restaurant.findById(id)


  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.json(restaurant);
});

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Public
export const updateRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;



  const restaurant = await Restaurant.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.json(restaurant);
});

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Public
export const deleteRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;



  const restaurant = await Restaurant.findByIdAndDelete(id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.json({ message: 'Restaurant removed successfully' });
});

// @desc    Search restaurants
// @route   GET /api/restaurants/search
// @access  Public
export const searchRestaurants = asyncHandler(async (req, res) => {
  const { name, cuisineType, location } = req.query;
  const query = {};

  if (name) query.name = { $regex: name, $options: 'i' };
  if (cuisineType) query.cuisineType = cuisineType;
  if (location) query.address = { $regex: location, $options: 'i' };

  const results = await Restaurant.find(query);
  res.json(results);
});

// @desc    Upload restaurant images
// @route   POST /api/restaurants/:id/images
// @access  Public
export const uploadImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { images } = req.body;

  if (!images || !Array.isArray(images)) {
    res.status(400);
    throw new Error('Invalid images array');
  }

  const restaurant = await Restaurant.findByIdAndUpdate(
    id,
    { $push: { images: { $each: images } } },
    { new: true }
  );

  res.json(restaurant);
});