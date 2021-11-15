const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');
const axios = require('axios');
const Transaction = require('../../model/transaction/transaction');
const AppError = require('../../appError/appError');
const Score = require('../../model/score/score');

const router = new express.Router();

router.post(
  '/api/balance/increase',
  userAuth,
  catchAsync(async (req, res, next) => {
    const newTransaction = await Transaction.newTransaction({
      frkUser: req.user.id,
      title: 'افزایش موجودی کیف پول',
      price: req.body.price,
    });

    let pay = {
      MerchantID: process.env.MERCHANT_ID,
      Amount: req.body.price,
      CallbackURL: process.env.BASE_URL + '/api/balance/callback/url',
      Email: req.user.email,
      Description: newTransaction.title,
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

    res.send({
      url: `${process.env.PAYEMENT_START_URI}${request.data.Authority}`,
    });
  })
);

router.get(
  '/api/balance/me',
  userAuth,
  catchAsync(async (req, res, next) => {
    const balance = await req.user.getBalance();

    res.send(balance);
  })
);

router.get(
  '/api/balance/callback/url',
  catchAsync(async (req, res, next) => {
    const transaction = await Transaction.findOne({
      where: {
        authority: req.query.Authority,
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

      const userBalance = await user.getBalance();

      await userBalance.increment('balance', { by: +updatedTransaction.price });

      return res.redirect(process.env.CLIENT_URL + 'Profile');
      // inja byd redirect beshe be yeki az safhe haye front
    }

    await transaction.failed();

    res.redirect(process.env.CLIENT_URL + 'Profile');
    // inja ham byd redirect beshe be safhe natije failede tu front
  })
);

router.post(
  '/api/exchange/balance',
  userAuth,
  catchAsync(async (req, res, next) => {
    const usrBalance = await req.user.getBalance();

    if (req.body.balance > usrBalance.balance || +req.body.balance % 1000) {
      return next(new AppError('Wrong balance value', 400));
    }

    let score = +req.body.balance / 1000;

    const newScore = {
      frkUser: req.user.id,
      score,
      scoreType: 1,
      scoreTitle: 15,
    };

    let exchnagedScore = await Score.newScore(newScore);

    try {
      await usrBalance.decrement('balance', { by: +req.body.balance });
    } catch (err) {
      await exchnagedScore.destroy();
      throw err;
    }

    res.send({});
  })
);

module.exports = router;
