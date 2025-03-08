const express = require('express');
const {
 
  getAllRoles,
} = require('../controllers/role.controller.js');

const router = express.Router();
 
router.get('/', getAllRoles);
  
module.exports = router;
