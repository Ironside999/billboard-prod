const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');
const AppError = require('../../appError/appError');
const findByIdAndCheckExistence = require('../../util/findById');
const checkBalance = require('../../middleware/checkBalance');
const checkBbdCalender = require('../../middleware/checkBbdCalender');
const VirtualBbdCalender = require('../../model/virtualBillboard/virtualBillboardCalendar');
const Balance = require('../../model/balance/balance');
const APIFeatures = require('../../apiFeatures/apiFeature');
const Score = require('../../model/score/score')
const router = new express.Router();

router.post(
  '/api/reserve/virtual-billboard/:id',
  userAuth,
  // checkBalance,
  checkBbdCalender,
  catchAsync(async (req, res, next) => {
    const newCalender = await VirtualBbdCalender.create({
      ...req.body,
      frkVirtualBbd: req.params.id,
      frkUser: req.user.id,
      punish: 0,
    });

    const scoreObj = {
      frkUser: req.user.id,
      score: 10,
      scoreTitle: 6,
      scoreType: 1,
    };

    const addScoreToFirstUserScore = await Score.newScore(scoreObj);


    res.status(201).send();
  })
);

// admin only

router.patch(
  '/api/update/virtual-bbd-user/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const bbd = await findByIdAndCheckExistence(
      VirtualBbdCalender,
      req.params.id
    );

    const safteyExcluded = ['startDate', 'finishDate', 'frkUser', 'id'];

    const body = { ...req.body };

    safteyExcluded.forEach((itm) => delete body[itm]);

    const updatedBbd = await bbd.update(body);

    if (req.body.punish == 1) {
      const user = await bbd.getUser();

      await Balance.update(
        { balance: 0 },
        {
          where: {
            frkUser: user.id,
          },
        }
      );
    }

    res.send();
  })
);

router.delete(
  '/api/delete/virtual-bbd-user/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const bbd = await VirtualBbdCalender.findOne({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!bbd) return next(new AppError('Billboard Not Found', 404));

    if (bbd.finishDate > Date.now())
      return next(new AppError('can not be deleted', 404));

    await bbd.destroy();

    res.send();
  })
);

// admin only

router.get(
  '/api/virtual-bbd-user/single/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const bbd = await findByIdAndCheckExistence(
      VirtualBbdCalender,
      req.params.id
    );

    res.send(bbd);
  })
);

// admin only

router.get(
  '/api/virtual-bbd-user/all',
  userAuth,
  catchAsync(async (req, res, next) => {
    const { where, include, order, limit, offset } = APIFeatures(req.query);

    const bbds = await VirtualBbdCalender.findAndCountAll({
      attributes: include,
      where,
      order,
      limit,
      offset,
    });

    res.send(bbds);
  })
);

module.exports = router;
