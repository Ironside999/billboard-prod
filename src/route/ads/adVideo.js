const fs = require('fs');
const path = require('path');
const AdVideo = require('../../model/ads/adVideo');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const createNewRecord = require('../../util/createNewRecord');
const findByIdAndCheckExistence = require('../../util/findById');
const checkExistenceAndRemove = require('../../util/removeById');
const { uploadAdVideo } = require('../../middleware/multerVideo');
const AppError = require('../../appError/appError');
const userAuth = require('../../middleware/userAuth');
const Ad = require('../../model/ads/ad');

const router = new express.Router();

router.post(
  '/api/ad/set/video/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const checkAd = await Ad.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!checkAd) return next(new AppError('Ad Not Found', 404));

    const checkVideo = await AdVideo.findOne({
      where: {
        frkAd: checkAd.id,
      },
    });

    if (checkVideo) {
      await checkVideo.update({ path: req.body.path });
      return res.send({});
    }

    const adVideo = await createNewRecord(AdVideo, {
      path: req.body.path,
      frkAd: checkAd.id,
    });

    res.send({});
  })
);

router.delete(
  '/api/ad/drop/video/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const checkAd = await Ad.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!checkAd) return next(new AppError('Ad Not Found', 404));

    const checkVideo = await AdVideo.destroy({
      where: {
        frkAd: checkAd.id,
      },
    });

    res.send();
  })
);

router.post(
  '/api/ad/video/add',
  userAuth,
  catchAsync(async (req, res, next) => {
    const checkUser = await Ad.findOne({
      where: {
        frkUser: req.user.id,
        id: req.body.frkAd,
      },
    });

    if (!checkUser) return next(new AppError('Ad Not Found', 404));

    const adVideo = await createNewRecord(AdVideo, {
      path: req.file.filename,
      frkAd: req.body.frkAd,
    });

    res.status(201).send(adVideo);
  })
);

router.delete(
  '/api/ad/video/delete/:id',
  catchAsync(async (req, res, next) => {
    const adVideo = await checkExistenceAndRemove(AdVideo, req.params.id);

    res.send();
  })
);

router.get(
  '/api/ad/video/:id',
  catchAsync(async (req, res, next) => {
    const adVideo = await findByIdAndCheckExistence(AdVideo, req.params.id);

    fs.stat(
      path.join(__dirname, '../../videos/ad/', adVideo.path),
      (err, stats) => {
        if (err) {
          return next(new AppError('FILE IS NOT DETECTED'));
        }
        let range = req.headers.range;
        if (!range) {
          return res.status(416).send();
        }
        let chunksize = 10 ** 6;
        let start = Number(range.replace(/\D/g, ''));
        let total = stats.size;
        let end = Math.min(start + chunksize, total - 1);
        let contentLength = end - start + 1;
        res.writeHead(206, {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
          'Accept-Ranges': 'bytes',
          'Content-Length': contentLength,
          'Content-Type': 'video/mp4',
        });
        let stream = fs
          .createReadStream(
            path.join(__dirname, '../../videos/ad/', adVideo.path),
            { start, end }
          )
          .on('open', function () {
            stream.pipe(res);
          })
          .on('error', function (err) {
            res.end(err);
          });
      }
    );
  })
);

router.get(
  '/api/video/of/ad/:id',
  catchAsync(async (req, res, next) => {
    const adVideo = await AdVideo.findOne({
      where: {
        frkAd: req.params.id,
      },
    });

    if (!adVideo) return next(new AppError('Video not found', 404));

    fs.stat(
      path.join(__dirname, '../../videos/ad/', adVideo.path),
      (err, stats) => {
        if (err) {
          return next(new AppError('FILE IS NOT DETECTED'));
        }
        let range = req.headers.range;
        if (!range) {
          return res.status(416).send();
        }
        let chunksize = 10 ** 6;
        let start = Number(range.replace(/\D/g, ''));
        let total = stats.size;
        let end = Math.min(start + chunksize, total - 1);
        let contentLength = end - start + 1;
        res.writeHead(206, {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
          'Accept-Ranges': 'bytes',
          'Content-Length': contentLength,
          'Content-Type': 'video/mp4',
        });
        let stream = fs
          .createReadStream(
            path.join(__dirname, '../../videos/ad/', adVideo.path),
            { start, end }
          )
          .on('open', function () {
            stream.pipe(res);
          })
          .on('error', function (err) {
            res.end(err);
          });
      }
    );
  })
);

module.exports = router;
