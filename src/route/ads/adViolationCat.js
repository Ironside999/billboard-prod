const CrudWithAuth = require("../../CRUD Class/crudAuth");
const Authorize = require("../../middleware/authorization");
const userAuth = require("../../middleware/userAuth");
const AdViolationCategory = require("../../model/ads/adViolationCat");

const crud = new CrudWithAuth(AdViolationCategory, "ad/violation-category");

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .findAllRouter()
  .findOneRouter()
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

module.exports = router;
