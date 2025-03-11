const Restaurant = require('../models/Restaurant.js');

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Public
const createRestaurant = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the request body

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
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      cuisineType,
      taxeTPS,
      taxeTVQ,
      color: color || '#FFFFFF',
      logo: logo || '',
      promotion: promotion || '',
      payCashMethod: payCashMethod || 'not-accepted',
      images: images || [],
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error); // Log the error
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json({
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Public
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Public
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search restaurants
// @route   GET /api/restaurants/search
// @access  Public
const searchRestaurants = async (req, res) => {
  try {
    const { name, cuisineType, location } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (cuisineType) query.cuisineType = cuisineType;
    if (location) query.address = { $regex: location, $options: 'i' };

    const results = await Restaurant.find(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload restaurant images
// @route   POST /api/restaurants/:id/images
// @access  Public
const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body;

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ message: 'Invalid images array' });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $push: { images: { $each: images } } },
      { new: true }
    );

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  uploadImage,
};
