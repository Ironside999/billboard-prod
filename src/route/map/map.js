const express = require('express');
const axios = require('axios');
const { Op } = require('sequelize');
const Map = require('./../../model/map/map');
const catchAsync = require('../../appError/catchAsync');
const MapCategury = require('../../model/map/mapCategory');
const userAuth = require('../../middleware/userAuth');
const AppError = require('../../appError/appError');

const router = express.Router();

router.post(
  '/api/map/destinations',
  userAuth,
  catchAsync(async (req, res, next) => {
    const map = await Map.create(req.body);

    res.status(201).send(map);
  })
);

router.get(
  '/api/map/origin',
  catchAsync(async (req, res, next) => {
 

    
    let latFront = req.query.lat;
    let lngFront = req.query.lng;

    if (!req.query.lat || !req.query.lng) {
      return next(new AppError('مختصات مورد نظر برای ما ارسال نشده است', 404))
    }

    const maps = await Map.findAll({
      where: {
        [Op.and]: [


          {
            lat: {
              [Op.between]: [+latFront - 0.5, +latFront + 0.5],
            },
          },


          {
            lng: {
              [Op.between]: [+lngFront - 0.5, +lngFront + 0.5],
            },
          }


        ],
      },
      order: [
        ['lng', 'DESC'],
        ['lng', 'DESC'],
    ],
      include: {
        model: MapCategury,
      },
      offset: 0,
      limit: 5,
    });

    let array = [];
    maps.forEach((item) => {
      array.push(item.lat + ',' + item.lng);

      return array;
    });
    let newString = array.join('|');

    let config = {
      method: 'get',
      url: `https://api.neshan.org/v1/distance-matrix?origins=${latFront},${lngFront}&destinations=${newString}`,
      headers: {
        'Api-Key': process.env.NESHAN_API_KEY,
      },
    };


    const { data } = await axios(config);

    let results = maps.map((item, index) => {
      return {
        title: item.MapCategury.title,
        image: item.MapCategury.image,
        description: item.description,
        lat: item.lat,
        lng: item.lng,
        duration: data.rows[0].elements[index].duration.text,
        distance: data.rows[0].elements[index].distance.text,
      };
    });
    res.send(results);
  })
);

module.exports = router;
