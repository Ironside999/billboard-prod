const express = require('express');
const City = require('../../model/CPC/city');
const Province = require('../../model/CPC/province');
const AppError = require('../../appError/appError');
const catchAsync = require('../../appError/catchAsync');
const findByIdAndCheckExistence = require('../../util/findById');
const Area = require('../../model/CPC/area');
const Ad = require('../../model/ads/ad');
const { Sequelize } = require('../../db/db');

const router = new express.Router();

router.post(
  '/api/city/add',
  catchAsync(async (req, res, next) => {
    let body = req.body;
    let result = await City.create({
      city: body.city,
      frkProvince: body.province,
      lat: body.lat,
      lng: body.lng,
    });
    res.status(201).send(result);
  })
);
router.delete(
  '/api/city/delete/:id',
  catchAsync(async (req, res, next) => {
    let params = req.params;
    let result = await City.destroy({
      where: {
        id: params.id,
      },
    });
    if (!result) return next(new AppError('NOT FOUND', 404));
    res.send();
  })
);
router.get(
  '/api/city/get/:id',
  catchAsync(async (req, res, next) => {
    let params = req.params;
    let result = await City.findOne({
      where: {
        id: params.id,
      },
      include: {
        model: Area,
      },
    });
    if (!result) return next(new AppError('NOT FOUND', 404));
    res.send(result);
  })
);
router.get(
  '/api/city/getall',
  catchAsync(async (req, res, next) => {
    let result = await City.findAll();
    res.send(result);
  })
);

router.patch(
  '/api/city/test/:id',
  catchAsync(async (req, res, next) => {
    const city = await City.update(
      { createdAt: Date.now() },
      {
        where: {
          id: ['76', '2', '3'],
        },
      }
    );

    console.log(city[0]);

    res.send(city);
  })
);

router.get(
  '/api/popular/cities',
  catchAsync(async (req, res, next) => {
    let result = await City.findAll({
      include: {
        model: Ad,
        attributes: [],
      },
      attributes: ['id'],
      group: 'id',
      order: [[Sequelize.fn('COUNT', Sequelize.col('frkCity')), 'DESC']],
    });

    const mostPopular = result.slice(0, 6);
    res.send(mostPopular);
  })
);

module.exports = router;
