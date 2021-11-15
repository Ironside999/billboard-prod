const AppError = require('../../appError/appError');
const CrudWithAuth = require('../../CRUD Class/crudAuth');
const Authorize = require('../../middleware/authorization');
const userAuth = require('../../middleware/userAuth');
const VirtualBillboard = require('../../model/virtualBillboard/virtualBillboard');
const catchAsync = require('../../appError/catchAsync');
const VirtualBbdCalender = require('../../model/virtualBillboard/virtualBillboardCalendar');
const crud = new CrudWithAuth(VirtualBillboard, 'virtual-billboard');
const moment = require('moment');

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .findOneRouter()
  .findAllRouter()
  .updateRouterWithAuth(userAuth, Authorize)
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

router.post(
  '/api/place/virtual-billboard',
  userAuth,
  catchAsync(async (req, res, next) => {
    if (
      (req.body.frkCatA && req.body.frkCatB) ||
      (req.body.frkCatA && req.body.frkCatC) ||
      (req.body.frkCatB && req.body.frkCatC) ||
      (req.body.frkCatA && req.body.frkCatB && req.body.frkCatC)
    ) {
      return next(new AppError('Only one category should be selected', 400));
    }

    const virtualBbd = await VirtualBillboard.findOne({
      where: {
        ...req.body,
      },
    });

    if (virtualBbd)
      return next(new AppError('Billboard Already selected', 400));

    const newVirtualBbdPlace = await VirtualBillboard.create({ ...req.body });

    res.status(201).send();
  })
);

router.get(
  '/api/check/virtual-billboard',
  userAuth,
  catchAsync(async (req, res, next) => {
    const virtualBbd = await VirtualBillboard.findOne({
      where: {
        ...req.query,
      },
    });

    if (!virtualBbd) return next(new AppError('not found any billboard', 404));

    let lastFinishDate = await VirtualBbdCalender.max('finishDate', {
      where: {
        frkVirtualBbd: virtualBbd.id,
      },
    });

    if (lastFinishDate) {
      lastFinishDate = moment(lastFinishDate).add(1, 'd').format();
    } else {
      lastFinishDate = moment().format();
    }

    res.send({ virtualBbd, lastFinishDate });
  })
);

module.exports = router;
