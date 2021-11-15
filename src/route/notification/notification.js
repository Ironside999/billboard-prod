const express = require('express');
const User = require('../../mongooseSchema/user/UserSchema');
const Notification = require('../../mongooseSchema/notification/NotificationSchema');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');
const AppError = require('../../appError/appError');

const router = new express.Router();

router.get(
  '/api/my/notifications',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    var searchObj = {
      userTo: user._id,
    };

    if (req.query.unreadOnly !== undefined && req.query.unreadOnly == 'true') {
      searchObj.opened = false;
    }

    const notifications = await Notification.find(searchObj)
      .populate('userTo')
      .populate('userFrom')
      .sort({ createdAt: -1 });

    res.send(notifications);
  })
);

router.get('/api/notifications/count', userAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    const total = await Notification.countDocuments({
      userTo: user._id,
      opened: false,
    });

    res.send({ total });
  } catch (err) {
    res.status(400).send({ err });
  }
});

router.put(
  '/api/open/notification/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    await Notification.findByIdAndUpdate(req.params.id, { opened: true });

    res.send({});
  })
);

router.get(
  '/api/open/notifications',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    await Notification.updateMany({ userTo: user._id }, { opened: true });

    res.send({});
  })
);

module.exports = router;
