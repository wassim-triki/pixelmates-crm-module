const Table = require('../models/Table');

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const { nbtable, chairnb, qrcode, restauId } = req.body;
    if (!nbtable || !chairnb || !qrcode || !restauId) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const table = new Table({ nbtable, chairnb, qrcode, restauId });
    await table.save();
    res.status(201).json({ message: 'Table created successfully', table });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Table number or QR code already exists for this restaurant' });
    }
    res.status(500).json({ message: 'Error creating table', error: error.message });
  }
};

// Get all tables (across all restaurants)
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find()
      .populate('restauId', 'name address')
      .sort({ restauId: 1, nbtable: 1 });
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all tables', error: error.message });
  }
};

// Get all tables for a restaurant
exports.getTablesByRestaurant = async (req, res) => {
  try {
    const { restauId } = req.params;
    const tables = await Table.find({ restauId })
      .populate('restauId', 'name address')
      .sort({ nbtable: 1 });
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tables', error: error.message });
  }
};

// Get a single table by ID
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate('restauId', 'name address');
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching table', error: error.message });
  }
};

// Update a table
exports.updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const table = await Table.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json({ message: 'Table updated successfully', table });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Table number or QR code already exists for this restaurant' });
    }
    res.status(500).json({ message: 'Error updating table', error: error.message });
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting table', error: error.message });
  }
};