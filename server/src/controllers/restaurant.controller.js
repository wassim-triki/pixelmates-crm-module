const Restaurant = require('../models/Restaurant.js');
const Table = require('../models/Table.js');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler.js');
const fs = require('fs').promises;

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Public
const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      address,
      cuisineType,
      taxeTPS,
      taxeTVQ,
      color = '#FFFFFF',
      logo = '',
      promotion = '',
      payCashMethod = 'not-accepted',
      images = [],
    } = req.body;

    if (
      !name ||
      !address ||
      !cuisineType ||
      taxeTPS == null ||
      taxeTVQ == null
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Parse tax fields to remove percentage signs and convert to numbers
    const parsedTaxeTPS = parseFloat(taxeTPS.toString().replace('%', ''));
    const parsedTaxeTVQ = parseFloat(taxeTVQ.toString().replace('%', ''));

    // Validate parsed tax values
    if (isNaN(parsedTaxeTPS) || isNaN(parsedTaxeTVQ)) {
      return res
        .status(400)
        .json({ message: 'Taxe TPS and Taxe TVQ must be valid numbers' });
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      cuisineType,
      taxeTPS: parsedTaxeTPS,
      taxeTVQ: parsedTaxeTVQ,
      color,
      logo,
      promotion,
      payCashMethod,
      images: [],
      tables: [],
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Server error while creating restaurant' });
  }
};

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('tables');
    res.status(200).json({ count: restaurants.length, restaurants });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching restaurants', error: error.message });
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      'tables'
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching restaurant', error: error.message });
  }
};

const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  // Prevent direct tables manipulation
  if (req.body.tables) {
    return res.status(400).json({ message: 'Cannot update tables directly' });
  }

  // Build up simple scalar updates
  const updates = {};
  [
    'name',
    'description',
    'address',
    'cuisineType',
    'color',
    'logo',
    'promotion',
    'payCashMethod',
  ].forEach((field) => {
    if (req.body[field] != null) {
      updates[field] = req.body[field];
    }
  });

  // Parse and validate taxes
  if (req.body.taxeTPS != null) {
    const val = parseFloat(req.body.taxeTPS.toString().replace('%', ''));
    if (isNaN(val)) {
      return res
        .status(400)
        .json({ message: 'Taxe TPS must be a valid number' });
    }
    updates.taxeTPS = val;
  }
  if (req.body.taxeTVQ != null) {
    const val = parseFloat(req.body.taxeTVQ.toString().replace('%', ''));
    if (isNaN(val)) {
      return res
        .status(400)
        .json({ message: 'Taxe TVQ must be a valid number' });
    }
    updates.taxeTVQ = val;
  }

  // 1) Handle explicit thumbnail deletion
  if (req.body.thumbnail !== undefined && !req.files?.thumbnail) {
    restaurant.thumbnail = '';
  }

  // 2) Handle JSON list of existing images
  if (req.body.images != null) {
    let imgs = req.body.images;
    if (typeof imgs === 'string') {
      try {
        imgs = JSON.parse(imgs);
      } catch {
        return res.status(400).json({ message: 'Invalid images JSON' });
      }
    }
    if (Array.isArray(imgs)) {
      restaurant.images = imgs;
    }
  }

  // 3) Handle any newly uploaded files
  if (req.files) {
    // thumbnail upload
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      restaurant.thumbnail = req.files.thumbnail[0].path;
    }
    // gallery uploads
    if (req.files.images) {
      restaurant.images = req.files.images.map((f) => f.path);
    }
  }

  // 4) Apply our simple scalar updates
  Object.assign(restaurant, updates);

  // 5) Parse & assign geolocation (optional)
  if (req.body.latitude != null) {
    const lat = parseFloat(req.body.latitude);
    if (isNaN(lat)) {
      return res
        .status(400)
        .json({ message: 'Latitude must be a valid number' });
    }
    restaurant.location = restaurant.location || {};
    restaurant.location.latitude = lat;
  }
  if (req.body.longitude != null) {
    const lng = parseFloat(req.body.longitude);
    if (isNaN(lng)) {
      return res
        .status(400)
        .json({ message: 'Longitude must be a valid number' });
    }
    restaurant.location = restaurant.location || {};
    restaurant.location.longitude = lng;
  }

  const saved = await restaurant.save();
  res.json(saved);
});

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Public
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    await Table.deleteMany({ restauId: id });
    await Restaurant.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: 'Restaurant and associated tables deleted' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting restaurant', error: error.message });
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

    const results = await Restaurant.find(query).populate('tables');
    res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error during search', error: error.message });
  }
};

// @desc    Upload restaurant images
// @route   POST /api/restaurants/:id/images
// @access  Public
const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'Invalid images array' });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $push: { images: { $each: images } } },
      { new: true }
    ).populate('tables');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error uploading images', error: error.message });
  }
};

// @desc    Create table for restaurant
// @route   POST /api/restaurants/:restauId/tables
// @access  Public
const createTable = async (req, res) => {
  try {
    const { restauId } = req.params;
    const { nbtable, chairnb, shape, view, features, location } = req.body;

    if (!nbtable || !chairnb) {
      return res
        .status(400)
        .json({ message: 'Missing table number or chair count' });
    }

    const restaurant = await Restaurant.findById(restauId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const qrcodeToken = uuidv4();
    const qrContent = JSON.stringify({
      restaurantId: restauId,
      tableNumber: nbtable,
      chairCount: chairnb,
      token: qrcodeToken,
    });

    const qrFileName = `table-${restauId}-${nbtable}-${qrcodeToken.slice(0, 8)}.png`;
    const qrPath = path.join(__dirname, '../public/qrcodes', qrFileName);
    await fs.mkdir(path.dirname(qrPath), { recursive: true });
    await QRCode.toFile(qrPath, qrContent);

    const table = await Table.create({
      nbtable,
      chairnb,
      shape,
      view,
      features,
      location,
      qrcode: qrcodeToken,
      restauId,
    });

    await Restaurant.findByIdAndUpdate(restauId, {
      $addToSet: { tables: table._id },
    });

    res.status(201).json({
      message: 'Table created',
      table,
      qrImagePath: `/qrcodes/${qrFileName}`,
    });
  } catch (error) {
    const duplicate = error.code === 11000;
    res.status(500).json({
      message: duplicate
        ? 'Table number or QR code already exists'
        : 'Error creating table',
      error: error.message,
    });
  }
};

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public
const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find()
      .populate('restauId', 'name address')
      .sort({ restauId: 1, nbtable: 1 });
    res.status(200).json(tables);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching tables', error: error.message });
  }
};

// @desc    Get tables by restaurant
// @route   GET /api/restaurants/:restauId/tables
// @access  Public
const getTablesByRestaurant = async (req, res) => {
  try {
    const { restauId } = req.params;
    const restaurant = await Restaurant.findById(restauId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const tables = await Table.find({ restauId })
      .populate('restauId', 'name address')
      .sort({ nbtable: 1 });

    res.status(200).json(tables);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching tables', error: error.message });
  }
};

// @desc    Get a single table
// @route   GET /api/restaurants/:restauId/tables/:id
// @access  Public
const getTableById = async (req, res) => {
  try {
    const { id, restauId } = req.params;
    const table = await Table.findById(id).populate('restauId', 'name address');

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (table.restauId._id.toString() !== restauId) {
      return res
        .status(400)
        .json({ message: 'Table does not belong to this restaurant' });
    }

    res.status(200).json(table);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching table', error: error.message });
  }
};

// @desc    Update a table
// @route   PUT /api/restaurants/:restauId/tables/:id
// @access  Public
const updateTable = async (req, res) => {
  try {
    const { id, restauId } = req.params;
    const { nbtable, chairnb, shape, view, features, location } = req.body;
    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (table.restauId.toString() !== restauId) {
      return res
        .status(400)
        .json({ message: 'Table does not belong to this restaurant' });
    }

    table.nbtable = nbtable ?? table.nbtable;
    table.chairnb = chairnb ?? table.chairnb;
    table.shape = shape ?? table.shape;
    table.view = view ?? table.view;
    table.features = features ?? table.features;
    table.location = location ?? table.location;

    await table.save();

    res.status(200).json({ message: 'Table updated', table });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating table', error: error.message });
  }
};

// @desc    Delete a table
// @route   DELETE /api/restaurants/:restauId/tables/:id
// @access  Public
const deleteTable = async (req, res) => {
  try {
    const { id, restauId } = req.params;

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (table.restauId.toString() !== restauId) {
      return res
        .status(400)
        .json({ message: 'Table does not belong to this restaurant' });
    }

    await Table.findByIdAndDelete(id);

    await Restaurant.findByIdAndUpdate(restauId, {
      $pull: { tables: id },
    });

    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting table', error: error.message });
  }
};

// exports.updateRestaurantInformation = asyncHandler(async (req, res) => {
//   const restaurant = await Restaurant.findById(req.params.id);
//   if (!restaurant) {
//     res.status(404);
//     throw new Error('Restaurant not found');
//   }

//   // Update text fields
//   const { name, description, address } = req.body;
//   if (name) restaurant.name = name;
//   if (description) restaurant.description = description;
//   if (address) restaurant.address = address;

//   // Update thumbnail
//   if (req.files && req.files.thumbnail) {
//     restaurant.thumbnailUrl = req.files.thumbnail[0].path;
//   }

//   // Update gallery images (replace array)
//   if (req.files && req.files.images) {
//     restaurant.images = req.files.images.map((file) => file.path);
//   }

//   const updated = await restaurant.save();
//   res.json(updated);
// });

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  uploadImage,
  createTable,
  getAllTables,
  getTablesByRestaurant,
  getTableById,
  updateTable,
  deleteTable,
};
