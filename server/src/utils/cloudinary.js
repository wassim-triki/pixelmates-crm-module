// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Determine folder based on request path
const getFolder = (req) => {
  if (req.originalUrl.includes('/upload/images')) {
    return 'complaint_images';
  }
  if (req.originalUrl.includes('/auth/me/update')) {
    return 'profile_pictures';
  }
  if (req.originalUrl.includes('/restaurants')) {
    return 'restaurant_images';
  }
  // Default folder
  return 'uploads';
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: getFolder,
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  },
});

module.exports = {
  cloudinary,
  storage,
};
