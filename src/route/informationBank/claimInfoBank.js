const express = require("express");
const AppError = require("../../appError/appError");
const catchAsync = require("../../appError/catchAsync");
const Authorize = require("../../middleware/authorization");
const userAuth = require("../../middleware/userAuth");
const ClaimInfoBank = require("../../model/informationBank/claimInfoBank");
const InformationBank = require("../../model/informationBank/informationBank");
const findByIdAndCheckExistence = require("../../util/findById");
const { Op } = require("sequelize");
const APIFeatures = require("../../apiFeatures/apiFeature");

const router = new express.Router();

router.post(
  "/api/claim/info/bank",
  userAuth,
  catchAsync(async (req, res, next) => {
    const infoBank = await InformationBank.findOne({
      where: {
        id: req.body.frkInfoBank,
        frkUser: {
          [Op.is]: null,
        },
      },
    });

    if (!infoBank)
      return next(
        new AppError("بانک اطلاعات وجود ندارد یا متعلق به شخصی یگر است", 404)
      );
      const checkClaim = await ClaimInfoBank.findOne({
        where: {frkUser: req.user.id, frkInfoBank: infoBank.id}
      });
      
      if (checkClaim) {
        return next(new AppError('شما اکنون صاحب این کسب و کار هستید', 400));
      };

    const newClaim = await ClaimInfoBank.create({
      frkUser: req.user.id,
      message: req.body.message,
      frkInfoBank: req.body.frkInfoBank,
      status: 0,
    });

    res.send();
  })
);

router.delete(
  "/api/remove/info/bank/claim/:id",
  userAuth,
  catchAsync(async (req, res, next) => {
    const claim = await ClaimInfoBank.findOne({
      where: {
        id: req.params.id,
        frkUser: req.user.id,
      },
    });

    if (!claim) return next(new AppError("Your claim not found", 404));

    await claim.destroy();

    res.send();
  })
);

router.get(
  "/api/my/info/bank/claims",
  userAuth,
  catchAsync(async (req, res, next) => {
    const claims = await ClaimInfoBank.findAll({
      where: {
        frkUser: req.user.id,
      },
    });

    res.send(claims);
  })
);

router.patch(
  "/api/check/info/bank/claim/:id",
  userAuth,
  Authorize,
  catchAsync(async (req, res, next) => {
    const claim = await findByIdAndCheckExistence(
      ClaimInfoBank,
      req.params.id,
      "Claim of info bank not found",
      404
    );

    if (!req.body.status || !req.body.replyMessage)
      return next(new AppError("You should provide status and message", 400));

    if (req.body.status == 2) {
      const infoBank = await claim.getInformationBank();

      try {
        await claim.update({
          status: 2,
          replyMessage: req.body.replyMessage,
        });

        await infoBank.update({
          frkUser: claim.frkUser,
        });
      } catch (err) {
        await claim.update({
          status: 0,
          replyMessage: null,
        });

        await infoBank.update({
          frkUser: null,
        });

        throw err;
      }

      return res.send();
    }

    await claim.update({
      status: 1,
      replyMessage: req.body.replyMessage,
    });

    res.send();
  })
);

router.get(
  "/api/info/bank/claims",
  userAuth,
  // Authorize,
  catchAsync(async (req, res, next) => {
    const { where, include, order, limit, offset } = APIFeatures(req.query);

    const claims = await ClaimInfoBank.findAndCountAll({
      where,
      attributes: include,
      order,
      limit,
      offset,
    });

    res.send(claims);
  })
);

router.get(
  "/api/info/bank/claim/:id",
  userAuth,
  // Authorize,
  catchAsync(async (req, res, next) => {
    const claim = await findByIdAndCheckExistence(
      ClaimInfoBank,
      req.params.id,
      "Claim not found"
    );

    res.send(claim);
  })
);

module.exports = router;
