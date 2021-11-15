const CrudWithAuth = require('../../CRUD Class/crudAuth');
const Authorize = require('../../middleware/authorization');
const userAuth = require('../../middleware/userAuth');
const Keyword = require('../../model/keyword/keyword');

const crud = new CrudWithAuth(Keyword, 'keyword');

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .findOneRouter()
  .findByFrkRouter('frkCatB')
  .findAllFeaturedRouterWithAuth(userAuth, Authorize)
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

module.exports = router;
