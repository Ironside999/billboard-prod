const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const userAuth = require("../../middleware/userAuth");
const AppError = require("../../appError/appError");
const User = require("../../model/user/user");
const Authorize = require("../../middleware/authorization");
const QAInfoBank = require("../../model/informationBank/infoBankQ&A");
const { Op } = require("sequelize");
const findByIdAndCheckExistence = require("../../util/findById");
const InformationBank = require("../../model/informationBank/informationBank");

const router = express.Router();

router.post(
  "/api/info/bank/question",
  userAuth,
  catchAsync(async (req, res, next) => {
    const question = await QAInfoBank.create({
      Q: req.body.question,
      frkUserQ: req.user.id,
      frkInfoBank: req.body.frkInfoBank,
    });

    res.status(201).send(question);
  })
);
// my
router.post(
  "/api/info/bank/answer/:id",
  userAuth,
  catchAsync(async (req, res, next) => {
    const question = await QAInfoBank.findOne({
      where: {
        id: req.params.id,
        A: {
          [Op.is]: null,
        },
      },
    });

    if (!question) return next(new AppError("Question not found"));

    const infoBank = await question.getInformationBank();

    if (infoBank.frkUser != req.user.id)
      return next(new AppError("فقط صاحب بانک اطلاعاتی توانایی پاسخ دادن را دارد", 400));

    await question.update({
      A: req.body.answer,
    });

    res.send();
  })
);
// my
router.delete(
  "/api/info/bank/q-a/delete/:id",
  userAuth,
  catchAsync(async (req, res, next) => {
    const QA = await findByIdAndCheckExistence(QAInfoBank, req.params.id);

    const infoBank = await QA.getInformationBank();

    if (infoBank.frkUser != req.user.id)
      return next(new AppError("Data violation", 400));

    await QA.destroy();

    res.send();
  })
);
// my
router.get(
  "/api/my/info/bank/qas/:id",
  userAuth,
  catchAsync(async (req, res, next) => {
    const checkInfoBank = await InformationBank.findOne({
      where: {
        id: req.params.id,
        frkUser: req.user.id,
      },
    });

    if (!checkInfoBank) return next(new AppError("Info bank not found", 404));
    console.log(checkInfoBank)

    const QAs = await QAInfoBank.findAll({
      where: {
        frkInfoBank: checkInfoBank.id,
      },
    });
    console.log(QAs)

    res.send(QAs);
  })
);

// info bank QAs
router.get(
  "/api/info/bank/qa/all/:id",
  catchAsync(async (req, res, next) => {
    const QAs = await QAInfoBank.findAll({
      where: {
        frkInfoBank: req.params.id,
        A: {
          [Op.ne]: null,
        },
      },
      include: {
        model: User,
        attributes: ["id", "username", "userType", "image"],
      },
    });

    res.send(QAs);
  })
);

// admin only
router.get(
  "/api/info/bank/all/experience",
  userAuth,
  //   Authorize,
  catchAsync(async (req, res, next) => {
    const QAs = await QAInfoBank.findAndCountAll();

    res.send(QAs);
  })
);

module.exports = router;
