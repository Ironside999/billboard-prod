const express = require("express");
const userAuth = require("../../middleware/userAuth");
const User = require("../../model/user/user");
const catchAsync = require("../../appError/catchAsync");
const { sendVerifyCode } = require("../../util/sendEmail");
const generateRandomCode = require("../../util/randomCode");

const router = new express.Router();

router.post(
  "/api/vip/sign/user",
  userAuth,
  // Authorize,
  catchAsync(async (req, res, next) => {
    const emailCode = await generateRandomCode(3);

    const mobileCode = await generateRandomCode(3);

    const temporaryPassword = await generateRandomCode(4);

    const user = User.build({
      email: req.body.email,
      password: temporaryPassword,
      mobile: req.body.mobile,
      username: req.body.username,
      emailGeneratedCode: emailCode,
      emailExpireTime: Date.now() + 900000,
      mobileGeneratedCode: mobileCode,
      mobileExpireTime: Date.now() + 900000,
      frkRole: req.body.frkRole,
    });

    // SEND MESSAGE TO MOBILE NUMBER
    // await sendVerifyCode(user.email, emailCode);

    await user.save();

    res.status(201).send({ user, temporaryPassword });
  })
);

module.exports = router;
