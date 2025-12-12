const express = require("express");
const router = express.Router();
const uploadVideo = require("../middleware/videoUpload");
const { uploadShort, getShorts, deleteShort, getMyShorts } = require("../controllers/shortController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/shorts/upload", isAuthenticatedUser, authorizeRoles("editor","admin"), uploadVideo.single("video"), uploadShort);

// Get all shorts (public)
router.get("/shorts", getShorts);

router.get("/my-shorts",isAuthenticatedUser, getMyShorts);

// Delete a short 
router.delete("/shorts/:id", isAuthenticatedUser, authorizeRoles("editor","admin"), deleteShort);

module.exports = router;
