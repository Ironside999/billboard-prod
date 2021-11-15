const catchAsync = require('../../appError/catchAsync');
const express = require('express');
const findByIdAndCheckExistence = require('../../util/findById');
const userAuth = require('../../middleware/userAuth');
const Authorize = require('../../middleware/authorization');
const AppError = require('../../appError/appError');
const Violation = require('../../model/violation/violation');
const Ad = require('../../model/ads/ad');
const Comment = require('../../model/comment/comment');
const APIFeatures = require('../../apiFeatures/apiFeature');
const BillboardFinder = require('../../model/billboardFinder/billboardFinder');

const router = new express.Router();

router.post(
  '/api/report/new/violation',
  userAuth,
  catchAsync(async (req, res, next) => {
    const violations = [
      Ad,
      Comment,
      'InformationBank',
      'InfoBankComment',
      BillboardFinder,
    ];

    const type = +req.body.type;

    const violation = await violations[type].findByPk(req.body.frkSubject);

    if (!violation)
      return next(new AppError('Violated subject not found', 404));

    const newViolation = await Violation.create({
      frkUser: req.user.id,
      violationRelation: type,
      frkRelation: violation.id,
      status: 0,
      message: req.body.message,
      frkViolationCat: req.body.violationCat,
    });

    res.send();
  })
);

router.patch(
  '/api/violation/check/:id',
  userAuth,
  //   Authorize,
  catchAsync(async (req, res, next) => {
    const violation = await findByIdAndCheckExistence(
      Violation,
      req.params.id,
      'Violation not found'
    );

    await violation.update({ status: +req.body.status });

    res.send();
  })
);

router.delete(
  '/api/violation/remove/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const violation = await Violation.findOne({
      where: {
        id: req.params.id,
        frkUser: req.user.id,
      },
    });

    if (!violation) return next(new AppError('Violation not found', 404));

    await violation.destroy();

    res.send();
  })
);

router.get(
  '/api/my/violations',
  userAuth,
  catchAsync(async (req, res, next) => {
    const violations = await Violation.findAll({
      where: {
        frkUser: req.user.id,
      },
    });

    res.send(violations);
  })
);

router.get(
  '/api/violation/check/:id',
  userAuth,
  // Authorize,
  catchAsync(async (req, res, next) => {
    const violation = await findByIdAndCheckExistence(
      Violation,
      req.params.id,
      'Violation not found'
    );

    const violations = [Ad, Comment, 'InformationBank', 'InfoBankComment'];

    const subject = await violations[+violation.violationRelation].findByPk(
      violation.frkRelation
    );

    res.send({ violation, subject });
  })
);

// router.get(
//   '/api/my/violations',
//   userAuth,
//   // Authorize,
//   catchAsync(async (req, res, next) => {
//     const { where, include, order, limit, offset } = APIFeatures(req.query);
//     const violations = await Violation.findAndCountAll({
//       where,
//       attributes: include,
//       order,
//       limit,
//       offset,
//     });

//     res.send(violations);
//   })
// );

module.exports = router;
