const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "social_media_task", // Folder name
    allowed_formats: ["jpg", "jpeg", "png","gif","bmp","webp"], 
  },
});

// Multer configuration 
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5 MB file size 
});

module.exports = upload;
