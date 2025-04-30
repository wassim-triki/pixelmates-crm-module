const LoyaltyProgram = require('../models/LoyaltyProgram');

// Create or update loyalty entry
exports.createOrUpdateLoyalty = async (req, res) => {
  try {
    const { user, restaurant, points = 0 } = req.body;

    let loyalty = await LoyaltyProgram.findOne({ user });

    if (loyalty) {
      // Update points and reservation count
      loyalty.points += points;
      loyalty.totalReservations += 1;
      loyalty.lastReservationDate = new Date();

      // Update level based on points
      if (loyalty.points >= 1000) {
        loyalty.level = 'Gold';
      } else if (loyalty.points >= 500) {
        loyalty.level = 'Silver';
      }

      await loyalty.save();
    } else {
      loyalty = await LoyaltyProgram.create({
        user,
        restaurant,
        points,
        totalReservations: 1,
        lastReservationDate: new Date(),
      });
    }

    res.status(200).json(loyalty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get by user
exports.getLoyaltyByUser = async (req, res) => {
  try {
    const loyalty = await LoyaltyProgram.findOne({ user: req.params.userId }).populate('user').populate('restaurant');
    if (!loyalty) return res.status(404).json({ message: 'Loyalty record not found' });
    res.json(loyalty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all loyalty entries for a restaurant
exports.getLoyaltyByRestaurant = async (req, res) => {
  try {
    const loyaltyList = await LoyaltyProgram.find({ restaurant: req.params.restaurantId }).populate('user');
    res.json(loyaltyList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update manually
exports.updateLoyalty = async (req, res) => {
  try {
    const updated = await LoyaltyProgram.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete
exports.deleteLoyalty = async (req, res) => {
  try {
    await LoyaltyProgram.findByIdAndDelete(req.params.id);
    res.json({ message: 'Loyalty record deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};








 