const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    videoUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String, // Cloudinary public_id
    },
    thumbnail: {
      type: String,
      default: "",
    },
    duration: {
      type: Number, // seconds
      required: true,
      max: 180,
    },
    isApproved:{
        type:Boolean,
        default: false,
    },
    videoMimeType: {
      type: String,
      default: "video/mp4",
    },
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    comments:[commentSchema],
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
