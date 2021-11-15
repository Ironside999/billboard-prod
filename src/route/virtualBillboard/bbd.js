const { Op } = require('sequelize');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
// const AppError = require("../../appError/appError");
const VirtualBillboard = require('../../model/virtualBillboard/virtualBillboard');
const VirtualBbdCalender = require('../../model/virtualBillboard/virtualBillboardCalendar');
const VirtualBbdRecord = require('../../model/virtualBillboard/virtualBillboardRecord');
const findByIdAndCheckExistence = require('../../util/findById');
const AppError = require('../../appError/appError');

const router = new express.Router();

router.get(
  '/api/virtual/billboard/here',
  catchAsync(async (req, res, next) => {
    const where = { ...req.query };

    const excludeFields = ['offset', 'order', 'limit', 'attributes', 'group'];

    excludeFields.forEach((itm) => delete where[itm]);

    const bbd = await VirtualBillboard.findOne({
      where,
    });

    if (bbd) {
      const data = await VirtualBbdCalender.findOne({
        where: {
          frkVirtualBbd: bbd.id,
          punish: 0,
          startDate: {
            [Op.lt]: Date.now(),
          },
          finishDate: {
            [Op.gt]: Date.now(),
          },
        },
      });

      if (data) {
        const ip = req.headers['x-forwarded-for'] || req.ip;

        const bbdRecord = await VirtualBbdRecord.findOne({
          where: {
            recordType: 0,
            ip,
            frkBbdCalender: data.id,
          },
        });

        if (!bbdRecord) {
          const newBbdRecord = await VirtualBbdRecord.create({
            recordType: 0,
            ip,
            frkBbdCalender: data.id,
          });

          const user = await data.getUser();

          const balance = await user.getBalance();

          let dec = +bbd.pricePerVisit - +bbd.pricePerVisitDiscount;

          if (dec > +balance.balance) {
            await data.update({ punish: 1 });
          }

          await balance.decrement('balance', { by: dec });
        }

        return res.send(data);
      }
    }

    res.status(404).send();
  })
);

router.post(
  '/api/virtual/billboard/click/:id',
  catchAsync(async (req, res, next) => {
    const bbd = await findByIdAndCheckExistence(
      VirtualBbdCalender,
      req.params.id
    );

    if (!bbd || bbd.punish == 1)
      return next(new AppError('Virtual Bbd not found', 404));
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const billboard = await VirtualBillboard.findByPk(bbd.frkVirtualBbd);

    const newBbdRecord = await VirtualBbdRecord.create({
      recordType: 1,
      ip,
      frkBbdCalender: bbd.id,
    });

    const user = await bbd.getUser();

    const balance = await user.getBalance();

    let dec = +billboard.pricePerClick - +billboard.pricePerClickDiscount;

    if (dec > +balance.balance) {
      await bbd.update({ punish: 1 });
    }

    await balance.decrement('balance', { by: dec });

    res.send();
  })
);

router.get(
  '/api/virtual/billboard/last-available-date/:id',
  catchAsync(async (req, res, next) => {
    const billboard = await findByIdAndCheckExistence(
      VirtualBillboard,
      req.params.id
    );

    const lastFinishDate = await VirtualBbdCalender.max('finishDate', {
      where: {
        frkVirtualBbd: billboard.id,
      },
    });

    res.send(lastFinishDate);
  })
);

module.exports = router;
