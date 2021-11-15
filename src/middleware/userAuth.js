const User = require("../model/user/user");
const jwt = require("jsonwebtoken");
const AppError = require("../appError/appError");

const userAuth = async (req, res, next) => {
  try {
    let { jWt } = req.cookies;

    jwt.verify(jWt, process.env.USER_SECRET, async (err, decode) => {
      if (err) {
        return next(new AppError("Unauthorized", 401));
      }
      try {
        const user = await User.findOne({
          where: { id: decode.id, active: 1 },
        });
        if (!user) {
          return next(new AppError("User Not Found", 404));
        }
        req.user = user;
        req.token = jWt;
        next();
      } catch (err) {
        console.log(err);
        return next(new AppError("BAD REQUEST", 400));
      }
    });
  } catch (err) {
    return next(new AppError("BAD REQUEST", 400));
  }
};

module.exports = userAuth;
