const express = require("express");
const Country = require("../../model/CPC/country");
const Province = require("../../model/CPC/province");
const AppError = require("../../appError/appError");
const catchAsync = require("../../appError/catchAsync");

const router = new express.Router();

router.post(
  "/api/country/add",
  catchAsync(async (req, res, next) => {
    let body = req.body;

    let result = await Country.create({
      country: body.country,
    });
    res.status(201).send(result);
  })
);
router.delete(
  "/api/country/delete/:id",
  catchAsync(async (req, res, next) => {
    let params = req.params;
    let result = await Country.destroy({
      where: {
        id: params.id,
      },
    });
    if (!result) return next(new AppError("NOT FOUND", 404));
    res.send();
  })
);
router.get(
  "/api/country/get/:id",
  catchAsync(async (req, res, next) => {
    let params = req.params;
    let result = await Country.findOne({
      where: {
        id: params.id,
      },
      include: {
        model: Province,
      },
    });
    if (!result) return next(new AppError("NOT FOUND", 404));
    res.send(result);
  })
);
router.get(
  "/api/country/getall",
  catchAsync(async (req, res, next) => {
    let result = await Country.findAll();
    res.send(result);
  })
);

module.exports = router;
