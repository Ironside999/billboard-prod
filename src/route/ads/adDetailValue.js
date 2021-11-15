const AdDetailValue = require('../../model/ads/adDetailValue');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const createNewRecord = require('../../util/createNewRecord');
const findByIdAndCheckExistence = require('../../util/findById');
const checkExistenceAndRemove = require('../../util/removeById');

const router = new express.Router();

router.post(
  '/api/ad-detail/value/add',
  catchAsync(async (req, res, next) => {
    const adDetailValue = await createNewRecord(AdDetailValue, {
      detailValue: req.body.detailValue,
      frkAdDetail: req.body.frkAdDetail,
    });

    res.status(201).send(adDetailValue);
  })
);

router.delete(
  '/api/ad-detail/value/delete/:id',
  catchAsync(async (req, res, next) => {
    const adDetailValue = await checkExistenceAndRemove(
      AdDetailValue,
      req.params.id
    );

    res.send();
  })
);

router.get(
  '/api/ad-detail/value/:id',
  catchAsync(async (req, res, next) => {
    const adDetailValue = await findByIdAndCheckExistence(
      AdDetailValue,
      req.params.id
    );

    res.send({ adDetailValue });
  })
);

router.get(
  '/api/ad/detail/values',
  catchAsync(async (req, res, next) => {
    const adDetailValues = await AdDetailValue.findAll();

    res.send(adDetailValues);
  })
);

router.get(
  '/api/ad/detail/values/:id',
  catchAsync(async (req, res, next) => {
    const adDetailValues = await AdDetailValue.findAll({
      where: {
        frkAdDetail: req.params.id,
      },
    });

    res.send(adDetailValues);
  })
);

module.exports = router;
