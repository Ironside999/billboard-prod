const Ticket = require("../../model/ticket/ticket");
const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const createNewRecord = require("../../util/createNewRecord");
const findByIdAndCheckExistence = require("../../util/findById");
const checkExistenceAndRemove = require("../../util/removeById");
const userAuth = require("../../middleware/userAuth");
const APIFeatures = require("../../apiFeatures/apiFeature");

const router = new express.Router();


router.post(
  "/api/ticket/add",
  userAuth,
  catchAsync(async (req, res, next) => {
    const ticket = await createNewRecord(Ticket, {
      message: req.body.message,
      frkUser: req.user.id,
      frkTicketCategory: req.body.frkTicketCategory,
    });

    res.status(201).send();
  })
);


// admin only
router.patch(
  "/api/ticket/update/:id",
  catchAsync(async (req, res, next) => {
    const ticket = await findByIdAndCheckExistence(Ticket, req.params.id);

    const safteyExcluded = ["frkUser", "message"];

    const body = { ...req.body };

    safteyExcluded.forEach((itm) => delete body[itm]);

    const updatedTicket = await ticket.update(body);

    res.send();
  })
);

router.delete(
  "/api/ticket/delete/:id",
  userAuth,
  catchAsync(async (req, res, next) => {
    const ticket = await checkExistenceAndRemove(Ticket, req.params.id);

    res.send();
  })
);

//admin only
router.get(
  "/api/ticket/:id",
  catchAsync(async (req, res, next) => {
    const ticket = await findByIdAndCheckExistence(Ticket, req.params.id);

    const user = await ticket.getUser();

    res.send({ ticket, user });
  })
);

//admin only
router.get(
  "/api/tickets",
  catchAsync(async (req, res, next) => {
    const { where, include, order, limit, offset } = APIFeatures(req.query);

    const tickets = await Ticket.findAndCountAll({
      attributes: include,
      where,
      order,
      limit,
      offset,
    });

    res.send(tickets);
  })
);

module.exports = router;
