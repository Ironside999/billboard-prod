const APIFeatures = require("../../apiFeatures/apiFeature");
const catchAsync = require("../../appError/catchAsync");
const CrudWithAuth = require("../../CRUD Class/crudAuth");
const Authorize = require("../../middleware/authorization");
const userAuth = require("../../middleware/userAuth");
const Ad = require("../../model/ads/ad");
const AdViolation = require("../../model/ads/adViolation");

const crud = new CrudWithAuth(AdViolation, "ad/violation");

const router = crud
  .findOneRouterWithAuth(userAuth, Authorize)
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

router.post(
  "/api/report/ad/violation",
  userAuth,
  catchAsync(async (req, res, next) => {
    const newReport = await AdViolation.create({
      ...req.body,
      frkUser: req.user.id,
    });

    res.send();
  })
);

router.get(
  "/api/ad/violations",
  userAuth,
  catchAsync(async (req, res, next) => {
    let { where, order, limit, offset } = APIFeatures(req.query);

    const reports = await AdViolation.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    res.send(reports);
  })
);

router.get(
  "/api/ad/violation/for/ad/:id",
  userAuth,
  catchAsync(async (req, res, next) => {
    const report = await AdViolation.findByPk(req.params.id, {
      include: {
        model: Ad,
        attributes: ["id", "title", "description", "img0"],
      },
    });

    res.send(report);
  })
);

module.exports = router;
