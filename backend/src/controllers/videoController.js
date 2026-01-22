const Video = require("../models/videoModel");
const cloudinary = require("../config/cloudinary");
const Errorhandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Upload video (≤ 3 min)
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description = "", duration } = req.body;
    const editor = req.user._id;
    const role = req.user.role;

    if (!["editor", "admin"].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Only editor or admin can upload videos",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    if (!duration || Number(duration) > 180) {
      return res.status(400).json({
        success: false,
        message: "Video duration must be 3 minutes or less",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "videos",
        transformation: [{ quality: "auto" }],
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({
            success: false,
            message: "Cloudinary upload failed",
          });
        }

        const video = await Video.create({
          title,
          description,
          videoUrl: result.secure_url,
          publicId: result.public_id,
          duration,
          videoMimeType: req.file.mimetype,
          isApproved: true,
          editor,
        });

        res.status(201).json({
          success: true,
          message: "Video uploaded successfully",
          video,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("uploadVideo error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// Get all videos (public)
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("editor", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, videos });
  } catch (error) {
    console.error("getVideos error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get my videos
exports.getMyVideos = async (req, res, next) => {
  const userId = req.user?._id;
  const role = req.user?.role;

  if (!userId) {
    return next(new Errorhandler("User ID required", 400));
  }

  // Build query condition
  const query = role === "admin" ? {} : { editor: userId };

  const videos = await Video.find(query)
    .populate("editor", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    videos,
  });
};


// Delete video (owner or admin)
exports.deleteVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return res.status(404).json({
      success: false,
      message: "Video not found",
    });
  }

  const isOwner = video.editor.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this video",
    });
  }

  if (video.publicId) {
    await cloudinary.uploader.destroy(video.publicId, {
      resource_type: "video",
    });
  }

  await video.deleteOne();

  res.json({
    success: true,
    message: "Video deleted successfully",
  });
};

// toggle like / unlike for a videos post
exports.likeVideos = catchAsyncErrors(async (req, res, next) => {
    const videosId = req.params.id;
    const userId = req.user._id; // requires isAuthenticatedUser to set req.user
  
    // find videos
    const videos = await Video.findById(videosId);
    if (!videos) {
      return next(new Errorhandler("video not found", 404));
    }
  
    // check if already liked by this user
    const alreadyLiked = videos.likes.some(l => l.user.toString() === userId.toString());
  
    if (alreadyLiked) {
      // unlike: remove the like entry
      videos.likes = videos.likes.filter(l => l.user.toString() !== userId.toString());
      await videos.save();
  
      return res.status(200).json({
        success: true,
        message: "Video unliked",
        likesCount: videos.likes.length,
      });
    } else {
      // like: add the like entry
      videos.likes.push({ user: userId });
      await videos.save();
  
      return res.status(200).json({
        success: true,
        message: "Video liked",
        likesCount: videos.likes.length,
      });
    }
  });

// Get videos details
exports.getVideoDetails=catchAsyncErrors(async(req,res,next)=>{
    let video = await Video.findById(req.params.id).populate('editor').populate("comments.user", "name avatar");
    
    if(!video){
        return next(new Errorhandler("Video Not Found",404));
    }
    res.status(200).json({
        success:true,
        video,
    })
})

exports.addComment = catchAsyncErrors(async (req, res, next) => {

    const { id: videoId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    if (!comment || !comment.trim()) {
        return next(new Errorhandler("Comment cannot be empty", 400));
    }

    const videos = await Video.findById(videoId);
    if (!videos) {
        return next(new Errorhandler("videos not found", 404));
    }

    const newComment = {
        user: userId,
        comment,
    };

    videos.comments.push(newComment);
    await videos.save();

    res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment: videos.comments[videos.comments.length - 1],
    });
});


exports.deleteComment = catchAsyncErrors(async (req, res, next) => {
    const { id: videoId, commentId } = req.params;
    const userId = req.user._id;

    const videos = await Video.findById(videoId);
    if (!videos) {
        return next(new Errorhandler("videos not found", 404));
    }

    const comment = videos.comments.id(commentId);

    if (!comment) {
        return next(new Errorhandler("Comment not found", 404));
    }

    // allow only owner of comment
    if (comment.user.toString() !== userId.toString()) {
        return next(new Errorhandler("You can delete only your own comment", 403));
    }

    comment.deleteOne(); // mongoose subdocument delete
    await videos.save();

    res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
    });
});
