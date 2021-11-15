const CrudWithAuth = require('../../CRUD Class/crudAuth');
const Authorize = require('../../middleware/authorization');
const userAuth = require('../../middleware/userAuth');
const SocialNetwok = require('../../model/informationBank/socialNetwok');

const crud = new CrudWithAuth(SocialNetwok, 'social/network');

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .updateRouterWithAuth(userAuth, Authorize)
  .findOneRouter()
  .findAllRouter()
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

module.exports = router;
