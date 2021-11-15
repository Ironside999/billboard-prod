const AdsClvlCategory = require('../../model/ads/adCategoryC');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const createNewRecord = require('../../util/createNewRecord');
const findByIdAndCheckExistence = require('../../util/findById');
const checkExistenceAndRemove = require('../../util/removeById');
const simpleFilter = require('../../apiFeatures/simpleFilter');
const AdsBlvlCategory = require('../../model/ads/adCategoryB');
const AdsAlvlCategory = require('../../model/ads/adCategoryA');
const { Sequelize } = require('../../db/db');

const router = new express.Router();

router.post(
  '/api/ad-category-c/add',
  catchAsync(async (req, res, next) => {
    const adCategoryC = await createNewRecord(AdsClvlCategory, {
      ...req.body,
    });

    res.status(201).send(adCategoryC);
  })
);

router.patch(
  '/api/ad-category-c/update/:id',
  catchAsync(async (req, res, next) => {
    const adCategoryC = await findByIdAndCheckExistence(
      AdsClvlCategory,
      req.params.id
    );

    let body = { ...req.body };

    await adCategoryC.update(body);

    res.status(200).send();
  })
);

router.delete(
  '/api/ad-category-c/delete/:id',
  catchAsync(async (req, res, next) => {
    const adCategoryC = await checkExistenceAndRemove(
      AdsClvlCategory,
      req.params.id
    );

    res.send();
  })
);

router.get(
  '/api/ad-category-c/:id',
  catchAsync(async (req, res, next) => {
    const adCategoryC = await findByIdAndCheckExistence(
      AdsClvlCategory,
      req.params.id
    );

    res.send(adCategoryC);
  })
);

router.get(
  '/api/ad-categories/c',
  catchAsync(async (req, res, next) => {
    const where = simpleFilter(req.query);

    const adCategoriesC = await AdsClvlCategory.findAll({
      where,
    });

    res.send(adCategoriesC);
  })
);

router.get(
  '/api/ad-categories/c/b/a',
  catchAsync(async (req, res, next) => {
    const adCategoriesC = await AdsClvlCategory.findAll({
      attributes: [
        'id',
        'adCategoryC',
        'frkCatB',
        'price',
        'exchange',
        [Sequelize.col('AdsBlvlCategory.adCategoryB'), 'adCategoryB'],
        [Sequelize.col('AdsBlvlCategory.frkCatA'), 'frkCatA'],
        [
          Sequelize.col('AdsBlvlCategory.AdsAlvlCategory.adCategoryA'),
          'adCategoryA',
        ],
        [Sequelize.col('AdsBlvlCategory.AdsAlvlCategory.catType'), 'catType'],
      ],
      include: {
        model: AdsBlvlCategory,
        attributes: [],
        include: {
          model: AdsAlvlCategory,
          attributes: [],
        },
      },
      raw: true,
    });

    res.send(adCategoriesC);
  })
);

module.exports = router;
