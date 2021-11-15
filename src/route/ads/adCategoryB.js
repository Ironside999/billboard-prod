const AdsBlvlCategory = require('../../model/ads/adCategoryB');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const createNewRecord = require('../../util/createNewRecord');
const findByIdAndCheckExistence = require('../../util/findById');
const checkExistenceAndRemove = require('../../util/removeById');
const simpleFilter = require('../../apiFeatures/simpleFilter');
const AdsAlvlCategory = require('../../model/ads/adCategoryA');
const { Sequelize } = require('../../db/db');

const router = new express.Router();

router.post(
  '/api/ad-category-b/add',
  catchAsync(async (req, res, next) => {
    const adCategoryB = await createNewRecord(AdsBlvlCategory, {
      ...req.body,
    });

    res.status(201).send(adCategoryB);
  })
);

router.patch(
  '/api/ad-category-b/update/:id',
  catchAsync(async (req, res, next) => {
    const adCategoryB = await findByIdAndCheckExistence(
      AdsBlvlCategory,
      req.params.id
    );

    let body = { adCategoryB: req.body.adCategoryB };

    await adCategoryB.update(body);

    res.status(200).send();
  })
);

router.delete(
  '/api/ad-category-b/delete/:id',
  catchAsync(async (req, res, next) => {
    const adCategoryB = await checkExistenceAndRemove(
      AdsBlvlCategory,
      req.params.id
    );

    res.send();
  })
);

router.get(
  '/api/ad-category-b/:id',
  catchAsync(async (req, res, next) => {
    const adCategoryB = await findByIdAndCheckExistence(
      AdsBlvlCategory,
      req.params.id
    );

    res.send(adCategoryB);
  })
);

router.get(
  '/api/ad-categories/b',
  catchAsync(async (req, res, next) => {
    const where = simpleFilter(req.query);

    const adCategoriesB = await AdsBlvlCategory.findAll({
      where,
    });

    res.send(adCategoriesB);
  })
);

router.get(
  '/api/ad-categories/b/a',
  catchAsync(async (req, res, next) => {
    const adCategoriesB = await AdsBlvlCategory.findAll({
      attributes: [
        'id',
        'adCategoryB',
        'frkCatA',
        [Sequelize.col('AdsAlvlCategory.adCategoryA'), 'adCategoryA'],
        [Sequelize.col('AdsAlvlCategory.catType'), 'catType'],
      ],
      include: {
        model: AdsAlvlCategory,
        attributes: [],
      },
      raw: true,
    });

    res.send(adCategoriesB);
  })
);

module.exports = router;
