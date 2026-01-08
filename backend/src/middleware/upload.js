const multer = require("multer");

function fileFilter(req, file, cb) {
  if (
    file.fieldname === "video" &&
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else if (
    file.fieldname === "images" &&
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
}

const uploadBoth = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

module.exports = uploadBoth;
