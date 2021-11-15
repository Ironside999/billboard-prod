const express = require('express');
const Country = require('../../model/CPC/country');
const Province = require('../../model/CPC/province');
const City = require('../../model/CPC/city');
const AppError = require('../../appError/appError');
const catchAsync = require('../../appError/catchAsync');
const findByIdAndCheckExistence = require('../../util/findById');
const Area = require('../../model/CPC/area');

const router = new express.Router();
router.post(
  '/api/province/add',
  catchAsync(async (req, res, next) => {
    let body = req.body;
    let result = await Province.create({
      province: body.province,
      frkCountry: body.country,
    });

    res.status(201).send(result);
  })
);
router.delete(
  '/api/province/delete/:id',
  catchAsync(async (req, res, next) => {
    let params = req.params;
    let result = await Province.destroy({
      where: {
        id: params.id,
      },
    });
    if (!result) return next(new AppError('NOT FOUND', 404));
    res.send();
  })
);
router.get(
  '/api/province/get/:id',
  catchAsync(async (req, res, next) => {
    let params = req.params;
    let result = await Province.findByPk(params.id, {
      include: {
        model: City,
      },
    });
    if (!result) return next(new AppError('NOT FOUND', 404));
    res.send(result);
  })
);
router.get(
  '/api/province/getall',
  catchAsync(async (req, res, next) => {
    let result = await Province.findAll();
    res.send(result);
  })
);

router.get(
  '/api/location/all',
  catchAsync(async (req, res, next) => {
    let result = await Province.findAll({
      include: {
        model: City,
        include: {
          model: Area,
        },
      },
    });
    res.send(result);
  })
);

module.exports = router;
