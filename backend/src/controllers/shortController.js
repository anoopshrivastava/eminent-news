const Short = require("../models/shortsModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

// Upload short 
exports.uploadShort = async (req, res) => {
  try {
    const { title, description = "" } = req.body;
    const editor = req.user?.id;

    if (!editor) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Video is required." });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "shorts",
        transformation: [{ quality: "auto" }],   // 🔥 compression
        eager: [
          { width: 720, height: 1280, crop: "limit", format: "mp4", quality: "auto" },
          { width: 480, height: 854, crop: "limit", format: "mp4", quality: "auto" }
        ],
        eager_async: true,
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error", error);
          return res.status(500).json({ success: false, message: "Cloudinary upload error" });
        }

        const short = await Short.create({
          title,
          description,
          videoUrl: result.secure_url,
          publicId: result.public_id,
          videoMimeType: req.file.mimetype,
          editor,
        });

        return res.json({
          success: true,
          message: "Short uploaded successfully!",
          short,
        });
      }
    );

    // Use buffer instead of path
    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error("uploadShort error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Get all shorts 
exports.getShorts = async (req, res) => {
  try {
   
    const shorts = await Short.find()
      .populate("editor", "name email")
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
