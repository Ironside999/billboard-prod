const SupportUser = require("../../model/supportUser/supportUser");
const express = require("express");
const catchAsync = require("../../appError/catchAsync");
const userAuth = require("../../middleware/userAuth");
const AppError = require("../../appError/appError");
const sequelize = require('sequelize');
const User = require('../../model/user/user');

const router = new express.Router();

router.post('/api/supportUser/create',
    catchAsync(async (req, res, next) => {
        const support = await SupportUser.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            mobile: req.body.mobile,
            image: req.body.image,
        });
        res.status(201).send({ support });
    })
);

router.delete('/api/supportUser/delete/:id',
    catchAsync(async (req, res, next) => {
        const support = await SupportUser.findByPk(req.params.id);
        if (!support) {
            return next(new AppError('پشتیبان مورد نظر یافت نشد', 404))
        };
        await support.destroy();
        res.status(200).send({})
    })
);

router.get('/api/supportUser/get-one/:id',
    catchAsync(async (req, res, next) => {
        const support = await SupportUser.findByPk(req.params.id);
        if (!support) {
            return next(new AppError('پشتیبان مورد نظر یافت نشد', 404))
        };
        res.status(200).send({ support });
    })
);

router.get('/api/supportUser/all',
    catchAsync(async (req, res, next) => {
        const support = await SupportUser.findAll();
        res.status(200).send({ support });
    })
);

//find supportUser of each user
//response : user info + supportUser info
router.get('/api/supportUser/each/user/:id',
    catchAsync(async (req, res, next) => {
        const user = await User.findByPk(req.params.id, {
            include: {
                model: SupportUser,
            },
            attributes: ["username", "email", "mobile", "image"]
        });
        res.status(200).send({user});
    })
);

//find users of a supportUser
//response : supportUser info + users info 
router.get('/api/supportUser/users/:id',
    catchAsync(async (req, res, next) => {
        const users = await User.findAndCountAll({
            where: {frkSupportUser: req.params.id},
            attributes: ["username", "email", "mobile", "frkSupportUser"],
        });
        res.status(200).send({users});
    })
);

router.patch('/api/supportUser/update/:id',
    catchAsync(async (req, res, next) => {
        const support = await SupportUser.findByPk(req.params.id);
        if (!support) {
            return next(new AppError('پشتیبان مورد نظر وجود ندارد', 404));
        };
        const updateSupport = await support.update({
            phone: req.body.phone,
            mobile: req.body.mobile,
            image: req.body.image,
        });
        res.status(200).send({updateSupport});
    })
);
module.exports = router;

