const express = require("express");
const router = express.Router();
const uploadVideo = require("../middleware/videoUpload");
const {
  uploadVideo: uploadVideoController,
  getVideos,
  getMyVideos,
  deleteVideo,
  likeVideos,
  getVideoDetails,
  addComment,
  deleteComment,
} = require("../controllers/videoController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/videos/upload",isAuthenticatedUser,authorizeRoles("editor", "admin"),uploadVideo.single("video"),  uploadVideoController);

router.get("/videos", getVideos);
router.get("/my-videos", isAuthenticatedUser, getMyVideos);

// like / unlike a news videos (toggle)
router.put('/videos/:id/like', isAuthenticatedUser, likeVideos);


router.get("/videos/:id",getVideoDetails);
router.delete("/videos/:id",isAuthenticatedUser,authorizeRoles("editor", "admin"),deleteVideo);

// comment on videos
router.post('/videos/:id/comment',isAuthenticatedUser,addComment);

// delete own comment
router.delete('/videos/:id/comment/:commentId',isAuthenticatedUser,deleteComment);

module.exports = router;
