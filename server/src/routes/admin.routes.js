const { signup } = require('../controllers/admin.controller');
const express = require('express');
const validateSchema = require('../middlewares/validate-schema.middleware');
const { adminSignupSchema } = require('../validators/auth.validator');
const router = express.Router();
router.post('/signup', validateSchema(adminSignupSchema), signup);

module.exports = router;
