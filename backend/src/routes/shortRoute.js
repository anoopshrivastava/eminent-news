const express = require("express");
const router = express.Router();

const { uploadShort, getShorts, deleteShort, getMyShorts, addComment, deleteComment } = require("../controllers/shortController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/shorts/upload", isAuthenticatedUser, authorizeRoles("editor","admin"), uploadShort);

// Get all shorts (public)
router.get("/shorts", getShorts);

router.get("/my-shorts",isAuthenticatedUser, getMyShorts);

// Delete a short 
router.delete("/shorts/:id", isAuthenticatedUser, authorizeRoles("editor","admin"), deleteShort);

// comment on shorts
router.post('/shorts/:id/comment',isAuthenticatedUser,addComment);

// delete own comments
router.delete('/shorts/:id/comment/:commentId',isAuthenticatedUser,deleteComment);

module.exports = router;
