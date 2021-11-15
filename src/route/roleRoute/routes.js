const Route = require("../../model/roleRoute/routes");
const RouteCategory = require("../../model/roleRoute/routesCategory");
const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const createNewRecord = require("../../util/createNewRecord");
const findByIdAndCheckExistence = require("../../util/findById");
const checkExistenceAndRemove = require("../../util/removeById");

const router = new express.Router();

router.post(
  "/api/route/add",
  catchAsync(async (req, res, next) => {
    const frkRouteCat = await findByIdAndCheckExistence(
      RouteCategory,
      req.body.frkRouteCategory,
      "CATEGORY ROUTE ID NOT FOUND"
    );

    const route = await createNewRecord(
      Route,
      ({ path, title, frkRouteCategory } = req.body)
    );

    res.status(201).send(route);
  })
);

router.delete(
  "/api/route/delete/:id",
  catchAsync(async (req, res, next) => {
    const route = await checkExistenceAndRemove(Route, req.params.id);

    res.send();
  })
);

router.get(
  "/api/route/:id",
  catchAsync(async (req, res, next) => {
    const route = await findByIdAndCheckExistence(Route, req.params.id);

    const relatedRoles = await route.getRoles({
      joinTableAttributes: [],
    });

    res.send({ route, relatedRoles });
  })
);

router.get(
  "/api/routes",
  catchAsync(async (req, res, next) => {
    const routes = await Route.findAll();

    res.send(routes);
  })
);

module.exports = router;
