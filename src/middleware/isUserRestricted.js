const AppError = require("../appError/appError");

const isUserRestriced = (req, res, next) => {
  if (req.user.isRestricted) {
    next();
  } else {
    next(new AppError("USER IS RESTRICTED", 401));
  }
};

module.exports = isUserRestriced;
