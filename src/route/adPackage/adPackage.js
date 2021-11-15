const AdPackage = require('../../model/adPackage/adPackage');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const createNewRecord = require('../../util/createNewRecord');
const findByIdAndCheckExistence = require('../../util/findById');
const checkExistenceAndRemove = require('../../util/removeById');
const axios = require('axios');
const AppError = require('../../appError/appError');
const userAuth = require('../../middleware/userAuth');
const Transaction = require('../../model/transaction/transaction');
const JuncUserAdPackage = require('../../model/adPackage/juncUserPackage');
const { Op } = require('sequelize');
const Score = require('../../model/score/score');

const router = new express.Router();

router.post(
  '/api/ad/package/add',
  catchAsync(async (req, res, next) => {
    let prty = +req.body.priority === 2 ? 2 : 1;

    const adPackage = await createNewRecord(
      AdPackage,
      ({ iterationTime, duration, price, discount, image, priority, title } = {
        ...req.body,
        priority: prty,
      })
    );

    res.status(201).send(adPackage);
  })
);

router.delete(
  '/api/ad/package/delete/:id',
  catchAsync(async (req, res, next) => {
    const adPackage = await checkExistenceAndRemove(AdPackage, req.params.id);

    res.send();
  })
);

router.delete(
  '/api/user/ad/package/delete/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const adPackage = await JuncUserAdPackage.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
        expireDatePackage: {
          [Op.lte]: Date.now(),
        },
      },
    });

    if (!adPackage) return next(new AppError('Ad package not found', 404));

    await adPackage.destroy();

    res.send({});
  })
);

router.patch(
  '/api/ad/package/update/:id',
  catchAsync(async (req, res, next) => {
    const adPackage = await findByIdAndCheckExistence(AdPackage, req.params.id);

    const safteyExcluded = ['iterationTime', 'duration', 'id', 'priority'];

    const body = { ...req.body };

    safteyExcluded.forEach((itm) => delete body[itm]);

    const updatedPackage = await adPackage.update(body);

    res.send();
  })
);

router.get(
  '/api/ad/package/:id',
  catchAsync(async (req, res, next) => {
    const adPackage = await findByIdAndCheckExistence(AdPackage, req.params.id);

    res.send({ adPackage });
  })
);

router.get(
  '/api/ad/all/packages',
  catchAsync(async (req, res, next) => {
    const adPackages = await AdPackage.findAll();

    res.send(adPackages);
  })
);

router.post(
  '/api/buy/ad/package/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const adPackage = await findByIdAndCheckExistence(AdPackage, req.params.id);

    let price = +adPackage.price - +adPackage.discount;

    const newTransaction = await Transaction.newTransaction({
      frkUser: req.user.id,
      title: 'خرید دوپینگ آگهی',
      price,
      identifier: adPackage.id,
    });

    let pay = {
      MerchantID: process.env.MERCHANT_ID,
      Amount: price,
      CallbackURL: process.env.BASE_URL + '/api/buy/ad/package/callback/url',
      Email: req.user.email,
      Description: 'خرید دوپینگ آگهی',
      Mobile: req.user.mobile,
    };

    const request = await axios({
      method: 'post',
      url: process.env.PAYEMENT_REQUEST_URI,
      data: pay,
    });

    if (request.data.Status !== 100) {
      await newTransaction.destroy();

      return next(new AppError('PAYMENT GATEWAY ERROR', 500));
    }

    await newTransaction.authorize(request.data.Authority);

    // less than 1 month
    if (1 < adPackage.duration && adPackage.duration < 30) {
      //vip package score
      if (adPackage.priority === 1) {
        const scoreObjVIP = {
          frkUser: req.user.id,
          score: 3,
          scoreTitle: 4,
          scoreType: 1,
        };
        const addScoreToInviterUser = await Score.newScore(scoreObjVIP);
        //super vip package score
      } else if (adPackage.priority === 2) {
        const scoreObjSuperVIP = {
          frkUser: req.user.id,
          score: 5,
          scoreTitle: 5,
          scoreType: 1,
        };
        const addScoreToInviterUser = await Score.newScore(scoreObjSuperVIP);
      }
    }

    if (30 < adPackage.duration && adPackage.duration < 60) {
      if (adPackage.priority === 1) {
        const scoreObjVIP = {
          frkUser: req.user.id,
          score: 5,
          scoreTitle: 4,
          scoreType: 1,
        };
        const addScoreToInviterUser = await Score.newScore(scoreObjVIP);
      } else if (adPackage.priority === 2) {
        const scoreObjSuperVIP = {
          frkUser: req.user.id,
          score: 7,
          scoreTitle: 5,
          scoreType: 1,
        };
        const addScoreToInviterUser = await Score.newScore(scoreObjSuperVIP);
      }
    }

    if (60 < adPackage.duration && adPackage.duration < 90) {
      if (adPackage.priority === 1) {
        const scoreObjVIP = {
          frkUser: req.user.id,
          score: 7,
          scoreTitle: 4,
          scoreType: 1,
        };
        const addScoreToInviterUser = await Score.newScore(scoreObjVIP);
      } else if (adPackage.priority === 2) {
        const scoreObjSuperVIP = {
          frkUser: req.user.id,
          score: 10,
          scoreTitle: 5,
          scoreType: 1,
        };
        const addScoreToInviterUser = await Score.newScore(scoreObjSuperVIP);
      }
    }

    res.send({
      url: `${process.env.PAYEMENT_START_URI}${request.data.Authority}`,
    });
  })
);

router.post(
  '/api/buy/ad/package/wallet/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const adPackage = await findByIdAndCheckExistence(AdPackage, req.params.id);
    let price = +adPackage.price - +adPackage.discount;
    const userBalance = await req.user.getBalance();

    if (price > +userBalance.balance)
      return next(new AppError('Not enough balance', 400));

    const newTransaction = await Transaction.newTransaction({
      frkUser: req.user.id,
      title: 'خرید دوپینگ آگهی',
      price: price,
      transactionType: 1,
      status: 3,
    });
    let userPackage;
    try {
      userPackage = await JuncUserAdPackage.create({
        frkUser: req.user.id,
        frkAdPackage: adPackage.id,
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
      await userPackage.destroy();
      throw err;
    }
  })
);

router.get(
  '/api/buy/ad/package/callback/url',
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

      const user = await updatedTransaction.getUser();

      const userPackage = await JuncUserAdPackage.create({
        frkUser: user.id,
        frkAdPackage: updatedTransaction.identifier,
      });

      return res.redirect(process.env.CLIENT_URL + 'Profile');
      // inja byd redirect beshe be yeki az safhe haye front
    }

    await transaction.failed();

    res.redirect(process.env.CLIENT_URL + 'Profile');
    // inja ham byd redirect beshe be safhe natije failede tu front
  })
);

module.exports = router;
