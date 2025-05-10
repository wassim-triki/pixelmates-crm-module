const express = require('express');
const {
  getAllRewards,
  getRewardById,
  createReward,
  updateReward,
  deleteReward,
  getRedemptionsForReward
} = require('../controllers/reward.controller');

const router = express.Router();

router.get('/', getAllRewards);
router.get('/:id', getRewardById);
router.post('/', createReward);
router.put('/:id', updateReward);
router.delete('/:id', deleteReward);
router.get('/:id/redemptions', getRedemptionsForReward); // New route to get redemptions for a reward

module.exports = router;
