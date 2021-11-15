const express = require('express');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');
const InfoBankFeature = require('../../model/informationBank/infoBankFeature');
const AppError = require('./../../appError/appError');

const router = new express.Router();

router.post('/api/info/bank/feature/create',
    catchAsync(async (req, res, next) => {
        const feature = await InfoBankFeature.create({
            feature: req.body.feature,
        });
        res.status(200).send(feature);
    })
);

router.delete('/api/info/bank/feature/delete/:id',
    catchAsync(async (req, res, next) => {
        const feature = await InfoBankFeature.destroy({
            where: {id: req.params.id}
        });
        if (!feature) {
            return next(new AppError('امکانات مورد نظر شما یافت نشد', 404));
        };
        res.status(200).send({});
    })
);

router.get('/api/info/bank/feature/get-one/:id',
    catchAsync(async (req, res, next) => {
        const feature = await InfoBankFeature.findByPk(req.params.id);
        if (!feature) {
            return next(new AppError('امکانات مورد نظر شما یافت نشد', 404));
        };
        res.status(200).send(feature);
    })
);

router.get('/api/info/bank/feature/all',
    catchAsync(async (req, res, next) => {
        const feature = await InfoBankFeature.findAll();
        if (!feature) {
            return next(new AppError('امکانات مورد نظر شما یافت نشد', 404));
        };
        res.status(200).send(feature);
    })
);

router.patch('/api/info/bank/feature/edit/:id',
    catchAsync(async (req, res, next) => {
        const feature = await InfoBankFeature.findByPk(req.params.id);
        if (!feature) {
            return next(new AppError('امکانات مورد نظر شما یافت نشد', 404));
        };
        const updateFeature = await feature.update({
            feature: req.body.feature,
        });
        res.status(200).send(updateFeature);
    })
);

module.exports = router;