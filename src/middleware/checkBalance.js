const AppError = require("../appError/appError");

const checkBalance = async (req, res, next) => {
  try {
    const userBalance = await req.user.getBalance();

    if (userBalance.balance < 100000)
      return next(new AppError("NOT ENOUGH CREDIT", 400));

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkBalance;
