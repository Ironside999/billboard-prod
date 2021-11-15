const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');
const MapCategury = require('../../model/map/mapCategory');
const AppError = require('./../../appError/appError');

const router = express.Router();

router.post(
  '/api/map/mapCategury',
  userAuth,
  catchAsync(async (req, res, next) => {
    const mapCategury = await MapCategury.create(req.body);

    res.status(201).send(mapCategury);
  })
);

router.get(
  '/api/map/getMapCategury',
  catchAsync(async (req, res, next) => {
    const mapCategury = await MapCategury.findByPk(req.params.id);

    if (!mapCategury) {
      return next(new AppError('mapCategury not found', 404));
    }

    res.status(200).send(mapCategury);
  })
);

router.get(
  '/api/map/getAllMapCategury',
  catchAsync(async (req, res, next) => {
    const mapCategories = await MapCategury.findAll();

    if (!mapCategories) {
      return next(new AppError('mapCategories not found', 404));
    }

    res.status(200).send(mapCategories);
  })
);

router.patch(
  '/api/map/updateMapCategury',
  userAuth,
  catchAsync(async (req, res, next) => {
    const mapCategury = await MapCategury.update(req.params.id, req.body);

    if (!mapCategury) {
      return next(new AppError('mapCategury not found', 404));
    }

    res.status(200).send(mapCategury);
  })
);

router.delete(
  '/api/map/updateMapCategury',
  userAuth,
  catchAsync(async (req, res, next) => {
    const mapCategury = await MapCategury.destroy(req.params.id);

    if (!mapCategury) {
      return next(new AppError('mapCategury not found', 404));
    }

    res.status(204).send();
  })
);

module.exports = router;
