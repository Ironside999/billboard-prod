const { Op } = require('sequelize');
const informationBank = require('../../model/informationBank/informationBank');
const express = require('express');
const axios = require('axios');
const catchAsync = require('../../appError/catchAsync');
const { uploadMultipleFields } = require('../../middleware/multer');
const { formatMultipleFields } = require('../../middleware/sharp');
const userAuth = require('../../middleware/userAuth');
const AppError = require('../../appError/appError');
const AdsBlvlCategory = require('../../model/ads/adCategoryB');
const AdsClvlCategory = require('../../model/ads/adCategoryC');
const User = require('../../model/user/user');
const findByIdAndCheckExistence = require('../../util/findById');
const InfoBankImage = require('../../model/informationBank/infoBankImage');
const Transaction = require('../../model/transaction/transaction');
const InfoBankPackage = require('../../model/informationBank/informationBankPackage');
const InfoBankApiOptions = require('../../apiFeatures/InfoBankApiOption');
const InfoBankVideo = require('../../model/informationBank/informationBankVideo');
const Keyword = require('../../model/keyword/keyword');
const JuncBankSocialNtwrk = require('../../model/informationBank/juncBankSocialNetwok');
const InfoBankKeyword = require('../../model/informationBank/infoBankKeyword');
const Score = require('../../model/score/score');
const moment = require('moment');
const JuncInfoBankFeature = require('../../model/informationBank/juncInfoBankFeature');
const InfoBankFeature = require('../../model/informationBank/infoBankFeature');
const SocialNetwok = require('../../model/informationBank/socialNetwok');

const router = new express.Router();

router.post(
  '/api/information/bank/add',
  userAuth,
  catchAsync(async (req, res, next) => {
    const checkB = await AdsBlvlCategory.findOne({
      where: {
        id: req.body.frkCatB,
        frkCatA: req.body.frkCatA,
      },
    });

    if (!checkB) return next(new AppError('B DOES NOT BLONG TO C', 400));

    if (req.body.frkCatC) {
      const checkC = await AdsClvlCategory.findOne({
        where: {
          id: req.body.frkCatC,
          frkCatB: req.body.frkCatB,
        },
      });

      if (!checkC) return next(new AppError('C DOES NOT BLONG TO B', 400));
    }

    const newInfoBank = await informationBank.create({
      ...req.body,
      frkUser: req.user.id,
      infoType: 0,
      order: Date.now(),
      status: 2,
      visitCount: 0,
      totalRate: 0,
      raterCount: 0,
      frkInfoPack: null,
    });

    if (Array.isArray(req.body.arrayImages) && req.body.arrayImages?.length) {
      try {
        let images = req.body.arrayImages.map((itm) => {
          return { frkInfoBank: newInfoBank.id, image: itm };
        });

        await InfoBankImage.bulkCreate(images);
      } catch (err) {
        await newInfoBank.destroy();

        throw err;
      }
    }

    if (
      Array.isArray(req.body.socialNetworks) &&
      req.body.socialNetworks?.length
    ) {
      try {
        let socialNetworks = req.body.socialNetworks.map((itm) => {
          return {
            frkInfoBank: newInfoBank.id,
            frkSocialNtwrk: itm.frkSocialNtwrk,
            info: itm.info,
          };
        });

        await JuncBankSocialNtwrk.bulkCreate(socialNetworks);



      } catch (err) {
        await newInfoBank.destroy();

        throw err;
      }
    }

    if (Array.isArray(req.body.keywords) && req.body.keywords?.length) {
      try {
        await Promise.all(
          req.body.keywords.map(async (itm) => {
            const keyword = await Keyword.findOrCreate({
              where: {
                key: itm.key,
                frkCatB: req.body.frkCatB,
              },
            });
            const infoKey = await InfoBankKeyword.create({
              frkInfoBank: newInfoBank.id,
              frkKey: keyword.id,
            });
          })
        );


      } catch (err) {
        await newInfoBank.destroy();

        throw err;
      }
    }


    //add here
  if (checkC) {
    if (
      Array.isArray(req.body.infoBankFeatures) &&
      req.body.infoBankFeatures?.length
    ) {
      try {
        let infoBankFeatures = req.body.infoBankFeatures.map((itm) => {
          return {
            frkInfoBank: newInfoBank.id,
            frkInfoFeature: itm,
          };
        });

        await JuncInfoBankFeature.bulkCreate(infoBankFeatures);



      } catch (err) {
        await newInfoBank.destroy();

        throw err;
      }
    }
  }
  //till here
  //+const JuncInfoBankFeature

    const checkInfoBank = await informationBank.count({
      where: { frkUser: req.user.id }
    })

    if (checkInfoBank <= 5) {
      const scoreObj = {
        frkUser: req.user.id,
        score: 1,
        scoreTitle: 7,
        scoreType: 1,
      };
      const addScoreToInviterUser = await Score.newScore(scoreObj);

    }



    res.status(201).send();
  })
);

router.post(
  '/api/info/bank/vip/add',
  userAuth,
  catchAsync(async (req, res, next) => {
    const infoBankPackage = await findByIdAndCheckExistence(
      InfoBankPackage,
      req.body.infoBankPackId
    );

    const checkB = await AdsBlvlCategory.findOne({
      where: {
        id: req.body.frkCatB,
        frkCatA: req.body.frkCatA,
      },
    });

    if (!checkB) return next(new AppError('B DOES NOT BLONG TO C', 400));

    if (req.body.frkCatC) {
      const checkC = await AdsClvlCategory.findOne({
        where: {
          id: req.body.frkCatC,
          frkCatB: req.body.frkCatB,
        },
      });

      if (!checkC) return next(new AppError('C DOES NOT BLONG TO B', 400));
    }

    let vipExpDate = moment()
      .add(+infoBankPackage.duration, 'M')
      .format();

    const newInfoBank = await informationBank.create({
      ...req.body,
      frkUser: req.user.id,
      infoType: +infoBankPackage.packageType,
      order: Date.now(),
      status: 4,
      // important: 4 means in pending mode
      vipExpDate,
      frkInfoPack: infoBankPackage.id,
      visitCount: 0,
      totalRate: 0,
      raterCount: 0,
    });

    if (Array.isArray(req.body.arrayImages) && req.body.arrayImages?.length) {
      try {
        let images = req.body.arrayImages.map((itm) => {
          return { frkInfoBank: newInfoBank.id, image: itm };
        });

        await InfoBankImage.bulkCreate(images);
      } catch (err) {
        await newInfoBank.destroy();

        throw err;
      }
    }

    if (
      Array.isArray(req.body.socialNetworks) &&
      req.body.socialNetworks?.length
    ) {
      try {
        let socialNetworks = req.body.socialNetworks.map((itm) => {
          return {
            frkInfoBank: newInfoBank.id,
            frkSocialNtwrk: itm.frkSocialNtwrk,
            info: itm.info,
          };
        });

        await JuncBankSocialNtwrk.bulkCreate(socialNetworks);
      } catch (err) {
        await newInfoBank.destroy();

        throw err;
      }
    }

    if (Array.isArray(req.body.keywords) && req.body.keywords?.length) {
      try {
        await Promise.all(
          req.body.keywords.map(async (itm) => {
            const keyword = await Keyword.findOrCreate({
              where: {
                key: itm.key,
                frkCatB: req.body.frkCatB,
              },
            });
            const infoKey = await InfoBankKeyword.create({
              frkInfoBank: newInfoBank.id,
              frkKey: keyword.id,
            });
          })
        );
      } catch (err) {
        await newInfoBank.destroy();

        throw err;
      }
    }

    const price = +infoBankPackage.price - +infoBankPackage.discount;

    let newTransaction;
    try {
      newTransaction = await Transaction.newTransaction({
        frkUser: req.user.id,
        title: 'buy information bank package',
        price,
        identifier: newInfoBank.id,
      });
    } catch (err) {
      await newInfoBank.destroy();

      throw err;
    }

    let pay = {
      MerchantID: process.env.MERCHANT_ID,
      Amount: price,
      CallbackURL: 'http://localhost:5000/api/info/bank/vip/callback/url',
      Email: req.user.email,
      Description: newTransaction.title,
      Mobile: req.user.mobile,
    };

    const request = await axios({
      method: 'post',
      url: process.env.PAYEMENT_REQUEST_URI,
      data: pay,
    });

    if (request.status !== 100) {
      await newInfoBank.destroy();

      await newTransaction.destroy();

      return next(new AppError('PAYMENT GATEWAY ERROR', 500));
    }

    await newTransaction.authorize(request.data.Authority);

    res.send({
      url: `https://www.zarinpal.com/pg/StartPay/${request.data.Authority}`,
    });
  })
);

router.get(
  '/api/info/bank/vip/callback/url',
  catchAsync(async (req, res, next) => {
    const transaction = await Transaction.findOne({
      where: {
        authority: req.query.Authority,
        status: 1,
      },
    });

    if (!transaction) return next(new AppError('Authority Not Found', 404));

    let check = {
      MerchantID: process.env.MERCHANT_ID,
      Amount: transaction.price,
      Authority: req.query.Authority,
    };

    const result = await axios({
      method: 'post',
      url: process.env.PAYMENT_VERIFICATION_URI,
      data: check,
    });

    if (result.data.RefID) {
      const updatedTransaction = await transaction.success(result.data.RefID);

      await informationBank.update(
        { status: 2 },
        {
          where: {
            id: transaction.identifier,
          },
        }
      );

      return res.send();
      // inja byd redirect beshe be yeki az safhe haye front
    }

    await transaction.failed();

    await informationBank.destroy({
      where: {
        id: transaction.identifier,
      },
    });

    res.send();
    // inja ham byd redirect beshe be safhe natije failede tu front
  })
);

router.delete(
  '/api/ad/delete/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const infoBank = await informationBank.destroy({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!infoBank) return next(new AppError('NOT FOUND SUCH INFO BANK', 404));

    res.send();
  })
);

router.patch(
  '/api/ad/update/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const infoBank = await informationBank.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!infoBank) return next(new AppError('NOT FOUND SUCH INFO BANK', 404));

    const safteyExcluded = [
      'id',
      'infoType',
      'frkUser',
      'frkCatA',
      'frkCatB',
      'frkCatC',
      'frkInfoPack',
      'order',
      'visitCount',
      'totalRate',
      'raterCount',
      'status',
      'vipExpDate',
    ];

    const body = { ...req.body };

    safteyExcluded.forEach((itm) => delete body[itm]);

    if (Array.isArray(req.body.arrayImages) && req.body.arrayImages?.length) {
      let images = req.body.arrayImages.map((itm) => {
        return { frkInfoBank: newInfoBank.id, image: itm };
      });

      try {
        const imageCount = await InfoBankImage.count({
          where: {
            frkInfoBank: infoBank.id,
          },
        });

        if (+imageCount >= 9 || imageCount + images.length > 9) {
          return next(
            new AppError(`You can choose only ${9 - imageCount} images`, 400)
          );
        }

        await InfoBankImage.bulkCreate(images);
      } catch (err) {
        throw err;
      }
    }

    const updatedInfoBank = await infoBank.update(body);

    res.send();
  })
);

router.delete(
  '/api/info/bank/drop/image/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const infoBank = await informationBank.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!infoBank) return next(new AppError('NOT FOUND SUCH INFO BANK', 404));

    if (!Array.isArray(req.body.idz) || !req.body.idz?.length) {
      return next(new AppError('Not found any image', 404));
    }

    await Promise.all(
      req.body.idz.map(async (itm) => {
        try {
          await InfoBankImage.destroy({
            where: {
              frkInfoBank: infoBank.id,
              id: itm,
            },
          });
        } catch (err) {
          throw err;
        }
      })
    );

    res.send();
  })
);

router.patch(
  '/api/info/bank/upgrade/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const infoBank = await informationBank.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!infoBank) return next(new AppError('NOT FOUND SUCH INFO BANK', 404));

    const infoBankPackage = await findByIdAndCheckExistence(
      InfoBankPackage,
      req.body.infoBankPackId
    );

    let vipExpDate = moment()
      .add(+infoBankPackage.duration, 'M')
      .format();

    const updatedInfoBank = await infoBank.update({
      infoType: +infoBankPackage.packageType,
      status: 4,
      // important: 4 means in pending mode
      vipExpDate,
      frkInfoPack: infoBankPackage.id,
    });

    const price = +infoBankPackage.price - +infoBankPackage.discount;

    let newTransaction;
    try {
      newTransaction = await Transaction.newTransaction({
        frkUser: req.user.id,
        title: 'buy information bank package',
        price,
        identifier: infoBank.id,
      });
    } catch (err) {
      await infoBank.update({
        infoType: 0,
        status: 3,
        // important: 4 means in pending mode
        vipExpDate: null,
        frkInfoPack: null,
      });

      throw err;
    }

    let pay = {
      MerchantID: process.env.MERCHANT_ID,
      Amount: price,
      CallbackURL: 'http://localhost:5000/api/info/bank/vip/callback/url',
      Email: req.user.email,
      Description: newTransaction.title,
      Mobile: req.user.mobile,
    };

    const request = await axios({
      method: 'post',
      url: process.env.PAYEMENT_REQUEST_URI,
      data: pay,
    });

    if (request.status !== 100) {
      await newTransaction.destroy();

      await infoBank.update({
        infoType: 0,
        status: 3,
        // important: 4 means in pending mode
        vipExpDate: null,
        frkInfoPack: null,
      });

      return next(new AppError('PAYMENT GATEWAY ERROR', 500));
    }

    await newTransaction.authorize(request.data.Authority);

    res.send({
      url: `https://www.zarinpal.com/pg/StartPay/${request.data.Authority}`,
    });
  })
);

router.get(
  '/api/info/bank/:id',
  catchAsync(async (req, res, next) => {
    const infoBank = await informationBank.findByPk(req.params.id, {
      include: [
        {
          model: InfoBankVideo,
        },
        {
          model: InfoBankImage,
        },
        {
          model: InfoBankFeature,
          throught: {
            attributes: [],
          },
        },
        {
          model: SocialNetwok,
          throught: {
            attributes: [],
          },
        },
      ],
    });

    if (!infoBank) return next(new AppError('NOT FOUND SUCH INFO BANK', 404));


    let advertiser = null;

    if (infoBank.userProfile) {
      advertiser = await infoBank.getUser({
        attributes: ['username', 'userType', 'image', 'createdAt', 'id'],
      });
    }

    await infoBank.increment('visitCount', { by: 1 });

    res.send({ infoBank, advertiser });
  })
);

router.post(
  '/api/info/bank/rate/:id',
  catchAsync(async (req, res, next) => {
    const infoBank = await informationBank.findByPk(req.params.id);

    if (!infoBank) return next(new AppError('NOT FOUND SUCH INFO BANK', 404));

    if (req.body.rate > 5 || req.body.rate < 0)
      return next(new AppError('RANGE VIOLATION', 400));

    const updateRate = await infoBank.update({
      totalRate: Number(req.body.rate) + Number(infoBank.totalRate),
      raterCount: infoBank.raterCount + 1,
    });

    res.send();
  })
);

router.get(
  '/api/similar/info/banks/:id',
  catchAsync(async (req, res, next) => {
    const infoBank = await findByIdAndCheckExistence(
      informationBank,
      req.params.id,
      'infoBank Not Found'
    );

    let where = {
      [Op.and]: [
        {
          [Op.or]: [
            {
              frkCatC: infoBank.frkCatC,
            },
            {
              frkCatB: infoBank.frkCatB,
            },
          ],
        },
        {
          frkCity: infoBank.frkCity,
        },
      ],
    };

    let order = [
      ['infoType', 'DESC'],
      ['order', 'DESC'],
    ];

    let attributes = ['id', 'title', 'infoType', 'image', 'order'];

    const similarInfoBanks = await informationBank.findAll({
      where,
      order,
      attributes,
      offset: 0,
      limit: 20,
    });

    res.send(similarInfoBanks);
  })
);

router.get(
  '/api/information/banks',
  catchAsync(async (req, res, next) => {
    const { where, exclude, order, limit, offset } = InfoBankApiOptions(
      req.query
    );


    let detail =
      req.query.keyword && typeof req.query.keyword == 'string'
        ? { id: req.query.keyword.split(',') }
        : undefined;

    if (detail) {

      delete where.keyword

      const infoBanks = await informationBank.findAndCountAll({
        order,
        attributes: {
          exclude,
        },
        where,
        limit,
        offset,
        include: {
          model: Keyword,
          where: detail,
          attributes: [],
          through: {
            attributes: [],
          },
        },
        distinct: true,
      });

      res.send(infoBanks);

    } else {

      const infoBanks = await informationBank.findAndCountAll({
        order,
        attributes: {
          exclude,
        },
        where,
        limit,
        offset,
      });
      console.log(infoBanks)

      res.send(infoBanks);

    }


  })
);

router.get(
  '/api/search/info/banks',
  catchAsync(async (req, res, next) => {
    const infoBanks = await informationBank.findAll({
      where: {
        title: {
          [Op.like]:
            req.query.search && typeof req.query.search == 'string'
              ? req.query.search + '%'
              : '',
        },
      },
      attributes: ['id', 'title', 'image', 'infoType', 'order'],
      order: [
        ['infoType', 'DESC'],
        ['order', 'DESC'],
      ],
      offset: 0,
      limit: 20,
    });

    res.send(infoBanks);
  })
);

// admin only

router.get(
  '/api/user/info/bank/:id',
  catchAsync(async (req, res, next) => {
    const infoBank = await informationBank.findByPk(req.params.id, {
      include: {
        model: User,
      },
    });

    if (!infoBank) return next(new AppError('NOT FOUND SUCH INFO BANK', 404));

    res.send(infoBank);
  })
);

module.exports = router;
