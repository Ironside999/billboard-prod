const { Op } = require('sequelize');
const Ad = require('../../model/ads/ad');
const AdDetail = require('../../model/ads/adDetail');
const AdDetailValue = require('../../model/ads/adDetailValue');
const JuncUserAdPackage = require('../../model/adPackage/juncUserPackage');
const JuncDetailValAd = require('../../model/ads/juncDetailValAd');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');
const AppError = require('../../appError/appError');
const AdsBlvlCategory = require('../../model/ads/adCategoryB');
const AdSpecificCategory = require('../../model/ads/specificCategory');
const Area = require('../../model/CPC/area');
const AdsClvlCategory = require('../../model/ads/adCategoryC');
const AdPackageRecord = require('../../model/adPackage/adPackageRecord');
const AdVideo = require('../../model/ads/adVideo');
const User = require('../../model/user/user');
const findByIdAndCheckExistence = require('../../util/findById');
const AdAPIOptions = require('../../apiFeatures/adApiFeatures');
const AdImage = require('../../model/ads/adImage');
const moment = require('moment');
const Score = require('../../model/score/score');

const router = new express.Router();

router.post(
  '/api/ad/simple/add',
  userAuth,
  catchAsync(async (req, res, next) => {
    const checkB = await AdsBlvlCategory.findOne({
      where: {
        id: req.body.frkCatB,
        frkCatA: req.body.frkCatA,
      },
    });

    if (!checkB) return next(new AppError('B DOES NOT BLONG TO C', 400));

    const checkC = await AdsClvlCategory.findOne({
      where: {
        id: req.body.frkCatC,
        frkCatB: req.body.frkCatB,
      },
    });

    if (!checkC) return next(new AppError('C DOES NOT BLONG TO B', 400));

    if (req.body.frkSpecificCat) {
      const checkS = await AdSpecificCategory.findOne({
        where: {
          id: req.body.frkSpecificCat,
          frkCatC: req.body.frkCatC,
        },
      });

      if (!checkS) return next(new AppError('S DOES NOT BLONG TO C', 400));
    }

    if (req.body.frkArea) {
      const checkA = await Area.findOne({
        where: {
          id: req.body.frkArea,
          frkCity: req.body.frkCity,
        },
      });

      if (!checkA)
        return next(new AppError('AREA DOES NOT BLONG TO CITY', 400));
    }
    let expireDateSimpleAd = moment().add(1, 'M').format();

    const newAd = await Ad.create({
      ...req.body,
      frkUser: req.user.id,
      frkAdPackage: null,
      adType: 0,
      order: Date.now(),
      expireDate: expireDateSimpleAd,
      isApproved: 0,
    });

    try {
      if (
        Array.isArray(req.body.detailValueIdz) &&
        req.body.detailValueIdz.length
      ) {
        let values = req.body.detailValueIdz.map((itm) => {
          return { frkAd: newAd.id, frkAdDetailVal: itm };
        });

        await JuncDetailValAd.bulkCreate(values);
      }

      if (Array.isArray(req.body.arrayImages) && req.body.arrayImages?.length) {
        let images = req.body.arrayImages.map((itm) => {
          return { frkAd: newAd.id, image: itm };
        });

        await AdImage.bulkCreate(images);
      }

      const checkAd = await Ad.count({
        where: { frkUser: req.user.id },
      });

      if (checkAd <= 5) {
        const scoreObj = {
          frkUser: req.user.id,
          score: 1,
          scoreTitle: 5,
          scoreType: 1,
        };
        const addScoreToInviterUser = await Score.newScore(scoreObj);
      }
    } catch (err) {
      await newAd.destroy();

      throw err;
    }

    res.status(201).send({});
  })
);

router.post(
  '/api/ad/vip/add',
  userAuth,
  catchAsync(async (req, res, next) => {
    const userPackage = await JuncUserAdPackage.findOne({
      where: {
        frkUser: req.user.id,
        id: req.body.userPackageId,
        active: 1,
      },
    });

    if (!userPackage)
      return next(new AppError('USER DOES NOT HAVE THIS PACKAGE', 404));

    const checkB = await AdsBlvlCategory.findOne({
      where: {
        id: req.body.frkCatB,
        frkCatA: req.body.frkCatA,
      },
    });

    if (!checkB) return next(new AppError('B DOES NOT BLONG TO C', 400));

    const checkC = await AdsClvlCategory.findOne({
      where: {
        id: req.body.frkCatC,
        frkCatB: req.body.frkCatB,
      },
    });

    if (!checkC) return next(new AppError('C DOES NOT BLONG TO B', 400));

    if (req.body.frkSpecificCat) {
      const checkS = await AdSpecificCategory.findOne({
        where: {
          id: req.body.frkSpecificCat,
          frkCatC: req.body.frkCatC,
        },
      });

      if (!checkS) return next(new AppError('S DOES NOT BLONG TO C', 400));
    }

    if (req.body.frkArea) {
      const checkA = await Area.findOne({
        where: {
          id: req.body.frkArea,
          frkCity: req.body.frkCity,
        },
      });

      if (!checkA)
        return next(new AppError('AREA DOES NOT BLONG TO CITY', 400));
    }

    const package = await userPackage.getAdPackage();

    const adType = +package.priority;

    let expireDateVipAd = moment().add(1, 'M').format();

    const newAd = await Ad.create({
      ...req.body,
      frkUser: req.user.id,
      frkAdPackage: userPackage.id,
      adType,
      order: Date.now(),
      expireDate: expireDateVipAd,
      isApproved: 0,
    });

    try {
      if (
        Array.isArray(req.body.detailValueIdz) &&
        req.body.detailValueIdz.length
      ) {
        let values = req.body.detailValueIdz.map((itm) => {
          return { frkAd: newAd.id, frkAdDetailVal: itm };
        });

        await JuncDetailValAd.bulkCreate(values);
      }

      if (Array.isArray(req.body.arrayImages) && req.body.arrayImages?.length) {
        let images = req.body.arrayImages.map((itm) => {
          return { frkAd: newAd.id, image: itm };
        });

        await AdImage.bulkCreate(images);
      }

      let expireDatePackage = moment()
        .add(++package.duration, 'd')
        .format();

      await userPackage.update({
        active: 2,
        expireDatePackage,
      });
    } catch (err) {
      await newAd.destroy();

      await userPackage.update({
        active: 1,
      });

      throw err;
    }

    res.status(201).send({});
  })
);

router.delete(
  '/api/ad/delete/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const ad = await Ad.destroy({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!ad) return next(new AppError('NOT FOUND SUCH AD', 404));

    res.send({});
  })
);

router.patch(
  '/api/ad/update/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const ad = await Ad.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!ad) return next(new AppError('NOT FOUND SUCH AD', 404));

    if (req.body.frkArea) {
      const checkA = await Area.findOne({
        where: {
          id: req.body.frkArea,
          frkCity: req.body.frkCity,
        },
      });

      if (!checkA)
        return next(new AppError('AREA DOES NOT BLONG TO CITY', 400));
    }

    if (Array.isArray(req.body.idz) && req.body.idz.length) {
      await Promise.all(
        req.body.idz.map(async (itm) => {
          try {
            if (itm.prevVal) {
              if (itm.prevVal == itm.nextVal) return;

              await JuncDetailValAd.update(
                { frkAdDetailVal: itm.nextVal },
                {
                  where: {
                    frkAd: req.params.id,
                    frkAdDetailVal: itm.prevVal,
                  },
                }
              );
            } else {
              await JuncDetailValAd.create({
                frkAd: req.params.id,
                frkAdDetailVal: itm.nextVal,
              });
            }
          } catch (err) {
            throw err;
          }
        })
      );
    }

    const safteyExcluded = [
      'adType',
      'frkUser',
      'frkCatA',
      'frkCatB',
      'frkCatC',
      'frkSpecificCat',
      'frkAdPackage',
      'order',
      'visitCount',
      'frkAdStatus',
      'id',
    ];

    const body = { ...req.body };

    safteyExcluded.forEach((itm) => delete body[itm]);

    const updatedAd = await ad.update(body);

    res.send({});
  })
);

router.patch(
  '/api/ad/set/image/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const ad = await Ad.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!ad) return next(new AppError('NOT FOUND SUCH AD', 404));

    const images = await AdImage.count({
      where: {
        frkAd: ad.id,
      },
    });

    let newImages = [];

    if (Array.isArray(req.body.arrayImages) && req.body.arrayImages?.length) {
      newImages = req.body.arrayImages.map((itm) => {
        return { frkAd: ad.id, image: itm };
      });
    } else {
      return next(new AppError('Not found any image', 404));
    }

    if (+images >= 9 || images + newImages.length > 9) {
      return next(
        new AppError(`You can choose only ${9 - images} images`, 400)
      );
    }

    await AdImage.bulkCreate(newImages);

    res.send({});
  })
);

router.patch(
  '/api/ad/drop/image/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const ad = await Ad.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!ad) return next(new AppError('NOT FOUND SUCH AD', 404));

    if (!Array.isArray(req.body.idz) || !req.body.idz?.length) {
      return next(new AppError('Not found any image', 404));
    }

    await Promise.all(
      req.body.idz.map(async (itm) => {
        try {
          await AdImage.destroy({
            where: {
              frkAd: ad.id,
              id: itm,
            },
          });
        } catch (err) {
          throw err;
        }
      })
    );

    res.send({});
  })
);

router.patch(
  '/api/ad/upgrade/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const userPackage = await JuncUserAdPackage.findOne({
      where: {
        frkUser: req.user.id,
        id: req.body.userPackageId,
        active: 1,
      },
    });

    if (!userPackage)
      return next(new AppError('USER DOES NOT HAVE THIS PACKAGE', 404));

    const ad = await Ad.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!ad) return next(new AppError('NOT FOUND SUCH AD', 404));

    const package = await userPackage.getAdPackage();

    const adType = +package.priority;

    const updatedAd = await ad.update({
      frkAdPackage: userPackage.id,
      adType,
      order: Date.now(),
    });

    try {
      let expireDatePackage = moment()
        .add(++package.duration, 'd')
        .format();

      await userPackage.update({
        active: 2,
        expireDatePackage,
      });
    } catch (err) {
      await updatedAd.update({ frkAdPackage: null, adType: 0 });

      throw err;
    }

    res.send(updatedAd);
  })
);

router.get(
  '/api/ad/:id',
  catchAsync(async (req, res, next) => {
    const ad = await Ad.findByPk(req.params.id, {
      include: [
        {
          model: AdDetailValue,
          through: {
            attributes: [],
          },
          include: {
            model: AdDetail,
          },
        },
        {
          model: AdVideo,
        },
        {
          model: AdImage,
        },
      ],
    });

    if (!ad) return next(new AppError('NOT FOUND SUCH AD', 404));

    if (ad.frkAdPackage) {
      const userPackage = await ad.getJuncUserAdPackage();

      if (userPackage.expireDatePackage > Date.now()) {
        const ip = req.headers['x-forwarded-for'] || req.ip;

        const newRecord = await AdPackageRecord.createNewAdPackageRecord(
          userPackage.id,
          ip
        );
      } else {
        await ad.update({ frkAdPackage: null });
      }
    }

    let advertiser = null;

    if (ad.userProfile) {
      advertiser = await ad.getUser({
        attributes: ['username', 'userType', 'image', 'createdAt', 'id'],
      });
    }

    res.send({ ad, advertiser });
  })
);

router.get(
  '/api/similar/ads/:id',
  catchAsync(async (req, res, next) => {
    const ad = await findByIdAndCheckExistence(
      Ad,
      req.params.id,
      'Ad Not Found'
    );

    let where = {
      frkCatC: ad.frkCatC,
    };

    let order = [
      ['adType', 'DESC'],
      ['order', 'DESC'],
    ];

    let attributes = ['id', 'title', 'price', 'adType', 'image', 'order'];

    const similarAds = await Ad.findAll({
      where,
      order,
      attributes,
      offset: 0,
      limit: 20,
    });

    res.send(similarAds);
  })
);

router.get(
  '/api/ads',
  catchAsync(async (req, res, next) => {
    const { where, exclude, order, limit, offset } = AdAPIOptions(req.query);

    const ads = await Ad.findAndCountAll({
      order,
      attributes: {
        exclude,
      },
      where,
      limit,
      offset,
    });

    res.send(ads);
  })
);

router.get(
  '/api/specific/ads/:id',
  catchAsync(async (req, res, next) => {
    let { where, exclude, order, limit, offset } = AdAPIOptions(req.query);

    where = { ...where, frkSpecificCat: req.params.id };

    let detail =
      req.query.val && typeof req.query.val == 'string'
        ? { id: req.query.val.split(',') }
        : undefined;

    const ads = await Ad.findAndCountAll({
      where,
      include: {
        model: AdDetailValue,
        where: detail,
        attributes: [],
        through: {
          attributes: [],
        },
      },
      attributes: { exclude },
      offset,
      limit,
      order,
      distinct: true,
    });

    res.send(ads);
  })
);

router.get(
  '/api/compare/s/ads/:id',
  catchAsync(async (req, res, next) => {
    let adIdz = [];
    if (req.query.index && typeof req.query.index == 'string') {
      adIdz = req.query.index.split(',');

      if (adIdz.length > 4) {
        adIdz = adIdz.slice(0, 4);
      }
    }

    const ads = await Ad.findAll({
      where: {
        frkSpecificCat: req.params.id,
        id: {
          [Op.in]: adIdz,
        },
      },
      include: {
        model: AdDetailValue,
        through: {
          attributes: [],
        },
        include: {
          model: AdDetail,
        },
      },
    });

    res.send(ads);
  })
);

router.get(
  '/api/compare/c/ads/:id',
  catchAsync(async (req, res, next) => {
    let adIdz = [];
    if (req.query.index && typeof req.query.index == 'string') {
      adIdz = req.query.index.split(',');

      if (adIdz.length > 4) {
        adIdz = adIdz.slice(0, 4);
      }
    }

    const ads = await Ad.findAll({
      where: {
        frkCatC: req.params.id,
        id: {
          [Op.in]: adIdz,
        },
      },
    });

    res.send(ads);
  })
);

router.get(
  '/api/ads/max/min/price',
  catchAsync(async (req, res, next) => {
    let { where, exclude, order, limit, offset } = AdAPIOptions(req.query);

    const min = await Ad.min('price', {
      where,
    });

    const max = await Ad.max('price', {
      where,
    });

    res.send({ min, max });
  })
);

router.get(
  '/api/search/ads',
  catchAsync(async (req, res, next) => {
    const ads = await Ad.findAll({
      where: {
        title: {
          [Op.like]:
            req.query.search && typeof req.query.search == 'string'
              ? req.query.search + '%'
              : '',
        },
      },
      attributes: ['id', 'title', 'adType', 'order'],
      order: [
        ['adType', 'DESC'],
        ['order', 'DESC'],
      ],
      offset: 0,
      limit: 20,
    });

    res.send(ads);
  })
);

// admin only

router.get(
  '/api/user/ad/:id',
  catchAsync(async (req, res, next) => {
    const ad = await Ad.findByPk(req.params.id, {
      include: {
        model: User,
      },
    });

    if (!ad) return next(new AppError('NOT FOUND SUCH AD', 404));

    res.send(ad);
  })
);

module.exports = router;
