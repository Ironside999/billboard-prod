const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const AppError = require('../../appError/appError');
const Authorize = require('../../middleware/authorization');
const userAuth = require('../../middleware/userAuth');
const VirtualBillboardReq = require('../../model/virtualBillboard/VirtualBillboardRequest');

const router = express.Router();

router.post(
  '/api/request/virtual-billboard',
  userAuth,
  catchAsync(async (req, res, next) => {
    const newBbdReq = await VirtualBillboardReq.create({
      ...req.body,
      frkUser: req.user.id,
    });

    res.status(201).send();
  })
);

module.exports = router;
