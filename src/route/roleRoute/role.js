const Role = require("../../model/roleRoute/role");
const Route = require("../../model/roleRoute/routes");
const JuncRoleRoute = require("../../model/roleRoute/juncRoleRoute");

const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const AppError = require("../../appError/appError");
const createNewRecord = require("../../util/createNewRecord");
const findByIdAndCheckExistence = require("../../util/findById");
const checkExistenceAndRemove = require("../../util/removeById");
const userAuth = require("../../middleware/userAuth");

const router = new express.Router();

router.post(
  "/api/role/add",
  catchAsync(async (req, res, next) => {
    const billboardAdminRole = await Role.findByPk(1);

    // SAFETY CREATION-----------------------------------------------------------(removable)

    if (!billboardAdminRole) {
      await Role.create({
        role: "Billboard_Admin",
        roleType: "1",
      });
    }

    const billboardUser = await Role.findByPk(2);

    if (!billboardUser) {
      await Role.create({
        role: "Billboard_User",
        roleType: "2",
      });
    }

    //---------------------------------------------------------------------------

    const newRole = await createNewRecord(
      Role,
      ({ role, roleType } = req.body)
    );

    res.status(201).send(newRole);
  })
);

router.delete(
  "/api/role/delete/:id",
  catchAsync(async (req, res, next) => {
    if (req.params.id == 1 || req.params.id == 2)
      return next(new AppError("NOT ALLOWED TO REMOVE ID", 400));

    const role = await checkExistenceAndRemove(Role, req.params.id);

    res.send();
  })
);

router.get(
  "/api/role/:id",
  catchAsync(async (req, res, next) => {
    const role = await findByIdAndCheckExistence(Role, req.params.id);

    const relatedRoutes = await role.getRoutes({
      joinTableAttributes: [],
    });

    res.send({ role, relatedRoutes });
  })
);

router.get(
  "/api/roles",
  userAuth,
  catchAsync(async (req, res, next) => {
    const roles = await Role.findAll();

    res.send(roles);
  })
);

router.patch(
  "/api/role/set/route/:id",
  catchAsync(async (req, res, next) => {
    const role = await findByIdAndCheckExistence(Role, req.params.id);

    if (!Array.isArray(req.body.idz) || !req.body.idz.length) {
      return next(new AppError("EACH ROLE SHOULD HAVE SOME ROUTES", 400));
    }

    await Promise.all(
      req.body.idz.map(async (itm) => {
        try {
          const route = await findByIdAndCheckExistence(
            Route,
            itm,
            "ROUTE ID NOT FOUND"
          );
        } catch (err) {
          throw err;
        }
      })
    );

    await Promise.all(
      req.body.idz.map(async (itm) => {
        try {
          await createNewRecord(JuncRoleRoute, {
            frkRole: role.id,
            frkRoute: itm,
          });
        } catch (err) {
          throw err;
        }
      })
    );

    res.send();
  })
);

router.patch(
  "/api/role/drop/route/:id",
  catchAsync(async (req, res, next) => {
    const role = await findByIdAndCheckExistence(Role, req.params.id);

    if (!Array.isArray(req.body.idz) || !req.body.idz.length) {
      return next(new AppError("EACH ROLE SHOULD HAVE SOME ROUTES", 400));
    }

    await Promise.all(
      req.body.idz.map(async (itm) => {
        try {
          const route = await findByIdAndCheckExistence(
            Route,
            itm,
            "ROUTE ID NOT FOUND"
          );
        } catch (err) {
          throw err;
        }
      })
    );

    await Promise.all(
      req.body.idz.map(async (itm) => {
        try {
          const deletedRelation = await JuncRoleRoute.destroy({
            where: {
              frkRole: role.id,
              frkRoute: itm,
            },
          });

          if (!deletedRelation) throw new AppError("RELATION NOT FOUND", 404);
        } catch (err) {
          throw err;
        }
      })
    );

    res.send();
  })
);

module.exports = router;
