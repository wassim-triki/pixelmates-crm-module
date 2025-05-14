const Reward = require('../models/Reward');
const asyncHandler = require('../utils/asyncHandler');

const Redemption = require('../models/Redemption'); // Import the Redemption model

// Get redemptions for a specific reward
exports.getRedemptionsForReward = asyncHandler(async (req, res) => {
  const rewardId = req.params.id; // Get the reward ID from the route parameters

  // Fetch redemptions related to the reward
  const redemptions = await Redemption.find({ reward: rewardId }).populate('user reservation'); // Adjust according to your model

  if (!redemptions || redemptions.length === 0) {
    return res.status(404).json({ message: 'No redemptions found for this reward' });
  }

  // Respond with the found redemptions
  res.json(redemptions);
});

// Get all rewards
exports.getAllRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find().populate('restaurant');
  res.json(rewards);
});

// Get reward by ID
exports.getRewardById = asyncHandler(async (req, res) => {
  const reward = await Reward.findById(req.params.id).populate('restaurant');
  if (!reward) return res.status(404).json({ message: 'Reward not found' });
  res.json(reward);
});

// Create reward
// Create reward
exports.createReward = asyncHandler(async (req, res) => {
    // Check if restaurant ID is valid
    if (!req.body.restaurant) {
      return res.status(400).json({ message: 'Restaurant is required' });
    }
  
    // Create the reward instance with the data from the request body
    const reward = new Reward(req.body);
  
    try {
      const savedReward = await reward.save();
      return res.status(201).json(savedReward);
    } catch (err) {
      console.error('Error saving reward:', err);
      return res.status(500).json({ message: 'Failed to create reward', error: err.message });
    }
  });
  

// Update reward
exports.updateReward = asyncHandler(async (req, res) => {
  const updated = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: 'Reward not found' });
  res.json(updated);
});

// Delete reward
exports.deleteReward = asyncHandler(async (req, res) => {
  const deleted = await Reward.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Reward not found' });
  res.json({ message: 'Reward deleted' });
});






// Get rewards for a specific restaurant
exports.getRewardsForRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params; // Get the restaurant ID from the route parameters

  // Fetch rewards related to the restaurant
  const rewards = await Reward.find({ restaurant: restaurantId });

  if (!rewards || rewards.length === 0) {
    return res.status(404).json({ message: 'No rewards found for this restaurant' });
  }

  // Respond with the found rewards
  res.json(rewards);
});