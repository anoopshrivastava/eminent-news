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
    fileSize: 150 * 1024 * 1024, // 150MB
  },
});

module.exports = uploadBoth;
