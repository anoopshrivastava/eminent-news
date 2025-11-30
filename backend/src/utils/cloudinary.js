const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload an image to Cloudinary
const uploadImageToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'products'
        });
        return result.secure_url;
        
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Image upload failed.');
    }
};

module.exports = { uploadImageToCloudinary };
