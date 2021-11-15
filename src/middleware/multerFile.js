const multer = require("multer");
const path = require("path");
const AppError = require("../appError/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new AppError("FILE IS NOT AN PDF", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  // limits: {
  //   fileSize: 1048576,
  // },
});

exports.uploadBlogPDF = upload.single("filePDF");
// exports.uploadCoursePDF = upload.single("courseCertificatePDF");
exports.uploadResumePDF = upload.single("resumePDF");

