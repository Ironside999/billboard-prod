const AdStatus = require("../../model/ads/adStatus");
const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const createNewRecord = require("../../util/createNewRecord");
const findByIdAndCheckExistence = require("../../util/findById");
const checkExistenceAndRemove = require("../../util/removeById");

const router = new express.Router();

router.post(
  "/api/ad/status/add",
  catchAsync(async (req, res, next) => {
    const adStatus = await createNewRecord(AdStatus, {
      adStatus: req.body.adStatus,
      frkAdStsCat: req.body.frkAdStsCat,
    });

    res.status(201).send(adStatus);
  })
);

router.delete(
  "/api/ad/status/delete/:id",
  catchAsync(async (req, res, next) => {
    const adStatus = await checkExistenceAndRemove(AdStatus, req.params.id);

    res.send();
  })
);

router.get(
  "/api/ad/status/:id",
  catchAsync(async (req, res, next) => {
    const adStatus = await findByIdAndCheckExistence(AdStatus, req.params.id);

    res.send(adStatus);
  })
);

router.get(
  "/api/ad/statuses",
  catchAsync(async (req, res, next) => {
    const adStatuses = await AdStatus.findAll();

    res.send(adStatuses);
  })
);

router.get(
  "/api/ad/statuses/by/category/:id",
  catchAsync(async (req, res, next) => {
    const adStatuses = await AdStatus.findAll({
      where: {
        frkAdStsCat: req.params.id,
      },
    });

    res.send(adStatuses);
  })
);

module.exports = router;
