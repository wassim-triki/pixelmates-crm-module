const Table = require('../models/Table');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');

exports.getTables = asyncHandler(async (req, res) => {
  const tables = await Table.find({ restaurant: req.params.restaurantId });
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

  // 1. Fetch existing tables for this restaurant
  const existing = await Table.find({ restaurant: restaurantId });
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
    if (item._id) {
      // Update branch
      const updateData = { ...item };
      delete updateData._id;
      updateData.restaurant = restaurantId;

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
      });
      const saved = await newTable.save();
      results.push(saved);
    }
  }

  // 5. Return the fully up-to-date list
  res.json(results);
});
