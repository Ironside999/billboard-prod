const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const userAuth = require("../../middleware/userAuth");
const AppError = require("../../appError/appError");
const Authorize = require("../../middleware/authorization");
const { Op } = require("sequelize");
const InformationBank = require("../../model/informationBank/informationBank");

const router = express.Router();

router.post(
  "/api/info/bank/boost/:id",
  userAuth,
  catchAsync(async (req, res, next) => {
    const infoBank = await InformationBank.findOne({
      where: {
        id: req.params.id,
        frkUser: req.user.id,
        frkInfoPack: {
          [Op.ne]: null,
        },
      },
    });

    if (!infoBank) return next(new AppError("Info bank not found", 404));

    let date = new Date();

    if (infoBank.vipExpDate < date)
      return next(new AppError("Vip Expired", 400));

    const userBalance = await req.user.getBalance();

    const infoBankPackage = await infoBank.getInfoBankPackage();

    if (userBalance.balance < infoBankPackage.pricePerUpdate) {
      return next(new AppError("Not enough balance", 400));
    }

    const lastBoost = infoBank.order.getTime();

    const iteration = infoBankPackage.iterationTime;

    if (lastBoost + iteration > date) {
      const msg = `You should wait ${
        lastBoost + iteration - date
      } for next boost`;

      return next(new AppError(msg, 400));
    }

    await infoBank.update({ order: date });

    await userBalance.decrement("balance", {
      by: +infoBankPackage.pricePerUpdate,
    });

    res.send();
  })
);

module.exports = router;
