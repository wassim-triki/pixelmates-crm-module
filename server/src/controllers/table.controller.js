const Table = require('../models/Table');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');

exports.getTables = asyncHandler(async (req, res) => {
  // Query using both restaurant and restauId fields for compatibility
  const tables = await Table.find({
    $or: [
      { restaurant: req.params.restaurantId },
      { restauId: req.params.restaurantId }
    ]
  });
  res.json(tables);
});

exports.saveTables = asyncHandler(async (req, res) => {
  const restaurantId = req.params.restaurantId;
  const payload = req.body;

  if (!Array.isArray(payload)) {
    return res
      .status(400)
      .json({ message: 'Payload must be an array of table objects.' });
  }

  // Validate all table numbers in the payload
  for (let item of payload) {
    // Handle both field names: 'nbtable' (from Restaurant.jsx) and 'number' (from FloorConfiguration.jsx)
    const tableNumber = item.nbtable || item.number;

    if (!tableNumber || (isNaN(parseInt(tableNumber)) && isNaN(parseFloat(tableNumber))) || parseInt(tableNumber) < 1) {
      return res
        .status(400)
        .json({
          message: 'All tables must have a valid table number (positive integer)',
          invalidTable: item
        });
    }

    // Convert to number and ensure both fields are set
    const parsedNumber = parseInt(tableNumber);
    item.nbtable = parsedNumber;
    item.number = String(parsedNumber); // FloorConfiguration uses string format

    // Handle both chairnb and minCovers/maxCovers
    if (item.chairnb) {
      if (isNaN(parseInt(item.chairnb)) || parseInt(item.chairnb) < 1) {
        return res
          .status(400)
          .json({
            message: 'All tables must have a valid chair count (positive integer)',
            invalidTable: item
          });
      }
      item.chairnb = parseInt(item.chairnb);
    } else if (item.minCovers) {
      // If using minCovers/maxCovers (from FloorConfiguration), set chairnb to maxCovers
      item.chairnb = parseInt(item.maxCovers || item.minCovers);
    }

    // Ensure minCovers and maxCovers are set for FloorConfiguration
    if (item.chairnb && !item.minCovers) {
      item.minCovers = 1;
      item.maxCovers = item.chairnb;
    }
  }

  // Check for duplicate table numbers in the payload
  const tableNumbers = {};
  for (let item of payload) {
    const tableNumber = item.nbtable;
    if (tableNumbers[tableNumber]) {
      return res
        .status(400)
        .json({
          message: `Duplicate table number ${tableNumber} in the payload`,
          duplicateNumber: tableNumber
        });
    }
    tableNumbers[tableNumber] = true;
  }

  // 1. Fetch existing tables for this restaurant (using both fields for compatibility)
  const existing = await Table.find({
    $or: [
      { restaurant: restaurantId },
      { restauId: restaurantId }
    ]
  });
  const existingIds = existing.map((t) => t._id.toString());

  // 2. Identify which IDs are in the payload
  const payloadIds = payload.filter((tab) => tab._id).map((tab) => tab._id);

  // 3. Delete any tables that the UI removed
  const toDelete = existingIds.filter((id) => !payloadIds.includes(id));
  if (toDelete.length) {
    await Table.deleteMany({ _id: { $in: toDelete } });
  }

  const results = [];

  // 4. Upsert: update existing, insert new
  for (let item of payload) {
    try {
      if (item._id) {
        // Update branch
        const updateData = { ...item };
        delete updateData._id;
        // Set both restaurant fields for compatibility
        updateData.restaurant = restaurantId;
        updateData.restauId = restaurantId;

        const updated = await Table.findByIdAndUpdate(item._id, updateData, {
          new: true,
          runValidators: true,
          context: 'query',
        });
        results.push(updated);
      } else {
        // Insert branch
        const newTable = new Table({
          ...item,
          restaurant: restaurantId,
          restauId: restaurantId, // Set both fields for compatibility
        });
        const saved = await newTable.save();
        results.push(saved);
      }
    } catch (error) {
      console.error('Error saving table:', error);
      return res.status(500).json({
        message: 'Error saving table: ' + error.message,
        error: error,
        table: item
      });
    }
  }

  // 5. Return the fully up-to-date list
  res.json(results);
});
