const express = require('express');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();
const uploadBoth = require('../middleware/upload');
const { createAds, getAllAds, deleteAds, getMyAds, toggleAdsApproval, getVideoDetailAd } = require('../controllers/adsController');

// create product --> Admin access
router.post('/ads/create',isAuthenticatedUser,authorizeRoles("user","editor","admin"),uploadBoth.fields([
    { name: "images", maxCount: 6 }
]),createAds)

// getting all ads for users
router.get('/ads',getAllAds);

// getting ads by role
router.get('/my-ads',isAuthenticatedUser,authorizeRoles("user","editor","admin"),getMyAds);

// get ad for video
router.get('/ads/video/:videoId',getVideoDetailAd);

// delete the product -- Admin
router.delete('/ads/:id',isAuthenticatedUser,authorizeRoles("user","admin", "editor"),deleteAds);

// update status of ad
router.put("/ads/:id/approve",isAuthenticatedUser,authorizeRoles("admin"),toggleAdsApproval);



module.exports = router