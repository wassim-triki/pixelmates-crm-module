const express = require('express');
const {
  getAllRewards,
  getRewardById,
  createReward,
  updateReward,
  deleteReward,
} = require('../controllers/reward.controller');

const router = express.Router();

router.get('/', getAllRewards);
router.get('/:id', getRewardById);
router.post('/', createReward);
router.put('/:id', updateReward);
router.delete('/:id', deleteReward);

module.exports = router;
