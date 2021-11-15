const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const checkExistenceAndRemove = require("../../util/removeById");
const userAuth = require("../../middleware/userAuth");
const AppError = require("../../appError/appError");
const User = require("../../model/user/user");
const InfoBankExperience = require("../../model/informationBank/infoBankUserExperience");
const Authorize = require("../../middleware/authorization");

const router = express.Router();

router.post(
  "/api/info/bank/experience/add",
  userAuth,
  catchAsync(async (req, res, next) => {
    const userExp = await InfoBankExperience.create({
      ...req.body,
      frkUser: req.user.id,
      frkInfoBank: req.body.frkInfoBank,
    });

    res.status(201).send(userExp);
  })
);

//admin only
router.delete(
  "/api/info/bank/experience/delete/:id",
  userAuth,
  Authorize,
  catchAsync(async (req, res, next) => {
    const userExp = await checkExistenceAndRemove(
      InfoBankExperience,
      req.params.id
    );

    res.send();
  })
);

router.get(
  "/api/info/bank/experience/:id",
  catchAsync(async (req, res, next) => {
    const userExp = await InfoBankExperience.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ["id", "username", "userType", "image"],
      },
    });

    if (!userExp) return next(new AppError("User ecperience not found", 404));

    res.send(userExp);
  })
);

// info bank user experiences
router.get(
  "/api/info/bank/experiences/:id",
  catchAsync(async (req, res, next) => {
    const userExps = await InfoBankExperience.findAll({
      where: {
        frkInfoBank: req.params.id,
      },
      include: {
        model: User,
        attributes: ["id", "username", "userType", "image"],
      },
    });

    res.send(userExps);
  })
);

router.get(
  "/api/info/bank/score/:id",
  catchAsync(async (req, res, next) => {
    const count = await InfoBankExperience.count({
      where: {
        frkInfoBank: req.params.id,
      },
    });

    const sum = await InfoBankExperience.sum("score", {
      where: {
        frkInfoBank: req.params.id,
      },
    });

    // calculation for client:
    // sum % count * 20  ====> result in percentage

    res.send({ count, sum });
  })
);

// admin only
router.get(
  "/api/info/bank/all/experience",
  userAuth,
  Authorize,
  catchAsync(async (req, res, next) => {
    const userExps = await InfoBankExperience.findAndCountAll();

    res.send(userExps);
  })
);

module.exports = router;
