const multer = require("multer");
const path = require("path");
const AppError = require("../appError/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    let imageName = file.fieldname;

    switch (imageName) {
      case "imageA": {
        req.body[imageName + "Width"] = 400;
        req.body[imageName + "Height"] = 400;
        cb(null, true);

        break;
      }
      case "logoA": {
        req.body[imageName + "Width"] = 100;
        req.body[imageName + "Height"] = 100;

        cb(null, true);

        break;
      }
      case "coverAdImage": {
        req.body[imageName + "Width"] = 400;
        req.body[imageName + "Height"] = 400;

        cb(null, true);

        break;
      }
      case "adImage": {
        req.body[imageName + "Width"] = 250;
        req.body[imageName + "Height"] = 250;

        cb(null, true);

        break;
      }
      case "socialNetwokLogo": {
        req.body[imageName + "Width"] = 100;
        req.body[imageName + "Height"] = 100;

        cb(null, true);

        break;
      }
      default: {
        cb(null, true);
      }
    }
  } else {
    cb(new AppError("FILE IS NOT AN IMAGE", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  // limits: {
  //   fileSize: 1048576,
  // },
});

exports.uploadAvatarImage = upload.single("avatarImage");
exports.uploadBusinessInfoImage = upload.single("businessImage");
exports.uploadAdPackageImage = upload.single("adPackageImage");
exports.uploadAuthorImage = upload.single("authorImage");
exports.uploadBlogImage = upload.single("blogImage");
exports.uploadVirtualBillboardDesign = upload.single("virtualBillboardDesign");
exports.uploadVirtualBbdCover = upload.single("virtualBbdCover");
exports.uploadAvatarEmoji = upload.single("emoji");
exports.uploadAdCatLvlA = upload.fields([
  { name: "imageA", maxCount: 1 },
  { name: "logoA", maxCount: 1 },
]);
exports.uploadAdImages = upload.fields([
  { name: "coverAdImage", maxCount: 1 },
  { name: "adImage", maxCount: 9 },
]);
exports.uploadAdImg = upload.single("coverAdImage");
exports.uploadMultipleFields = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "image", maxCount: 9 },
]);
exports.uploadSocialNetworkLogo = upload.single("socialNetwokLogo");
