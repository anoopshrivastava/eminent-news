const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // keep original extension
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

function videoFilter(req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith("video/")) cb(null, true);
  else cb(new Error("Only video files allowed!"), false);
}

module.exports = multer({
  storage,
  fileFilter: videoFilter,
  limits: {
    // 5 MB = 5 * 1024 * 1024 = 5,242,880 bytes
    fileSize: 20 * 1024 * 1024,
  },
});
