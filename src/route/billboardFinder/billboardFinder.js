const BillboardFinder = require('../../model/billboardFinder/billboardFinder');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const findByIdAndCheckExistence = require('../../util/findById');
const axios = require('axios');
const AppError = require('../../appError/appError');
const userAuth = require('../../middleware/userAuth');
const Transaction = require('../../model/transaction/transaction');
const moment = require('moment');
const BbdFinderImage = require('../../model/billboardFinder/bbdFinderImage');
const { Op } = require('sequelize');
const BbdFinderDimension = require('../../model/billboardFinder/bbdFinderDimension');
const BbdFinderSize = require('../../model/billboardFinder/bbdFinderSize');
const BbdFinderType = require('../../model/billboardFinder/bbdFinderType');
const BbdFinderDuration = require('../../model/billboardFinder/bbdFinderDuration');
const Area = require('../../model/CPC/area');
const City = require('../../model/CPC/city');
const calculateBbdFinderPrice = require('../../util/calculateBbdFinderPrice');

const router = express.Router();
router.post(
  '/api/billboard-finder/buy/wallet',
  userAuth,
  catchAsync(async (req, res, next) => {
    const userBalance = await req.user.getBalance();

    const durationBbd = await BbdFinderDuration.findByPk(
      req.body.frkBbdFinderDuration
    );

    if (!durationBbd) return next(new AppError('Duration not found', 404));

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

    let date = moment()
      .add(+durationBbd.duration, 'w')
      .format();

    const price = calculateBbdFinderPrice(
      +durationBbd.duration,
      +req.body.pricePerMonth
    );

    if (price > +userBalance.balance)
      return next(new AppError('Not enough balance', 400));

    const newTransaction = await Transaction.newTransaction({
      frkUser: req.user.id,
      title: 'خرید بیلبوردیاب',
      price,
      transactionType: 1,
      status: 3,
    });
    let newBbdFinder;
    try {
      newBbdFinder = await BillboardFinder.create({
        ...req.body,
        status: 1,
        expireDate: date,
        frkUser: req.user.id,
      });
    } catch (err) {
      await newTransaction.failed();
      throw err;
    }

    try {
      await userBalance.decrement('balance', { by: price });

      res.send({});
    } catch (err) {
      await newTransaction.failed();
      await newBbdFinder.destroy();
      throw err;
    }
  })
);

router.post(
  '/api/billboard-finder/buy',
  userAuth,
  catchAsync(async (req, res, next) => {
    const durationBbd = await BbdFinderDuration.findByPk(
      req.body.frkBbdFinderDuration
    );

    if (!durationBbd) return next(new AppError('Duration not found', 404));

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

    let date = moment()
      .add(+durationBbd.duration, 'w')
      .format();

    const newBbdFinder = await BillboardFinder.create({
      ...req.body,
      status: 0,
      expireDate: date,
      frkUser: req.user.id,
    });

    const price = calculateBbdFinderPrice(
      +durationBbd.duration,
      +req.body.pricePerMonth
    );

    let newTransaction;
    try {
      newTransaction = await Transaction.newTransaction({
        frkUser: req.user.id,
        title: 'خرید بیلبوردیاب',
        price,
        identifier: newBbdFinder.id,
      });
    } catch (err) {
      await newBbdFinder.destroy();
      throw err;
    }

    let pay = {
      MerchantID: process.env.MERCHANT_ID,
      Amount: price,
      CallbackURL: process.env.BASE_URL + '/api/billboard-finder/callback/url',
      Email: req.user.email,
      Description: 'خرید بیلبوردیاب',
      Mobile: req.user.mobile,
    };

    const request = await axios({
      method: 'post',
      url: process.env.PAYEMENT_REQUEST_URI,
      data: pay,
    });

    if (request.data.Status !== 100) {
      await BillboardFinder.destroy({
        where: {
          id: newBbdFinder.id,
          frkUser: req.user.id,
        },
      });

      await newTransaction.destroy();

      return next(new AppError('PAYMENT GATEWAY ERROR', 500));
    }

    await newTransaction.authorize(request.data.Authority);

    res.send({
      url: `${process.env.PAYEMENT_START_URI}${request.data.Authority}`,
    });
  })
);

router.get(
  '/api/billboard-finder/callback/url',
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

      await BillboardFinder.update(
        { status: 1 },
        {
          where: {
            id: transaction.identifier,
          },
        }
      );

      return res.redirect(process.env.CLIENT_URL + 'Profile');
      // inja byd redirect beshe be yeki az safhe haye front
    }

    await transaction.failed();

    await BillboardFinder.destroy({
      where: {
        id: transaction.identifier,
      },
    });

    res.redirect(process.env.CLIENT_URL + 'Profile');
    // inja ham byd redirect beshe be safhe natije failede tu front
  })
);

router.delete(
  '/api/billboard-finder/delete/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const billboard = await BillboardFinder.destroy({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!billboard) return next(new AppError('billboard not found', 404));

    res.send({});
  })
);

router.delete(
  '/api/bbd/drop/image/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const billboard = await BillboardFinder.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!billboard) return next(new AppError('NOT FOUND SUCH AD', 404));

    if (!Array.isArray(req.body.idz) || !req.body.idz?.length) {
      return next(new AppError('Not found any image', 404));
    }

    await Promise.all(
      req.body.idz.map(async (itm) => {
        try {
          await BbdFinderImage.destroy({
            where: {
              frkBbdType: billboard.id,
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
  '/api/billboard-finder/update/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const billboard = await BillboardFinder.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (billboard?.status == 0) return next(new AppError('NOT ALLOWED', 400));

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

    if (Array.isArray(req.body.arrayImages) && req.body.arrayImages?.length) {
      let images = req.body.arrayImages.map((itm) => {
        return { frkBbdType: billboard.id, image: itm };
      });

      await BbdFinderImage.bulkCreate(images);
    }

    if (Array.isArray(req.body.idz) || req.body.idz?.length) {
      await Promise.all(
        req.body.idz.map(async (itm) => {
          try {
            await BbdFinderImage.destroy({
              where: {
                frkBbdType: billboard.id,
                id: itm,
              },
            });
          } catch (err) {
            throw err;
          }
        })
      );
    }

    const safteyExcluded = ['id', 'buyId', 'frkUser', 'expireDate'];

    const body = { ...req.body };

    safteyExcluded.forEach((itm) => delete body[itm]);
    const updatedbillboard = await billboard.update(body);

    res.send({});
  })
);

router.get(
  '/api/billboard-finder/single/:id',
  catchAsync(async (req, res, next) => {
    const billboard = await BillboardFinder.findByPk(req.params.id, {
      include: [
        {
          model: BbdFinderImage,
        },
        {
          model: BbdFinderDimension,
        },
        {
          model: BbdFinderSize,
        },
        {
          model: BbdFinderType,
        },
        {
          model: City,
        },
        {
          model: Area,
        },
      ],
    });

    if (!billboard || billboard.status != 1)
      return next(new AppError('NOT FOUND SUCH Billboard', 404));

    let advertiser = null;

    if (billboard.userProfile) {
      advertiser = await billboard.getUser({
        attributes: ['username', 'userType', 'image', 'createdAt'],
      });
    }

    res.send({ billboard, advertiser });
  })
);

router.get(
  '/api/billboard-finder/all',
  catchAsync(async (req, res, next) => {
    const where = {
      ...req.query,
      status: 1,
      expireDate: { [Op.gt]: Date.now() },
    };

    const excludeFields = ['offset', 'order', 'limit', 'attributes', 'group'];

    excludeFields.forEach((itm) => delete where[itm]);

    let exclude = [];

    if (req.query.attributes && typeof req.query.attributes == 'string') {
      exclude = req.query.attributes.split(',');
    }

    let order = [];

    if (req.query.order && typeof req.query.order == 'string') {
      let sort = [];

      if (req.query.order.includes(';')) {
        sort = req.query.order.split(';');
        sort = sort.map((itm) => {
          return itm.split(',');
        });

        order = sort;
      } else {
        sort = req.query.order.split(',');
        order.push(sort);
      }
    }

    let limit = 12;
    let offset = 0;

    if (req.query.offset && req.query.limit) {
      offset = +req.query.offset || 0;
      limit = +req.query.limit || 12;
    }

    const billboards = await BillboardFinder.findAndCountAll({
      attributes: { exclude },
      where,
      order,
      limit,
      offset,
    });

    res.send(billboards);
  })
);

router.get(
  '/api/similar/billboard-finders/:id',
  catchAsync(async (req, res, next) => {
    const bbd = await findByIdAndCheckExistence(
      BillboardFinder,
      req.params.id,
      'Bbd finder Not Found'
    );

    let where = {
      [Op.and]: [
        {
          [Op.or]: [
            {
              frkBbdType: bbd.frkBbdType || '',
            },
            {
              frkBbdFinderSize: bbd.frkBbdFinderSize || '',
            },
            {
              frkBbdFinderDimension: bbd.frkBbdFinderDimension || '',
            },
          ],
        },
        {
          [Op.or]: [
            {
              frkArea: bbd.frkArea,
            },
            {
              frkCity: bbd.frkCity,
            },
          ],
        },
      ],
    };

    // let order = [
    //   ['adType', 'DESC'],
    //   ['order', 'DESC'],
    // ];

    let attributes = ['id', 'title', 'address', 'image', 'isAvailable'];

    const simillarBbd = await BillboardFinder.findAll({
      where,
      // order,
      attributes,
      offset: 0,
      limit: 20,
    });

    res.send(simillarBbd);
  })
);

module.exports = router;
