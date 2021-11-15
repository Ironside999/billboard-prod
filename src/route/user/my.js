const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');
const AdPackage = require('../../model/adPackage/adPackage');
const AdPackageRecord = require('../../model/adPackage/adPackageRecord');
const Ad = require('../../model/ads/ad');
const AdDetail = require('../../model/ads/adDetail');
const AdDetailValue = require('../../model/ads/adDetailValue');
const AdImage = require('../../model/ads/adImage');
const AdVideo = require('../../model/ads/adVideo');
const BbdFinderImage = require('../../model/billboardFinder/bbdFinderImage');
const User = require('../../model/user/user');
const VirtualBbdRecord = require('../../model/virtualBillboard/virtualBillboardRecord');
const Invite = require('./../../model/Invite/Invite');

const router = new express.Router();

router.get(
  '/api/my/ticket',
  userAuth,
  catchAsync(async (req, res, next) => {
    const myTicket = await req.user.getTickets();
    res.send(myTicket);
  })
);

router.get(
  '/api/my/transactions',
  userAuth,
  catchAsync(async (req, res, next) => {
    const transaction = await req.user.getTransactions();
    res.send(transaction);
  })
);

router.get(
  '/api/my/ads',
  userAuth,
  catchAsync(async (req, res, next) => {
    const myAds = await req.user.getAds({
      include: [
        {
          model: AdImage,
        },
        { model: AdVideo },
        {
          model: AdDetailValue,
          through: {
            attributes: [],
          },
          include: {
            model: AdDetail,
          },
        },
      ],
    });
    res.send(myAds);
  })
);

router.get(
  '/api/my/network/code',
  userAuth,
  catchAsync(async (req, res, next) => {
    const myNetwork = await req.user.getUserNetwork({
      include: {
        model: Invite,
        include: {
          model: User,
          attributes: ['id', 'username', 'image', 'userType'],
        },
      },
    });
    res.send(myNetwork);
  })
);

router.get(
  '/api/my/billboadfinders',
  userAuth,
  catchAsync(async (req, res, next) => {
    const billboards = await req.user.getBillboardFinders({
      include: {
        model: BbdFinderImage,
      },
    });
    res.send(billboards);
  })
);

router.get(
  '/api/my/ad/packages',
  userAuth,
  catchAsync(async (req, res, next) => {
    const myPackages = await req.user.getJuncUserAdPackages({
      include: [
        { model: AdPackage },
        { model: Ad },
        { model: AdPackageRecord },
      ],
    });
    res.send(myPackages);
  })
);

router.get(
  '/api/my/packages',
  userAuth,
  catchAsync(async (req, res, next) => {
    const myPackages = await req.user.getJuncUserAdPackages({
      where: {
        active: 1,
      },
      include: {
        model: AdPackage,
      },
    });
    console.log(myPackages);

    res.send(myPackages);
  })
);

router.get(
  '/api/my/virtual/billboards',
  userAuth,
  catchAsync(async (req, res, next) => {
    const virtualBbds = await req.user.getVirtualBbdCalenders({
      include: {
        model: VirtualBbdRecord,
      },
    });

    res.send(virtualBbds);
  })
);

// router.get(
//   '/api/my/info/banks',
//   userAuth,
//   catchAsync(async (req, res, next) => {
//     const infoBanks = await req.user.getInformationBanks({
//       include: [{ model: InfoBankImage }, { model: InfoBankVideo }],
//     });

//     res.send(infoBanks);
//   })
// );

module.exports = router;
