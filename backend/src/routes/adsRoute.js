const express = require('express');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();
const upload = require('../middleware/fileUpload');
const { createAds, getAllAds, deleteAds } = require('../controllers/adsController');

// create product --> Admin access
router.post('/ads/create',isAuthenticatedUser,authorizeRoles("editor","admin"),upload.array("images", 10),createAds)

// getting all products
router.get('/ads',getAllAds);

// delete the product -- Admin
router.delete('/ads/:id',isAuthenticatedUser,authorizeRoles("admin"),deleteAds);


module.exports = router