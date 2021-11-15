const CrudWithAuth = require('../../CRUD Class/crudAuth');
const Authorize = require('../../middleware/authorization');
const userAuth = require('../../middleware/userAuth');
const BbdFinderDuration = require('../../model/billboardFinder/bbdFinderDuration');

const crud = new CrudWithAuth(BbdFinderDuration, 'billboard-finder-duration');

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .findOneRouter()
  .findAllRouter()
  .updateRouterWithAuth(userAuth, Authorize)
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

module.exports = router;
