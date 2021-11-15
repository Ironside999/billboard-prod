const fs = require("fs");
const path = require("path");
const InfoBankVideo = require("../../model/informationBank/informationBankVideo");
const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const createNewRecord = require("../../util/createNewRecord");
const findByIdAndCheckExistence = require("../../util/findById");
const checkExistenceAndRemove = require("../../util/removeById");
const { uploadInfoBankVideo } = require("../../middleware/multerVideo");
const AppError = require("../../appError/appError");
const InformationBank = require("../../model/informationBank/informationBank");
const userAuth = require("../../middleware/userAuth");

const router = new express.Router();

router.post(
  "/api/info/bank/video/add",
  userAuth,
  catchAsync(async (req, res, next) => {
    const checkUser = await InformationBank.findOne({
      where: {
        frkUser: req.user.id,
        id: req.body.frkInfoBank,
      },
    });

    if (!checkUser)
      return next(new AppError("Information Bank Not Found", 404));

    const infoBankVideo = await createNewRecord(InfoBankVideo, {
      path: req.file.filename,
      frkInfoBank: req.body.frkInfoBank,
    });

    res.status(201).send();
  })
);

router.delete(
  "/api/info/bank/video/delete/:id",
  catchAsync(async (req, res, next) => {
    const infoBankVideo = await checkExistenceAndRemove(
      InfoBankVideo,
      req.params.id
    );

    res.send();
  })
);

router.get(
  "/api/ad/video/:id",
  catchAsync(async (req, res, next) => {
    const infoBankVideo = await findByIdAndCheckExistence(
      InfoBankVideo,
      req.params.id
    );

    fs.stat(
      path.join(__dirname, "../../videos/info-bank/", infoBankVideo.path),
      (err, stats) => {
        if (err) {
          return next(new AppError("FILE IS NOT DETECTED"));
        }
        let range = req.headers.range;
        if (!range) {
          return res.status(416).send();
        }
        let chunksize = 10 ** 6;
        let start = Number(range.replace(/\D/g, ""));
        let total = stats.size;
        let end = Math.min(start + chunksize, total - 1);
        let contentLength = end - start + 1;
        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
        });
        let stream = fs
          .createReadStream(
            path.join(__dirname, "../../videos/info-bank/", infoBankVideo.path),
            { start, end }
          )
          .on("open", function () {
            stream.pipe(res);
          })
          .on("error", function (err) {
            res.end(err);
          });
      }
    );
  })
);

router.get(
  "/api/video/of/info/bank/:id",
  catchAsync(async (req, res, next) => {
    const infoBankVideo = await InfoBankVideo.findOne({
      where: {
        frkInfoBank: req.params.id,
      },
    });

    if (!infoBankVideo) return next(new AppError("Video not found", 404));

    fs.stat(
      path.join(__dirname, "../../videos/info-bank/", infoBankVideo.path),
      (err, stats) => {
        if (err) {
          return next(new AppError("FILE IS NOT DETECTED"));
        }
        let range = req.headers.range;
        if (!range) {
          return res.status(416).send();
        }
        let chunksize = 10 ** 6;
        let start = Number(range.replace(/\D/g, ""));
        let total = stats.size;
        let end = Math.min(start + chunksize, total - 1);
        let contentLength = end - start + 1;
        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
        });
        let stream = fs
          .createReadStream(
            path.join(__dirname, "../../videos/info-bank/", infoBankVideo.path),
            { start, end }
          )
          .on("open", function () {
            stream.pipe(res);
          })
          .on("error", function (err) {
            res.end(err);
          });
      }
    );
  })
);

module.exports = router;
