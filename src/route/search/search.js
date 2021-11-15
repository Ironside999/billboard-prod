const Ad = require('../../model/ads/ad');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const { Op } = require('sequelize');

const router = new express.Router();

router.get(
  '/api/search/all',
  catchAsync(async (req, res, next) => {
    const ads = await Ad.findAll({
      where: {
        title: {
          [Op.like]:
            req.query.search && typeof req.query.search == 'string'
              ? req.query.search + '%'
              : null,
        },
      },
      attributes: ['id', 'title', 'adType', 'order'],
      order: [
        ['adType', 'DESC'],
        ['order', 'DESC'],
      ],
    });

    // const infoBanks = await informationBank.findAll({
    //   where: {
    //     title: {
    //       [Op.like]:
    //         req.query.search && typeof req.query.search == 'string'
    //           ? req.query.search + '%'
    //           : null,
    //     },
    //   },
    //   attributes: ['id', 'title', 'image', 'infoType', 'order'],
    //   order: [
    //     ['infoType', 'DESC'],
    //     ['order', 'DESC'],
    //   ],
    // });

    res.send({ ads, info:'infoBanks' });
  })
);

module.exports = router;
