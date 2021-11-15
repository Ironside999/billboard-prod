const CrudWithAuth = require("../../CRUD Class/crudAuth");
const Authorize = require("../../middleware/authorization");
const userAuth = require("../../middleware/userAuth");
const BbdFinderType = require("../../model/billboardFinder/bbdFinderType");

const crud = new CrudWithAuth(BbdFinderType, "billboard-finder-type");

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .findOneRouter()
  .findAllRouter()
  .updateRouterWithAuth(userAuth, Authorize)
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

module.exports = router;
