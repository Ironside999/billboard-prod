const CrudWithAuth = require("../../CRUD Class/crudAuth");
const Authorize = require("../../middleware/authorization");

const userAuth = require("../../middleware/userAuth");
const InfoBankPackage = require("../../model/informationBank/informationBankPackage");

const crud = new CrudWithAuth(InfoBankPackage, "info-bank/package");

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .updateRouterWithAuth(userAuth, Authorize)
  .findOneRouter()
  .findAllRouter()
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

module.exports = router;
