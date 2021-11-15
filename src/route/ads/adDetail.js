const AdDetail = require('../../model/ads/adDetail');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const createNewRecord = require('../../util/createNewRecord');
const findByIdAndCheckExistence = require('../../util/findById');
const checkExistenceAndRemove = require('../../util/removeById');
const simpleFilter = require('../../apiFeatures/simpleFilter');
const AdDetailValue = require('../../model/ads/adDetailValue');
const SpecificCategory = require('../../model/ads/specificCategory');
const AdsClvlCategory = require('../../model/ads/adCategoryC');
const AdsBlvlCategory = require('../../model/ads/adCategoryB');
const AdsAlvlCategory = require('../../model/ads/adCategoryA');
const { Sequelize } = require('../../db/db');

const router = new express.Router();

router.post(
  '/api/ad-detail/add',
  catchAsync(async (req, res, next) => {
    const adDetail = await createNewRecord(AdDetail, {
      detail: req.body.detail,
      frkSpecificCat: req.body.frkSpecificCat,
    });

    res.status(201).send(adDetail);
  })
);

router.delete(
  '/api/ad-detail/delete/:id',
  catchAsync(async (req, res, next) => {
    const adDetail = await checkExistenceAndRemove(AdDetail, req.params.id);

    res.send();
  })
);

router.get(
  '/api/ad-detail/:id',
  catchAsync(async (req, res, next) => {
    const adDetail = await findByIdAndCheckExistence(AdDetail, req.params.id);

    const adDetailValue = await AdDetail.getAdDetailValues();

    res.send({ adDetail, adDetailValue });
  })
);

router.get(
  '/api/ad/details',
  catchAsync(async (req, res, next) => {
    const where = simpleFilter(req.query);

    const adDetails = await AdDetail.findAll({
      where,
      include: {
        model: AdDetailValue,
      },
    });

    res.send(adDetails);
  })
);

router.get(
  '/api/ad/details/from/specific/:id',
  catchAsync(async (req, res, next) => {
    const adDetails = await AdDetail.findAll({
      where: {
        frkSpecificCat: req.params.id,
      },
    });

    res.send(adDetails);
  })
);

router.get(
  '/api/ad/details/all',
  catchAsync(async (req, res, next) => {
    const adDetails = await AdDetail.findAll({
      attributes: [
        'id',
        'detail',
        'frkSpecificCat',
        [
          Sequelize.col('SpecificCategory.specificCategory'),
          'specificCategory',
        ],
        [Sequelize.col('SpecificCategory.frkCatC'), 'frkCatC'],
        [
          Sequelize.col('SpecificCategory.AdsClvlCategory.adCategoryC'),
          'adCategoryC',
        ],
        [Sequelize.col('SpecificCategory.AdsClvlCategory.frkCatB'), 'frkCatB'],
        [
          Sequelize.col(
            'SpecificCategory.AdsClvlCategory.AdsBlvlCategory.adCategoryB'
          ),
          'adCategoryB',
        ],
        [
          Sequelize.col(
            'SpecificCategory.AdsClvlCategory.AdsBlvlCategory.frkCatA'
          ),
          'frkCatA',
        ],
        [
          Sequelize.col(
            'SpecificCategory.AdsClvlCategory.AdsBlvlCategory.AdsAlvlCategory.adCategoryA'
          ),
          'adCategoryA',
        ],
      ],
      include: {
        model: SpecificCategory,
        attributes: [],
        include: {
          model: AdsClvlCategory,
          attributes: [],
          include: {
            model: AdsBlvlCategory,
            attributes: [],
            include: {
              model: AdsAlvlCategory,
              attributes: [],
            },
          },
        },
      },
      raw: true,
    });

    res.send(adDetails);
  })
);

module.exports = router;
