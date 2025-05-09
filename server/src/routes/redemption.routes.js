const express = require('express');
const {
  getAllRedemptions,
  getRedemptionById,
  redeemReward,
} = require('../controllers/redemption.controller');

const router = express.Router();

router.get('/', getAllRedemptions);
router.get('/:id', getRedemptionById);
router.post('/redeem', redeemReward);

module.exports = router;
