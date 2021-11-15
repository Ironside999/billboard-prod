const CrudWithAuthAndImg = require('../../CRUD Class/crudAuthImg');
const Authorize = require('../../middleware/authorization');
const userAuth = require('../../middleware/userAuth');
const VirtualBbdDesign = require('../../model/virtualBillboard/virtualBillboardDesign');

const crud = new CrudWithAuthAndImg(
  VirtualBbdDesign,
  'virtual-billboard/design'
);

const router = crud
  .postRouterWithAuthAndImage(userAuth, Authorize)
  .findOneRouter()
  .findByFrkRouter('frkVirtualBbd')
  .updateRouterWithAuthAndImage(userAuth, Authorize)
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

module.exports = router;
