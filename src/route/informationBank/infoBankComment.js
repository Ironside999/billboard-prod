const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const checkExistenceAndRemove = require("../../util/removeById");
const userAuth = require("../../middleware/userAuth");
const AppError = require("../../appError/appError");
const User = require("../../model/user/user");
const InfoBankComment = require("../../model/informationBank/infoBankComment");
const Authorize = require("../../middleware/authorization");
const InformationBank = require("../../model/informationBank/informationBank");

const router = express.Router();

router.post(
  "/api/info/bank/comment/add",
  userAuth,
  catchAsync(async (req, res, next) => {
    const infoBank = await InformationBank.findByPk(req.body.frkInfoBank)
    const infoBankComment = await InfoBankComment.findByPk(req.body.infoBankComment)

    if (infoBank && infoBankComment)
      return next(new AppError("BAD REQUEST", 400));

    if (!infoBank && !infoBankComment)
      return next(new AppError("BAD REQUEST", 400));

    const comment = await InfoBankComment.create({
      comment: req.body.comment,
      frkUser: req.user.id,
      parentComment: infoBankComment?.id,
      frkInformationBank: infoBank?.id,
    });

    res.status(201).send(comment);
  })
);

//admin only
router.delete(
  "/api/info/bank/comment/delete/:id",
  userAuth,
  Authorize,
  catchAsync(async (req, res, next) => {
    const comment = await checkExistenceAndRemove(
      InfoBankComment,
      req.params.id
    );

    res.send();
  })
);

// router.get(
//   "/api/info/bank/comment/get-one/:id",
//   catchAsync(async (req, res, next) => {
//     const comment = await InfoBankComment.findByPk(req.params.id, {
//       include: [
//         {
//           model: User,
//           attributes: ["id", "username", "userType", "image"],
//         },
//         {
//           model: InfoBankComment,
//           include: {
//             model: User,
//             attributes: ["id", "username", "userType", "image"],
//           },
//         },
//       ],
//     });



router.get(
  "/api/info/bank/comment/get-one/:id",
  catchAsync(async (req, res, next) => {
    const comment = await InfoBankComment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "userType", "image"],
        },
      ],
    });







    if (!comment) return next(new AppError("commnet not found", 404));

    const child = await InfoBankComment.findAll({
      where: {parentComment: comment.id},
      include: [
        {
          model: User,
          attributes: ["id", "username", "userType", "image"],

        }
      ]
    })


    res.send({comment, child});
  })
);

// info bank comments
router.get(
  "/api/info/bank/comments/:id",
  catchAsync(async (req, res, next) => {
    const comments = await InfoBankComment.findAll({
      where: {
        frkInformationBank: req.params.id,
      },
      include: {
        model: User,
        attributes: ["id", "username", "userType", "image"],
      },
    });

    res.send(comments);
  })
);


// admin only
router.get(
  "/api/info/bank/all/comments",
  userAuth,
  Authorize,
  catchAsync(async (req, res, next) => {
    const comments = await InfoBankComment.findAndCountAll();

    res.send(comments);
  })
);

module.exports = router;
