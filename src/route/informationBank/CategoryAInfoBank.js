const AdsAlvlCategory = require('../../model/ads/adCategoryA');
const AdsBlvlCategory = require('../../model/ads/adCategoryB');
const AdsClvlCategory = require('../../model/ads/adCategoryC');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const { Op } = require('sequelize');


const router = new express.Router();

router.get('/api/infoBank/categoryA/all',
    catchAsync(async (req, res, next) => {
        const categoryA = await AdsAlvlCategory.findAll({
            include: {
                    model: AdsBlvlCategory,
                    where: {catType: 1},
                    required: false,
                    include: {
                        model: AdsClvlCategory,
                        where: {catType: 1},
                        required: false,
                    }
                },
        })
        res.status(200).send({categoryA})
    })
);

router.get(
    '/api/infoBank/all/categories',
    catchAsync(async (req, res, next) => {
      const categoryA = await AdsAlvlCategory.findAll({
        where: {
          catType: {
            [Op.or]: [0, 2]
          }
        },
        include: {
          model: AdsBlvlCategory,
          include: {
            model: AdsClvlCategory,
          },
        },
      });
  
      res.send({categoryA});
    })
  );

module.exports = router;
