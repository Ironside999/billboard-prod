const AdsAlvlCategory = require('../../model/ads/adCategoryA');
const AdsBlvlCategory = require('./../../model/ads/adCategoryB');
const AdsClvlCategory = require('./../../model/ads/adCategoryC');
const SpecificCategory = require('./../../model/ads/specificCategory');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const createNewRecord = require('../../util/createNewRecord');
const findByIdAndCheckExistence = require('../../util/findById');
const checkExistenceAndRemove = require('../../util/removeById');
const { Op } = require('sequelize');

const router = new express.Router();

router.post(
  '/api/ad-category-a/add',
  catchAsync(async (req, res, next) => {
    const adCategoryA = await createNewRecord(AdsAlvlCategory, {
      ...req.body,
    });

    res.status(201).send(adCategoryA);
  })
);

router.patch(
  '/api/ad-category-a/update/:id',
  catchAsync(async (req, res, next) => {
    const adCategoryA = await findByIdAndCheckExistence(
      AdsAlvlCategory,
      req.params.id
    );

    let body = { ...req.body };

    await adCategoryA.update(body);

    res.status(200).send();
  })
);

router.delete(
  '/api/ad-category-a/delete/:id',
  catchAsync(async (req, res, next) => {
    const adCategoryA = await checkExistenceAndRemove(
      AdsAlvlCategory,
      req.params.id
    );

    res.send();
  })
);

router.get(
  '/api/ad-category-a/:id',
  catchAsync(async (req, res, next) => {
    const adCategoryA = await findByIdAndCheckExistence(
      AdsAlvlCategory,
      req.params.id
    );

    res.send(adCategoryA);
  })
);

router.get(
  '/api/ad-categories/a',
  catchAsync(async (req, res, next) => {
    const adCategoriesA = await AdsAlvlCategory.findAll();

    res.send(adCategoriesA);
  })
);

router.get(
  '/api/all/categories',
  catchAsync(async (req, res, next) => {
    const adCategoriesA = await AdsAlvlCategory.findAll({
      where: {
        catType: {
          [Op.or]: [0, 1]
        }
      },
      include: {
        model: AdsBlvlCategory,
        include: {
          model: AdsClvlCategory,
          include: {
            model: SpecificCategory,
          },
        },
      },
    });

    res.send(adCategoriesA);
  })
);

module.exports = router;
