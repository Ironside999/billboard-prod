const SpecificCategory = require("../../model/ads/specificCategory");
const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const createNewRecord = require("../../util/createNewRecord");
const findByIdAndCheckExistence = require("../../util/findById");
const checkExistenceAndRemove = require("../../util/removeById");
const simpleFilter = require("../../apiFeatures/simpleFilter");

const router = new express.Router();

router.post(
  "/api/specific-category/add",
  catchAsync(async (req, res, next) => {
    const specificCategory = await createNewRecord(SpecificCategory, {
      specificCategory: req.body.specificCategory,
      frkCatC: req.body.frkCatC,
    });

    res.status(201).send(specificCategory);
  })
);

router.delete(
  "/api/specific-category/delete/:id",
  catchAsync(async (req, res, next) => {
    const specificCategory = await checkExistenceAndRemove(
      SpecificCategory,
      req.params.id
    );

    res.send();
  })
);

router.get(
  "/api/specific-category/:id",
  catchAsync(async (req, res, next) => {
    const specificCategory = await findByIdAndCheckExistence(
      SpecificCategory,
      req.params.id
    );

    res.send(specificCategory);
  })
);

router.get(
  "/api/specific/categories",
  catchAsync(async (req, res, next) => {
    const where = simpleFilter(req.query);

    const specificCategories = await SpecificCategory.findAll({
      where,
    });

    res.send(specificCategories);
  })
);

module.exports = router;
