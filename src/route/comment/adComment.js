const express = require('express');
const Comment = require('../../model/comment/comment');
const catchAsync = require('../../appError/catchAsync');
const findByIdAndCheckExistence = require('../../util/findById');
const checkExistenceAndRemove = require('../../util/removeById');
const userAuth = require('../../middleware/userAuth');
const AppError = require('../../appError/appError');
// const Ad = require("../../model/ads/ad");
const User = require('../../model/user/user');
const Authorize = require('../../middleware/authorization');

const router = express.Router();

router.post(
  '/api/ad/comment/add',
  userAuth,
  catchAsync(async (req, res, next) => {
    const role = await req.user.getRole();

    if (req.body.frkAd && req.body.parentComment)
      return next(new AppError('BAD REQUEST', 400));

    if (!req.body.frkAd && !req.body.parentComment)
      return next(new AppError('BAD REQUEST', 400));

    const comment = await Comment.create({
      ...req.body,
      role: role.id,
      frkUser: req.user.id,
    });

    res.status(201).send(comment);
  })
);

//admin only
router.delete(
  '/api/ad/comment/delete/:id',
  userAuth,
  // Authorize,
  catchAsync(async (req, res, next) => {
    const comment = await checkExistenceAndRemove(Comment, req.params.id);

    res.send({});
  })
);

router.get(
  '/api/ad/comment/:id',
  catchAsync(async (req, res, next) => {
    const comment = await Comment.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ['id', 'username', 'userType', 'image'],
      },
    });

    if (!comment) return next(new AppError('commnet not found', 404));

    const subComments = await comment.getComments({
      include: {
        model: User,
        attributes: ['id', 'username', 'userType', 'image'],
      },
    });

    res.send({ comment, subComments });
  })
);

// ads comments
router.get(
  '/api/ad/comments/:id',
  catchAsync(async (req, res, next) => {
    const comments = await Comment.findAll({
      where: {
        frkAd: req.params.id,
      },
      include: {
        model: User,
        attributes: ['id', 'username', 'userType', 'image'],
      },
    });

    res.send(comments);
  })
);

// admin only
router.get(
  '/api/ad/all/comments',
  userAuth,
  // Authorize,
  catchAsync(async (req, res, next) => {
    const comments = await Comment.findAndCountAll();

    res.send(comments);
  })
);

module.exports = router;
