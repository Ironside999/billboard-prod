const express = require("express");
const Area = require("../../model/CPC/area");
const City = require("../../model/CPC/city");
const AppError = require("../../appError/appError");
const catchAsync = require("../../appError/catchAsync");
const findByIdAndCheckExistence = require("../../util/findById");

const router = new express.Router();
router.post(
  "/api/area/add",
  catchAsync(async (req, res, next) => {
    const country = await findByIdAndCheckExistence(
      City,
      req.body.city,
      "COUNTRY ID NOT FOUND"
    );

    let body = req.body;
    let result = await Area.create({
      area: body.area,
      frkCity: body.city,
    });

    res.status(201).send(result);
  })
);
router.delete(
  "/api/area/delete/:id",
  catchAsync(async (req, res, next) => {
    let params = req.params;
    let result = await Area.destroy({
      where: {
        id: params.id,
      },
    });
    if (!result) return next(new AppError("NOT FOUND", 404));
    res.send();
  })
);
router.get(
  "/api/area/get/:id",
  catchAsync(async (req, res, next) => {
    let params = req.params;
    let result = await Area.findByPk(params.id);
    if (!result) return next(new AppError("NOT FOUND", 404));
    res.send(result);
  })
);
router.get(
  "/api/area/getall",
  catchAsync(async (req, res, next) => {
    let result = await Area.findAll();
    res.send(result);
  })
);

module.exports = router;
