const BbdFinderComment = require('../../model/billboardFinder/bbdFinderComment');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const AppError = require('../../appError/appError');
const userAuth = require('../../middleware/userAuth');
const BillboardFinder = require('../../model/billboardFinder/billboardFinder');
const BbdFinderLike = require('../../model/billboardFinder/bbdFinderLike');
const User = require('../../model/user/user');

const router = new express.Router();

router.post(
  '/api/bbdFinder/comment/add',
  userAuth,
  catchAsync(async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const bbdFinder = await BillboardFinder.findByPk(
      req.body.frkBillboardFinder
    );
    const bbdFinderComment = await BbdFinderComment.findByPk(
      req.body.bbdFinderComment
    );

    if (bbdFinder && bbdFinderComment)
      return next(new AppError('BAD REQUEST', 400));

    if (!bbdFinder && !bbdFinderComment)
      return next(new AppError('BAD REQUEST', 400));

    const comment = await BbdFinderComment.create({
      frkUser: req.user.id,
      comment: req.body.comment,
      frkBbdFinder: bbdFinder?.id,
      parentComment: bbdFinderComment?.id,
    });

    res.status(201).send({ comment });
  })
);

router.get(
  '/api/bbdFinder/comment/get-one/:id',
  catchAsync(async (req, res, next) => {
    const comment = await BbdFinderComment.findByPk(req.params.id, {
      include: {
        model: User,
      },
    });
    if (!comment) {
      return next(new AppError('کامنت مورد نظر یافت نشد', 404));
    }
    console.log(err);
    // const x = await comment.getUser();
    res.status(200).send({ comment });
  })
);

//if confirm added to this project this route is Admin's route
router.get('/api/bbdFinder/comment/all', async (req, res, next) => {
  try {
    const where = { ...req.query };

    const excludeFields = ['offset', 'order', 'limit', 'attributes', 'group'];

    excludeFields.forEach((itm) => delete where[itm]);

    let exclude = [];

    if (req.query.attributes && typeof req.query.attributes == 'string') {
      exclude = req.query.attributes.split(',');
    }

    let order = [];

    if (req.query.order && typeof req.query.order == 'string') {
      let sort = [];

      if (req.query.order.includes(';')) {
        sort = req.query.order.split(';');
        sort = sort.map((itm) => {
          return itm.split(',');
        });

        order = sort;
      } else {
        sort = req.query.order.split(',');
        order.push(sort);
      }
    }

    let limit = 10;
    let offset = 0;

    if (req.query.offset && req.query.limit) {
      offset = +req.query.offset || 0;
      limit = +req.query.limit || 5;
    }

    const comments = await BbdFinderComment.findAndCountAll({
      attributes: { exclude },
      where,
      order,
      limit,
      offset,
    });

    res.send({ comments });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get(
  '/api/bbdFinder/comment/all/by/bbdFinder/:id',
  catchAsync(async (req, res, next) => {
    const comments = await BbdFinderComment.findAll({
      where: { frkBbdFinder: req.params.id },
    });
    res.status(200).send({ comments });
  })
);

router.delete(
  '/api/bbdFinder/comment/delete/:id',
  catchAsync(async (req, res, next) => {
    const comment = await BbdFinderComment.findByPk(req.params.id);
    await comment.destroy();
    res.status(200).send({});
  })
);

router.patch(
  '/api/bbdFinder/comment/like/add/:id',
  catchAsync(async (req, res, next) => {
    const currentIp = req.headers['x-forwarded-for'] || req.ip;

    const comment = await BbdFinderComment.findByPk(req.params.id);
    if (!comment) {
      return next(new AppError('کامنت مورد نظر یافت نشد', 404));
    }

    const checkIp = await BbdFinderLike.findOne({
      where: { ip: currentIp, frkComment: comment.id },
    });
    if (checkIp) {
      return next(new AppError('شما فقط یکبار مجاز به امتیاز دادن هستید', 400));
    }

    const likeRecord = await BbdFinderLike.create({
      ip: currentIp,
      frkComment: comment.id,
    });
    res.status(200).send({});
  })
);

router.delete(
  '/api/bbdFinder/comment/dislike/:id',
  catchAsync(async (req, res, next) => {
    const currentIp = req.headers['x-forwarded-for'] || req.ip;

    const like = await BbdFinderLike.findOne({
      where: { frkComment: req.params.id, ip: currentIp },
    });
    if (!like) {
      return next(
        new AppError('شما قبلا رای نداده اید یا کامنت مورد نظر وجود ندارد', 400)
      );
    }
    const dislike = await like.destroy();
    res.status(200).send({});
  })
);

router.get(
  '/api/bbdFinder/comment/like/count/:id',
  catchAsync(async (req, res, next) => {
    const likeCounter = await BbdFinderLike.count({
      where: {
        frkComment: req.params.id,
      },
    });
    if (!likeCounter) {
      return next(new AppError('کامنت مورد نظر وجود ندارد', 404));
    }
    res.status(200).send({ likeCounter });
  })
);

router.get(
  '/api/bbdFinder/comments/by/comment/all/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const comment = await BbdFinderComment.findOne({
      where: { id: req.params.id },
      include: {
        model: User,
      },
    });
    if (!comment) {
      return next(new AppError('کامنت مورد نظر وجود ندارد', 404));
    }

    res.status(200).send(comment);
  })
);

module.exports = router;
