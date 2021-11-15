const CrudWithAuth = require('../../CRUD Class/crudAuth');
const Authorize = require('../../middleware/authorization');
const userAuth = require('../../middleware/userAuth');
const BbdFinderSize = require('../../model/billboardFinder/bbdFinderSize');

const crud = new CrudWithAuth(BbdFinderSize, 'billboard-finder-size');

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .findOneRouter()
  .findAllRouter()
  .updateRouterWithAuth(userAuth, Authorize)
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

module.exports = router;
