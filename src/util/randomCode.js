const crypto = require("crypto");
const AppError = require("../appError/appError");

const generateRandomCode = async (any) => {
  const randomCode = await new Promise((res, rej) => {
    crypto.randomBytes(any, (err, code) => {
      if (err) {
        rej(new AppError("CODE GENERATION FAILED", 500));
      }
      res(code);
    });
  });

  return randomCode.toString("hex");
};

module.exports = generateRandomCode;
