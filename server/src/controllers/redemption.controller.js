const Redemption = require('../models/Redemption');
const Reward = require('../models/Reward');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
/*
// Get all redemptions
exports.getAllRedemptions = asyncHandler(async (req, res) => {
  const redemptions = await Redemption.find().populate('user reward reservation');
  res.json(redemptions);
});
*/
exports.getAllRedemptions = asyncHandler(async (req, res) => {
  const { userEmail, restaurantId } = req.query;

  let finalRestaurantId;

  if (restaurantId) {
    finalRestaurantId = restaurantId;
  } else if (userEmail) {
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });
    finalRestaurantId = user.restaurantId;
  } else {
    return res.status(400).json({ message: 'Missing userEmail or restaurantId' });
  }

  const rewards = await Reward.find({ restaurant: finalRestaurantId });
  const rewardIds = rewards.map(r => r._id);

  const redemptions = await Redemption.find({ reward: { $in: rewardIds } })
    .populate('user reward reservation');

  res.json(redemptions);
});





// Get redemption by ID
exports.getRedemptionById = asyncHandler(async (req, res) => {
  const redemption = await Redemption.findById(req.params.id).populate('user reward reservation');
  if (!redemption) return res.status(404).json({ message: 'Redemption not found' });
  res.json(redemption);
});
 
/*
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
*/

/*
exports.redeemReward = asyncHandler(async (req, res) => {
  const { userEmail, rewardId, reservationId } = req.body;

  // Find user by email instead of userId
  const user = await User.findOne({ email: userEmail });
  const reward = await Reward.findById(rewardId);

  if (!user || !reward) {
    return res.status(404).json({ message: 'User or Reward not found' });
  }

  if (!reward.isActive) {
    return res.status(400).json({ message: 'Reward is inactive' });
  }

  if (user.points < reward.pointsCost) {
    return res.status(400).json({ message: 'Not enough points' });
  }

  // Deduct points
  user.points -= reward.pointsCost;
  await user.save();

  const redemption = new Redemption({
    user: user._id, // Save the user's ID in the redemption
    reward: rewardId,
    reservation: reservationId || null,
  });

  const saved = await redemption.save();
  res.status(201).json(saved);
});*/

// Get all rewards
exports.getAllRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find();
  res.json(rewards);
});




exports.redeemReward = asyncHandler(async (req, res) => {
  const { userEmail, rewardId, reservationId } = req.body;

  // Find user and reward
  const user = await User.findOne({ email: userEmail });
  const reward = await Reward.findById(rewardId);

  if (!user || !reward) {
    return res.status(404).json({ message: 'User or Reward not found' });
  }

  if (!reward.isActive) {
    return res.status(400).json({ message: 'Reward is inactive' });
  }

  if (user.points < reward.pointsCost) {
    return res.status(400).json({ message: 'Not enough points' });
  }

  // Deduct points and update VIP level
  user.points -= reward.pointsCost;
  updateVIPLevel(user);
  await user.save();

  const redemption = new Redemption({
    user: user._id,
    reward: rewardId,
    reservation: reservationId || null,
  });

  const saved = await redemption.save();

  res.status(201).json({
    redemption: saved,
    updatedUser: {
      email: user.email,
      points: user.points,
      vipLevel: user.vipLevel,
    },
  });
});



function updateVIPLevel(user) {
  const points = user.points;
  if (points >= 1000) user.vipLevel = 'Platinum';
  else if (points >= 500) user.vipLevel = 'Gold';
  else if (points >= 250) user.vipLevel = 'Silver';
  else user.vipLevel = 'Bronze';
}


// Delete a redemption
// Delete a redemption
exports.deleteRedemption = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Redemption ID is required' });
  }

  const redemption = await Redemption.findByIdAndDelete(id);
  if (!redemption) {
    return res.status(404).json({ message: 'Redemption not found' });
  }

  res.status(200).json({ message: 'Redemption deleted successfully' });
});