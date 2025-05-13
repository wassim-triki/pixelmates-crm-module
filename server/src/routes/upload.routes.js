const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const { protect } = require('../middlewares/auth.middleware');
const router = express.Router();

// Configure multer with Cloudinary storage
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload multiple images
router.post('/images', protect, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Get the URLs from the uploaded files
    const imageUrls = req.files.map(file => file.path);

    res.status(200).json({
      message: 'Images uploaded successfully',
      imageUrls
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ 
      message: 'Error uploading images', 
      error: error.message 
    });
  }
});

module.exports = router;
