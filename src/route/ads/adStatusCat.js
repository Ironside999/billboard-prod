const AppError = require('../../appError/appError');
const catchAsync = require('../../appError/catchAsync');
const CrudWithAuth = require('../../CRUD Class/crudAuth');
const Authorize = require('../../middleware/authorization');
const userAuth = require('../../middleware/userAuth');
const AdStatus = require('../../model/ads/adStatus');
const AdStatusCategory = require('../../model/ads/adStatusCat');

const crud = new CrudWithAuth(AdStatusCategory, 'ad/category/status');

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .findOneRouter()
  .findAllRouter()
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

router.get(
  '/api/ad/category/status/by/frk/:id',
  catchAsync(async (req, res, next) => {
    const adStatus = await AdStatusCategory.findOne({
      where: {
        frkCatC: req.params.id,
      },
      include: {
        model: AdStatus,
      },
    });

    if (!adStatus) return next(new AppError('Category status not found', 404));

    res.send(adStatus);
  })
);

module.exports = router;
