const Restaurant = require('../models/Restaurant.js');
const Table = require('../models/Table.js');
const asyncHandler = require('../utils/asyncHandler.js');

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

    // Parse tags if provided
    let tags = [];
    if (req.body.tags) {
      try {
        // Tags might come as a JSON string
        let parsedTags = req.body.tags;
        if (typeof parsedTags === 'string') {
          parsedTags = JSON.parse(parsedTags);
        }

        // Make sure we have an array of tags
        if (Array.isArray(parsedTags)) {
          tags = parsedTags;
        }
      } catch (error) {
        console.error('Error parsing tags:', error);
        // Continue with empty tags if parsing fails
      }
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
      tags: tags,
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
const getRestaurants = async (_, res) => {
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

  if (req.body.workFrom != null) {
    updates.workFrom = req.body.workFrom;
  }
  if (req.body.workTo != null) {
    updates.workTo = req.body.workTo;
  }
  if (req.body.isPublished != null) {
    // form-data booleans come in as strings sometimes
    updates.isPublished =
      req.body.isPublished === true || req.body.isPublished === 'true';
  }

  // Handle tags if provided
  if (req.body.tags) {
    try {
      // Tags might come as a JSON string from FormData
      let parsedTags = req.body.tags;
      if (typeof parsedTags === 'string') {
        parsedTags = JSON.parse(parsedTags);
      }

      // Make sure we have an array of tags
      if (Array.isArray(parsedTags)) {
        updates.tags = parsedTags;
      }
    } catch (error) {
      console.error('Error parsing tags:', error);
      // Don't fail the whole request if tags parsing fails
    }
  }

  // 4) Apply our simple scalar updates
  Object.assign(restaurant, updates);
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

    // Delete tables associated with this restaurant using either field
    await Table.deleteMany({
      $or: [
        { restauId: id },
        { restaurant: id }
      ]
    });

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
    const { name, cuisineType, location, tags } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (cuisineType) query.cuisineType = cuisineType;
    if (location) query.address = { $regex: location, $options: 'i' };

    // Handle tags search
    if (tags) {
      // If tags is a string, convert to array
      const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
      if (tagArray.length > 0) {
        // Find restaurants that have at least one of the specified tags
        query.tags = { $in: tagArray };
      }
    }

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

    // Validate nbtable and chairnb are valid numbers
    if (!nbtable || isNaN(parseInt(nbtable)) || parseInt(nbtable) < 1) {
      return res
        .status(400)
        .json({ message: 'Table number is required and must be a positive number' });
    }

    if (!chairnb || isNaN(parseInt(chairnb)) || parseInt(chairnb) < 1) {
      return res
        .status(400)
        .json({ message: 'Chair count is required and must be a positive number' });
    }

    const restaurant = await Restaurant.findById(restauId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if a table with this number already exists for this restaurant
    const parsedNbtable = parseInt(nbtable);
    const existingTable = await Table.findOne({
      restauId: restauId,
      nbtable: parsedNbtable
    });

    if (existingTable) {
      return res.status(400).json({
        message: `Table number ${nbtable} already exists for this restaurant`
      });
    }

    // Create the table with both restaurant and restauId fields for compatibility
    const tableData = {
      // Fields for Restaurant.jsx
      nbtable: parsedNbtable,
      chairnb: parseInt(chairnb),
      shape: shape || 'rectangle',
      view: view || 'none',
      features: features || [],
      location: location || 'center',

      // Fields for FloorConfiguration.jsx
      number: String(parsedNbtable),
      minCovers: 1,
      maxCovers: parseInt(chairnb),

      // Common fields
      restaurant: restauId,
      restauId: restauId,
      isReserved: false
    };

    const table = await Table.create(tableData);

    // Update the restaurant to include this table
    await Restaurant.findByIdAndUpdate(restauId, {
      $addToSet: { tables: table._id },
    });

    res.status(201).json({
      message: 'Table created',
      table
    });
  } catch (error) {
    console.error('Error creating table:', error);

    const duplicate = error.code === 11000;
    res.status(500).json({
      message: duplicate
        ? 'Table number already exists for this restaurant'
        : 'Error creating table: ' + error.message,
      error: error.message,
    });
  }
};

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public
const getAllTables = async (_, res) => {
  try {
    // Populate both restaurant fields for compatibility
    const tables = await Table.find()
      .populate('restauId', 'name address')
      .populate('restaurant', 'name address')
      .sort({ nbtable: 1 });

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

    // Query using both restaurant and restauId fields for compatibility
    const tables = await Table.find({
      $or: [
        { restauId: restauId },
        { restaurant: restauId }
      ]
    })
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
    // Populate both restaurant fields for compatibility
    const table = await Table.findById(id)
      .populate('restauId', 'name address')
      .populate('restaurant', 'name address');

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check if table belongs to this restaurant using either field
    let tableRestaurantId;
    if (table.restauId && typeof table.restauId === 'object') {
      tableRestaurantId = table.restauId._id.toString();
    } else if (table.restaurant && typeof table.restaurant === 'object') {
      tableRestaurantId = table.restaurant._id.toString();
    } else {
      tableRestaurantId = table.restauId?.toString() || table.restaurant?.toString();
    }

    if (tableRestaurantId !== restauId) {
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

    // Validate nbtable if provided
    if (nbtable !== undefined) {
      if (isNaN(parseInt(nbtable)) || parseInt(nbtable) < 1) {
        return res
          .status(400)
          .json({ message: 'Table number must be a positive number' });
      }
    }

    // Validate chairnb if provided
    if (chairnb !== undefined) {
      if (isNaN(parseInt(chairnb)) || parseInt(chairnb) < 1) {
        return res
          .status(400)
          .json({ message: 'Chair count must be a positive number' });
      }
    }

    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Check if table belongs to this restaurant using either field
    const tableRestaurantId = table.restauId?.toString() || table.restaurant?.toString();
    if (tableRestaurantId !== restauId) {
      return res
        .status(400)
        .json({ message: 'Table does not belong to this restaurant' });
    }

    // If changing table number, check if it already exists
    if (nbtable !== undefined && parseInt(nbtable) !== table.nbtable) {
      const parsedNbtable = parseInt(nbtable);
      const existingTable = await Table.findOne({
        restauId: restauId,
        nbtable: parsedNbtable,
        _id: { $ne: id } // Exclude current table
      });

      if (existingTable) {
        return res.status(400).json({
          message: `Table number ${nbtable} already exists for this restaurant`
        });
      }
    }

    // Update fields
    if (nbtable !== undefined) {
      const parsedNbtable = parseInt(nbtable);
      table.nbtable = parsedNbtable;
      table.number = String(parsedNbtable); // Update number field for FloorConfiguration
    }

    if (chairnb !== undefined) {
      const parsedChairnb = parseInt(chairnb);
      table.chairnb = parsedChairnb;
      table.maxCovers = parsedChairnb; // Update maxCovers field for FloorConfiguration
      table.minCovers = 1; // Set minCovers to 1
    }

    if (shape !== undefined) table.shape = shape;
    if (view !== undefined) table.view = view;
    if (features !== undefined) table.features = features;
    if (location !== undefined) table.location = location;

    // Ensure both restaurant fields are set for compatibility
    table.restauId = restauId;
    table.restaurant = restauId;

    await table.save();

    res.status(200).json({ message: 'Table updated', table });
  } catch (error) {
    console.error('Error updating table:', error);
    res
      .status(500)
      .json({ message: 'Error updating table: ' + error.message, error: error.message });
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

    // Check if table belongs to this restaurant using either field
    const tableRestaurantId = table.restauId?.toString() || table.restaurant?.toString();
    if (tableRestaurantId !== restauId) {
      return res
        .status(400)
        .json({ message: 'Table does not belong to this restaurant' });
    }

    await Table.findByIdAndDelete(id);

    // Remove the table reference from the restaurant
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

const getRestaurantSchedule = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }
  res.json({ workTo: restaurant.workTo, workFrom: restaurant.workFrom });
};

module.exports = {
  createRestaurant,
  getRestaurantSchedule,
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
