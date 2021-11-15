const express = require('express');
const userAuth = require('../../middleware/userAuth');
const User = require('../../model/user/user');
const UserSchema = require('../../mongooseSchema/user/UserSchema');
const { Op } = require('sequelize');
const AppError = require('../../appError/appError');
const catchAsync = require('../../appError/catchAsync');
const { sendShit, sendResetPassword } = require('../../util/sendEmail');
const generateRandomCode = require('../../util/randomCode');
const isUserVerified = require('../../middleware/isUserVerified');
const isUserRestriced = require('../../middleware/isUserRestricted');
const bcrypt = require('bcryptjs');
const Authorize = require('../../middleware/authorization');
const APIFeatures = require('../../apiFeatures/apiFeature');
const UserNetwork = require('../../model/userNetwork/userNetwork');
const findByIdAndCheckExistence = require('../../util/findById');
const Score = require('../../model/score/score');
const Invite = require('./../../model/Invite/Invite');
const crypto = require('crypto');
const cookieSetter = require('../../util/setCookie');
const Balance = require('../../model/balance/balance');
const { sendVerifySms, sendResetSms } = require('../../util/sendSms');
const passport = require('passport');
const SupportUser = require('../../model/supportUser/supportUser');

const router = new express.Router();

//==============================================================================================
//==============================++++++SIGN UP USER++++++========================================
//==============================================================================================

router.post(
  '/api/user/signup',
  catchAsync(async (req, res, next) => {
    let date = Date.now();

    const emailCode = req.body.email && (await generateRandomCode(3));

    const mobileCode = req.body.mobile && (await generateRandomCode(3));

    const frkRole = 2;
    // frkRole in this controller should only be 2 (normal users can sign in this route)

    const mins = await SupportUser.min('userCount')
    console.log(mins)
    

    const supportUser = await SupportUser.findOne({
      where: {
        userCount: mins || 0
      }
    })
    console.log(supportUser)
    console.log(supportUser?.id)

    const user = User.build({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      mobile: req.body.mobile,
      emailGeneratedCode: emailCode || null,
      emailExpireTime: emailCode ? date + 180000 : null,
      mobileGeneratedCode: mobileCode || null,
      mobileExpireTime: mobileCode ? date + 180000 : null,
      frkRole,
      frkSupportUser: supportUser?.id,
    });

    if (supportUser) {
      const updateSupportUser = await supportUser.update({
        userCount: Number(supportUser.userCount) + 1,
      }); 
    }

    // SEND MESSAGE TO MOBILE NUMBER
    // await sendVerifyCode(user.email, emailCode);

    await user.save();

    try {
      await UserSchema.create({
        username: user.username,
        sqlId: user.id,
      });

      const scoreObj = {
        frkUser: user.id,
        score: 10,
        scoreTitle: 1,
        scoreType: 1,
      };

      const addScoreToFirstUserScore = await Score.newScore(scoreObj);

      const token = await user.generateAuthToken();

      const userNetworkCode = await UserNetwork.createUserNetworkCode(
        user.id,
        user.username
      );

      await Balance.create({ frkUser: user.id });

      const expireTime = date + 180000;

      if (req.body.email) {
        await sendShit({
          code: emailCode,
          username: user.username,
          email: user.email,
        });
      } else if (req.body.mobile) {
        await sendVerifySms({
          code: mobileCode,
          mobile: user.mobile,
        });
      }

      cookieSetter(token, true, res);

      res
        .status(201)
        .send({ code: emailCode || mobileCode, userNetworkCode, expireTime });
    } catch (err) {
      await user.destroy();

      throw err;
    }
  })
);

//==============================================================================================
//==================================+CONFIRM+=======================================
//==============================================================================================

router.post(
  '/api/user/confirm',
  userAuth,
  catchAsync(async (req, res, next) => {
    const email = req.user.emailGeneratedCode || false;

    const mobile = req.user.mobileGeneratedCode || false;

    if (req.body.code) {
      const matchEmail = email && req.user.isEmailCodeMatch(req.body.code);
      const matchMobile = mobile && req.user.isMobileCodeMatch(req.body.code);

      if (!matchEmail && !matchMobile)
        return next(new AppError('WRONG CODE OR EXPIRED', 400));

      if (matchEmail) {
        req.user.emailGeneratedCode = null;
        req.user.emailExpireTime = null;
        req.user.emailVerified = 1;
      } else {
        req.user.mobileGeneratedCode = null;
        req.user.mobileExpireTime = null;
        req.user.mobileVerified = 1;
      }

      if (req.body.networkCode) {
        const checkNetworkCode = await UserNetwork.findOne({
          where: {
            code: req.body.networkCode,
          },
        });

        if (!checkNetworkCode)
          return next(new AppError(404, 'کد معرف معتبر نیست'));

        const inviterUser = await checkNetworkCode.getUser();

        const newInvite = await Invite.create({
          frkUser: req.user.id,
          frkUserNetwork: checkNetworkCode.id,
        });

        const scoreObj = {
          frkUser: inviterUser.id,
          score: 5,
          scoreTitle: 1,
          scoreType: 1,
        };

        const addScoreToInviterUser = await Score.newScore(scoreObj);

        const scoreObj2 = {
          frkUser: req.user.id,
          score: 10,
          scoreTitle: 0,
          scoreType: 1,
        };

        const addScoreToFirstUserScore = await Score.newScore(scoreObj2);
      }

      await req.user.save();

      return res.send({});
    }

    let date = Date.now();
    let emailCode;
    let mobileCode;
    if (email) {
      emailCode = await generateRandomCode(3);
      req.user.emailGeneratedCode = emailCode;
      req.user.emailExpireTime = date + 180000;
      await sendShit({
        code: emailCode,
        username: req.user.username,
        email: req.user.email,
      });
    } else {
      mobileCode = await generateRandomCode(3);
      req.user.mobileGeneratedCode = mobileCode;
      req.user.mobileExpireTime = date + 180000;
      await sendVerifySms({
        code: mobileCode,
        mobile: req.user.mobile,
      });
    }

    const expireTime = date + 60000;

    await req.user.save();

    res.send({ code: emailCode || mobileCode, expireTime });
  })
);

//==============================================================================================
//=======================================++USER LOGIN+==========================================
//==============================================================================================

router.post(
  '/api/user/login',
  catchAsync(async (req, res) => {
    const type = req.body.loginType;

    switch (type) {
      case 'email': {
        const user = await User.findByEmail(req.body.email, req.body.password);

        const token = await user.generateAuthToken();

        const mongoUser = await UserSchema.findOne({
          sqlId: user.id,
        });

        cookieSetter(token, true, res);

        res.send({
          user,
          mongoId: mongoUser?._id,
        });

        break;
      }

      case 'mobile': {
        const user = await User.findByMobile(
          req.body.mobile,
          req.body.password
        );

        const token = await user.generateAuthToken();

        const mongoUser = await UserSchema.findOne({
          sqlId: user.id,
        });

        cookieSetter(token, true, res);

        res.send({
          user,
          mongoId: mongoUser?._id,
        });

        break;
      }

      default: {
        const user = await User.findByCredentials(
          req.body.username,
          req.body.password
        );

        const token = await user.generateAuthToken();

        const mongoUser = await UserSchema.findOne({
          sqlId: user.id,
        });

        cookieSetter(token, true, res);

        if (user.frkSupportUser == null) {
          const min = await SupportUser.min('userCount');
          const supportUser = await SupportUser.findOne({
            where: {userCount: min}
          });
          const setSupporter = await user.update({
            frkSupportUser: supportUser?.id
          });
          const updateSupportUser = await supportUser.update({
            userCount: Number(supportUser.userCount) + 1,
          });

        }

        res.send({
          user,
          mongoId: mongoUser?._id,
        });
      }
    }
  })
);

//==============================================================================================
//===================================USER UPDATE PROFILE========================================
//==============================================================================================

router.patch(
  '/api/user/update',
  userAuth,
  isUserVerified,
  isUserRestriced,
  catchAsync(async (req, res, next) => {
    const isMatch = await bcrypt.compare(
      req.body.oldPassword,
      req.user.password
    );

    if (!isMatch) return next(new AppError('wrong password', 400));

    if (!req.body.password) return next(new AppError('NO PASSWORD', 400));

    const safteyExcluded = [
      'id',
      'active',
      'isRestricted',
      'emailGeneratedCode',
      'mobileGeneratedCode',
      'emailExpireTime',
      'mobileExpireTime',
      'emailVerified',
      'mobileVerified',
      'frkRole',
      'passwordResetToken',
      'passwordResetExp',
      'userType',
      'username',
    ];

    const body = { ...req.body };

    safteyExcluded.forEach((itm) => delete body[itm]);

    const user = await req.user.update(body);

    if (body.image) {
      await UserSchema.findOneAndUpdate(
        { sqlId: req.user.id },
        { avatar: body.image }
      );
    }

    res.send(user);
  })
);

//==============================================================================================
//===================================USER DELETE ACCOUNT========================================
//==============================================================================================

router.delete(
  '/api/user/remove',
  userAuth,
  catchAsync(async (req, res, next) => {
    const isMatch = await bcrypt.compare(
      req.body.oldPassword,
      req.user.password
    );

    if (!isMatch) return next(new AppError('wrong password', 400));

    await req.user.update({
      active: 0,
    });
    res.send();
  })
);

//==============================================================================================
//====================================++USER ME ENDPOINT++========================================
//==============================================================================================

router.get(
  '/api/user/info',
  userAuth,
  Authorize,
  catchAsync(async (req, res, next) => {
    const mongoUser = await UserSchema.findOne({
      sqlId: req.user.id,
    });

    const sumScores = await Score.sum('score', {
      where: { frkUser: req.user.id },
    });

    const balance = await req.user.getBalance();

    res.send({
      user: req.user,
      role: req.userRole,
      mongoId: mongoUser?._id,
      score: sumScores,
      userBalance: balance,
    });
  })
);

//==============================================================================================
//=====================================VIP GET ALL USERS========================================
//==============================================================================================

router.get(
  '/api/users',
  userAuth,
  isUserVerified,
  isUserRestriced,
  Authorize,
  catchAsync(async (req, res) => {
    const { where, include, order, limit, offset } = APIFeatures(req.query);

    const users = await User.findAndCountAll({
      attributes: include,
      where,
      order,
      limit,
      offset,
    });
    res.send(users);
  })
);

//==============================================================================================
//=======================================VIP RESTRIC USER=======================================
//==============================================================================================

router.get(
  '/api/user/restrict/:id',
  userAuth,
  isUserVerified,
  isUserRestriced,
  Authorize,
  catchAsync(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) return next(new AppError('NOT FOUND', 404));

    const restricedUser = await user.update({
      isRestricted: +req.body.isRestricted,
    });

    res.send(restricedUser);
  })
);

//==============================================================================================
//===================================USER FORGET PASSWORD=======================================
//==============================================================================================

router.post(
  '/api/user/forgotPassword',
  catchAsync(async (req, res, next) => {
    if (req.body.loginType == 'email') {
      const user = await User.findOne({
        where: { email: req.body.email, active: 1 },
      });

      if (!user) return next(new AppError('NOT FOUND', 404));

      const token = await user.createPasswordResetToken();

      const resetURL = token;

      await sendResetPassword({
        email: user.email,
        username: user.username,
        url: resetURL,
      });

      await user.save();

      res.send();
    } else if (req.body.loginType == 'mobile') {
      const user = await User.findOne({
        where: { mobile: req.body.mobile, active: 1 },
      });

      if (!user) return next(new AppError('NOT FOUND', 404));

      const token = await user.createPasswordResetToken();

      const resetURL = token;

      await sendResetSms({
        mobile: user.mobile,
        url: resetURL,
      });

      await user.save();

      res.send();
    } else {
      return next(new AppError('BAD REQUEST', 400));
    }
  })
);

//==============================================================================================
//===================================USER PASSWORD RESET========================================
//==============================================================================================

router.patch(
  '/api/user/resetPassword/:token',
  catchAsync(async (req, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExp: { [Op.gt]: Date.now() },
      },
    });

    if (!user)
      return next(
        new AppError('PASSWORD RESET TOKEN IS WRONG OR EXPIRED', 404)
      );

    user.password = req.body.password;
    user.passwordResetToken = null;
    user.passwordResetExp = null;

    await user.save();

    res.send();
  })
);

router.get(
  '/api/google/user/sign',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

router.get(
  '/api/google/user/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/google/user/failed',
  }),
  async function (req, res) {
    if (req.user.email) {
      const user = await User.findOne({
        where: {
          email: req.user.email,
          active: 1,
        },
      });

      if (!user) {
        return res.redirect(process.env.CLIENT_URL);
      }

      const token = await user.generateAuthToken();
      cookieSetter(token, true, res);

      return res.redirect(process.env.CLIENT_URL);
    }

    res.redirect('/api/google/user/failed');
  }
);

router.get(
  '/api/google/user/failed',
  catchAsync(async (req, res, next) => {
    res.redirect(process.env.CLIENT_URL);
  })
);

router.get(
  '/api/google/user/success',
  catchAsync(async (req, res, next) => {
    res.redirect(process.env.CLIENT_URL);
  })
);

router.get(
  '/api/user/logout',
  userAuth,
  catchAsync(async (req, res, next) => {
    const cookie = cookieSetter(req.token, false, res);

    res.send();
  })
);

module.exports = router;
