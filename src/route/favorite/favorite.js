const express = require('express');
const AppError = require('../../appError/appError');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');
const Ad = require('../../model/ads/ad');
const Favorite = require('../../model/favorite/favorite');
const createNewRecord = require('../../util/createNewRecord');

const router = new express.Router();

router.post(
  '/api/user/favorite/add',
  userAuth,
  catchAsync(async (req, res, next) => {
    const myFav = await createNewRecord(Favorite, {
      frkUser: req.user.id,
      frkAd: req.body.frkAd,
    });

    res.status(201).send();
  })
);

router.delete(
  '/api/user/favorite/delete/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const myFav = await Favorite.destroy({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!myFav)
      return next(new AppError('NOT FOUND SUCH FAV FOR THIS USER', 404));

    res.send();
  })
);

router.get(
  '/api/user/all/favorites',
  userAuth,
  catchAsync(async (req, res, next) => {
    const favorites = await Favorite.findAll({
      where: {
        frkUser: req.user.id,
      },
      include: {
        model: Ad,
      },
    });

    res.send(favorites);
  })
);

router.get(
  '/api/favorite/by/user/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const favorite = await Favorite.findOne({
      where: {
        frkAd: req.params.id,
        frkUser: req.user.id,
      },
    });
    res.status(200).send({ favorite });
  })
);

module.exports = router;
