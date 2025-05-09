const Redemption = require('../models/Redemption');
const Reward = require('../models/Reward');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Get all redemptions
exports.getAllRedemptions = asyncHandler(async (req, res) => {
  const redemptions = await Redemption.find().populate('user reward reservation');
  res.json(redemptions);
});

// Get redemption by ID
exports.getRedemptionById = asyncHandler(async (req, res) => {
  const redemption = await Redemption.findById(req.params.id).populate('user reward reservation');
  if (!redemption) return res.status(404).json({ message: 'Redemption not found' });
  res.json(redemption);
});

// Redeem a reward
exports.redeemReward = asyncHandler(async (req, res) => {
  const { userId, rewardId, reservationId } = req.body;

  const user = await User.findById(userId);
  const reward = await Reward.findById(rewardId);

  if (!user || !reward) return res.status(404).json({ message: 'User or Reward not found' });
  if (!reward.isActive) return res.status(400).json({ message: 'Reward is inactive' });
  if (user.points < reward.pointsCost) return res.status(400).json({ message: 'Not enough points' });

  // Deduct points
  user.points -= reward.pointsCost;
  await user.save();

  // Create redemption record
  const redemption = new Redemption({
    user: userId,
    reward: rewardId,
    reservation: reservationId || null
  });

  const saved = await redemption.save();
  res.status(201).json(saved);
});
