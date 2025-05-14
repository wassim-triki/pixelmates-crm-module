const express = require('express');
const {
  getAllRedemptions,
  getRedemptionById,
  redeemReward,
   deleteRedemption, 
} = require('../controllers/redemption.controller');

const router = express.Router();

router.get('/', getAllRedemptions);
router.get('/:id', getRedemptionById);
router.post('/redeem', redeemReward);
router.delete('/:id', deleteRedemption);

module.exports = router;
