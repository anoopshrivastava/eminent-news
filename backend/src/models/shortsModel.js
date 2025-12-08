const mongoose = require("mongoose");

const shortSchema = new mongoose.Schema(
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
      type: String, // Cloudinary public id for deletes/transformations
    },
    thumbnail: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 0,
    },
    videoMimeType: {
      type: String,
      default: "video/mp4",
    },
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ],
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Short", shortSchema);
