const CrudWithAuth = require("../../CRUD Class/crudAuth");
const Authorize = require("../../middleware/authorization");
const userAuth = require("../../middleware/userAuth");
const BbdFinderPackage = require("../../model/billboardFinder/bbdFinderPackage");

const crud = new CrudWithAuth(BbdFinderPackage, "billboard-finder-package");

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .findOneRouter()
  .findAllRouter()
  .updateRouterWithAuth(userAuth, Authorize)
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

module.exports = router;














































