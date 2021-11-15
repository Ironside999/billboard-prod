const CrudWithAuth = require("../../CRUD Class/crudAuth");
const Authorize = require("../../middleware/authorization");
const userAuth = require("../../middleware/userAuth");
const ViolationCategory = require("../../model/violation/violationCategory");

const crud = new CrudWithAuth(ViolationCategory, "category/violation");

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  // .postRouterWithAuth(Authorize)
  .findAllRouter()
  .updateRouterWithAuth(Authorize)
  .deleteRouterWithAuth(Authorize)
  .readyRouter();

module.exports = router;
