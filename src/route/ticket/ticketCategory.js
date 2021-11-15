const TicketCategory = require('../../model/ticket/ticketCategory');
const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const createNewRecord = require('../../util/createNewRecord');
const findByIdAndCheckExistence = require('../../util/findById');
const checkExistenceAndRemove = require('../../util/removeById');

const router = new express.Router();

//admin only
router.post(
  '/api/ticketCategory/add',
  catchAsync(async (req, res, next) => {
    const ticketCategory = await createNewRecord(TicketCategory, {
      ticketCategory: req.body.ticketCategory,
    });

    res.status(201).send(ticketCategory);
  })
);

//admin only
router.delete(
  '/api/ticketCategory/delete/:id',
  catchAsync(async (req, res, next) => {
    const ticketCategory = await checkExistenceAndRemove(
      TicketCategory,
      req.params.id
    );

    res.status(200).send();
  })
);

router.get(
  '/api/ticketCategory/:id',
  catchAsync(async (req, res, next) => {
    const ticketCategory = await findByIdAndCheckExistence(
      TicketCategory,
      req.params.id
    );

    res.send({ ticketCategory });
  })
);

router.get(
  '/api/ticketCategories',
  catchAsync(async (req, res, next) => {
    const ticketCategories = await TicketCategory.findAll();

    res.send(ticketCategories);
  })
);

module.exports = router;
