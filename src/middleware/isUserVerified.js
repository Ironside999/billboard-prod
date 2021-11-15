const AppError = require('../appError/appError');

const isUserVerified = (req, res, next) => {
  if (+req.user.emailVerified || +req.user.mobileVerified) {
    next();
  } else {
    next(new AppError('USER IS NOT VERIFIED', 401));
  }
};

module.exports = isUserVerified;
