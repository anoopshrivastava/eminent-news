const express = require("express");
const router = express.Router();
const uploadVideo = require("../middleware/videoUpload");
const { uploadShort, getShorts, deleteShort } = require("../controllers/shortController");
const { isAuthenticatedUser } = require("../middleware/auth");

router.post("/shorts/upload", isAuthenticatedUser, uploadVideo.single("video"), uploadShort);

// Get all shorts (public)
router.get("/shorts", getShorts);

// Delete a short 
router.delete("/shorts/:id", isAuthenticatedUser, deleteShort);

module.exports = router;
