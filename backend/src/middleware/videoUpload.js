const multer = require("multer");

function videoFilter(req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith("video/")) cb(null, true);
  else cb(new Error("Only video files allowed!"), false);
}

module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter: videoFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});
