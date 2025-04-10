const Table = require('../models/Table');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

exports.createTable = async (req, res) => {
  try {
    const { nbtable, chairnb, restauId } = req.body;

    // Check for missing fields
    const missingFields = [];
    if (!nbtable) missingFields.push('nbtable');
    if (!chairnb) missingFields.push('chairnb');
    if (!restauId) missingFields.push('restauId');

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Generate a unique token for qrcode
    const qrcodeToken = uuidv4(); // e.g., "550e8400-e29b-41d4-a716-446655440000"

    // Define QR code content as table data
    const qrContent = JSON.stringify({
      restaurantId: restauId,
      tableNumber: nbtable,
      chairCount: chairnb,
      token: qrcodeToken
    });
    // Example: {"restaurantId":"67f816758693881c217788ea","tableNumber":1,"chairCount":4,"token":"550e8400-e29b-41d4-a716-446655440000"}

    const qrFileName = `table-${restauId}-${nbtable}-${qrcodeToken.slice(0, 8)}.png`;
    const qrPath = path.join(__dirname, '../../public/qrcodes', qrFileName);

    // Ensure directory exists
    await fs.mkdir(path.dirname(qrPath), { recursive: true });

    // Generate and save QR code image with table data
    await QRCode.toFile(qrPath, qrContent);

    // Use the token as the qrcode value in the database
    const table = new Table({ 
      nbtable, 
      chairnb, 
      qrcode: qrcodeToken, 
      restauId 
    });
    await table.save();

    // Return the table and the image path
    res.status(201).json({ 
      message: 'Table created successfully', 
      table, 
      qrImagePath: `/qrcodes/${qrFileName}` 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Table number or QR code already exists for this restaurant' 
      });
    }
    res.status(500).json({ 
      message: 'Error creating table', 
      error: error.message 
    });
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