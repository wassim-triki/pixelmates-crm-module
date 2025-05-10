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
  const { userEmail, rewardId, reservationId } = req.body;

  console.log('Received redemption request:', { userEmail, rewardId, reservationId });

  // Find user by email instead of userId
  const user = await User.findOne({ email: userEmail });
  const reward = await Reward.findById(rewardId);

  if (!user || !reward) {
    console.log('User or reward not found');
    return res.status(404).json({ message: 'User or Reward not found' });
  }

  if (!reward.isActive) {
    console.log('Reward is inactive');
    return res.status(400).json({ message: 'Reward is inactive' });
  }

  if (user.points < reward.pointsCost) {
    console.log(`Not enough points: User has ${user.points}, reward costs ${reward.pointsCost}`);
    return res.status(400).json({ message: 'Not enough points' });
  }

  // Deduct points
  user.points -= reward.pointsCost;
  await user.save();

  const redemption = new Redemption({
    user: user._id,  // Save the user's ID in the redemption
    reward: rewardId,
    reservation: reservationId || null,
  });

  const saved = await redemption.save();
  console.log('Redemption saved:', saved);

  res.status(201).json(saved);
});



