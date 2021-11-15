const AppError = require('../appError/appError');
const findByIdAndCheckExistence = require('../util/findById');
const moment = require('moment');
const VirtualBillboard = require('../model/virtualBillboard/virtualBillboard');
const VirtualBbdCalender = require('../model/virtualBillboard/virtualBillboardCalendar');

const checkBbdCalender = async (req, res, next) => {
  try {
    let bodyStartDate = moment(req.body.startDate).format('L');
    let bodyFinishDate = moment(req.body.finishDate).format('L');

    if (bodyStartDate == 'Invalid date' || bodyFinishDate == 'Invalid date')
      return next(new AppError('Wrong Date', 404));

    const billboard = await findByIdAndCheckExistence(
      VirtualBillboard,
      req.params.id,
      'Billboard Not Found'
    );

    const lastFinishDate = await VirtualBbdCalender.max('finishDate', {
      where: {
        frkVirtualBbd: billboard.id,
      },
    });

    if (lastFinishDate) {
      let startFreeDate = moment(lastFinishDate).add(1, 'd').format('L');

      let realLastDate = moment(lastFinishDate).format('L');

      if (
        new Date(bodyStartDate) > new Date(startFreeDate) ||
        new Date(bodyStartDate) < new Date(realLastDate)
      )
        return next(new AppError('Bad Start Date', 400));
    }

    let checkDuration = moment(req.body.startDate)
      .add(+billboard.maxReserveDays, 'd')
      .isAfter(req.body.finishDate);

    if (!checkDuration) return next(new AppError('Duration is too much', 404));

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkBbdCalender;
