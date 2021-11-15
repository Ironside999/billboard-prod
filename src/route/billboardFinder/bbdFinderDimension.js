const CrudWithAuth = require('../../CRUD Class/crudAuth');
const Authorize = require('../../middleware/authorization');
const userAuth = require('../../middleware/userAuth');
const BbdFinderDimension = require('../../model/billboardFinder/bbdFinderDimension');

const crud = new CrudWithAuth(BbdFinderDimension, 'billboard-finder-dimension');

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .findOneRouter()
  .findAllRouter()
  .updateRouterWithAuth(userAuth, Authorize)
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

module.exports = router;
