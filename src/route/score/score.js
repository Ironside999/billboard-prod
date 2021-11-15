const { Op } = require('sequelize');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');
const Score = require('../../model/score/score');
const createNewRecord = require('../../util/createNewRecord');
const AppError = require('../../appError/appError');

const router = new express.Router();

router.get(
  '/api/score/me',
  userAuth,
  catchAsync(async (req, res, next) => {
    const sumScores = await Score.sum('score', {
      where: { frkUser: req.user.id },
    });

    res.send({ sumScores });
  })
);

router.get(
  '/api/score/count',
  userAuth,
  catchAsync(async (req, res, next) => {
    const scores = await req.user.getScores();

    res.send(scores);
  })
);

router.post(
  '/api/user/upgrade/green',
  userAuth,
  catchAsync(async (req, res, next) => {
    const sumScores = await Score.sum('score', {
      where: { frkUser: req.user.id },
    });

    if (sumScores <= 1000) return next(new AppError('NOT ENOUGH SCORE'));

    const upgrade = await createNewRecord(Score, {
      score: -1000,
      scoreType: 0,
      scoreTitle: 20,
      frkUser: req.user.id,
    });

    await req.user.update({
      userType: 2,
    });

    res.send();
  })
);

router.post(
  '/api/score/upgrade/blue',
  userAuth,
  catchAsync(async (req, res, next) => {
    const sumScores = await Score.sum('score', {
      where: { frkUser: req.user.id },
    });

    if (sumScores <= 10000) return next(new AppError('NOT ENOUGH SCORE'));

    const upgrade = await createNewRecord(Score, {
      score: -10000,
      scoreType: 0,
      scoreTitle: 21,
      frkUser: req.user.id,
    });

    await req.user.update({
      userType: 3,
    });

    res.send();
  })
);

module.exports = router;
