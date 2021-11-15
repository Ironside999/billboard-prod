const multer = require("multer");
const path = require("path");
const AppError = require("../appError/appError");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let videoType = file.fieldname;

    switch (videoType) {
      case "adVideo":
        cb(null, path.join(__dirname, "../videos/ad"));

        break;
      case "blogVideo":
        cb(null, path.join(__dirname, "../videos/blog"));

        break;

      case "FAQVideo":
        cb(null, path.join(__dirname, "../videos/faq"));

        break;
      case "infoBankVideo":
        cb(null, path.join(__dirname, "../videos/info-bank"));

        break;

      default:
        cb(new AppError("WRONG FIELD NAME", 400), false);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new AppError("FILE IS NOT AN VIDEO", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 100000000,
  },
});

exports.uploadAdVideo = upload.single("adVideo");
//edit
exports.uploadBlogVideo = upload.single("blogVideo");
exports.uploadFAQVideo = upload.single("FAQVideo");
exports.uploadInfoBankVideo = upload.single("infoBankVideo");
