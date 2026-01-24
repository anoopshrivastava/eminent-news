const Short = require("../models/shortsModel");
const cloudinary = require("../config/cloudinary");
const Errorhandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Upload short 
exports.uploadShort = async (req, res) => {
  try {
    const {
      title,
      description = "",
      videoUrl,
      publicId,
      duration,
      videoMimeType = "video/mp4",
      thumbnail = "",
    } = req.body;

    const editor = req.user?.id;
    const role = req.user?.role;

    if (!editor) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }


    if (!["editor", "admin"].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Only editor or admin can upload shorts",
      });
    }

    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        message: "Video URL is required",
      });
    }

    const short = await Short.create({
      title,
      description,
      videoUrl,
      publicId,
      duration,
      videoMimeType,
      thumbnail,
      editor,
    });

    res.status(201).json({
      success: true,
      message: "Short uploaded successfully!",
      short,
    });

  } catch (error) {
    console.error("uploadShort error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};



// Get all shorts 
exports.getShorts = async (req, res) => {
  try {
   
    const shorts = await Short.find()
      .populate("editor", "name email")
      .populate("comments.user", "name avatar")
      .sort({ createdAt: -1 });

    return res.json({ success: true, shorts });
  } catch (error) {
    console.error("getShorts error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

exports.getMyShorts = async (req, res, next) => {
  try {
   
    const userId = req.user._id;

    if (!userId) {
        return next(new Errorhandler("editor ID is required", 400));
    }

    const shorts = await Short.find({editor: userId})
      .populate("editor", "name email")
      .populate("comments.user", "name avatar")
      .sort({ createdAt: -1 });

    return res.json({ success: true, shorts });
  } catch (error) {
    console.error("getShorts error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// Delete a short (only owner or admin)
exports.deleteShort = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const short = await Short.findById(id);

    if (!short) {
      return res.status(404).json({ success: false, message: "Short not found" });
    }

    // Authorization: owner or admin can delete
    // adjust check depending on your User model (e.g., req.user.role)
    const isOwner = short.editor && short.editor.toString() === userId.toString();
    const isAdmin = req.user && req.user.role && req.user.role === "admin"; // adapt as needed

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden: not allowed to delete this short" });
    }

    // Delete from Cloudinary if publicId present
    if (short.publicId) {
      try {

        const destroyResult = await cloudinary.uploader.destroy(short.publicId, { resource_type: "video" });
        console.log("cloudinary destroy result:", destroyResult);
      } catch (cloudErr) {
        console.warn("Cloudinary delete failed:", cloudErr);
      }
    }
    // Remove DB record
    await Short.findByIdAndDelete(id);

    return res.json({ success: true, message: "Short deleted successfully" });
  } catch (error) {
    console.error("deleteShort error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

exports.addComment = catchAsyncErrors(async (req, res, next) => {

    const { id: shortsId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    if (!comment || !comment.trim()) {
        return next(new Errorhandler("Comment cannot be empty", 400));
    }

    const shorts = await Short.findById(shortsId);
    if (!shorts) {
        return next(new Errorhandler("shorts not found", 404));
    }

    const newComment = {
        user: userId,
        comment,
    };

    shorts.comments.push(newComment);
    await shorts.save();

    res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment: shorts.comments[shorts.comments.length - 1],
    });
});


exports.deleteComment = catchAsyncErrors(async (req, res, next) => {
    const { id: shortsId, commentId } = req.params;
    const userId = req.user._id;

    const shorts = await Short.findById(shortsId);
    if (!shorts) {
        return next(new Errorhandler("Shorts not found", 404));
    }

    const comment = shorts.comments.id(commentId);

    if (!comment) {
        return next(new Errorhandler("Comment not found", 404));
    }

    // allow only owner of comment
    if (comment.user.toString() !== userId.toString()) {
        return next(new Errorhandler("You can delete only your own comment", 403));
    }

    comment.deleteOne(); // mongoose subdocument delete
    await shorts.save();

    res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
    });
});
