const RouteCategory = require("../../model/roleRoute/routesCategory");
const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const createNewRecord = require("../../util/createNewRecord");
const findByIdAndCheckExistence = require("../../util/findById");
const checkExistenceAndRemove = require("../../util/removeById");

const router = new express.Router();

router.post(
  "/api/route-category/add",
  catchAsync(async (req, res, next) => {
    const routeCategory = await createNewRecord(RouteCategory, {
      title: req.body.title,
    });

    res.status(201).send(routeCategory);
  })
);

router.delete(
  "/api/route-category/delete/:id",
  catchAsync(async (req, res, next) => {
    const routeCategory = await checkExistenceAndRemove(
      RouteCategory,
      req.params.id
    );

    res.send();
  })
);

router.get(
  "/api/route-category/:id",
  catchAsync(async (req, res, next) => {
    const routeCategory = await findByIdAndCheckExistence(
      RouteCategory,
      req.params.id
    );

    const routes = await routeCategory.getRoutes();

    res.send({ routeCategory, routes });
  })
);

router.get(
  "/api/route-categories",
  catchAsync(async (req, res, next) => {
    const routeCategories = await RouteCategory.findAll();

    res.send(routeCategories);
  })
);

module.exports = router;
