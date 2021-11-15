const express = require("express");
const APIFeatures = require("../apiFeatures/apiFeature");
const AppError = require("../appError/appError");
const catchAsync = require("../appError/catchAsync");

class Crud {
  constructor(Model, name) {
    this.name = name;
    this.Model = Model;
  }

  route = express.Router();

  findOne = async (req, res, next) => {
    let params = req.params;
    let result = await this.Model.findByPk(params.id);
    if (!result) return next(new AppError(`NOT FOUND ANY ${this.name}`, 404));
    res.send(result);
  };

  findAll = async (req, res, next) => {
    let result = await this.Model.findAll();
    res.send(result);
  };

  findAllFeatured = async (req, res, next) => {
    let { where, include, order, limit, offset } = APIFeatures(req.query);

    let result = await this.Model.findAll({
      where,
      attributes: include,
      order,
      offset,
      limit,
    });
    res.send(result);
  };

  update = async (req, res, next) => {
    let body = req.body;
    delete body.id;
    let result = await this.Model.findByPk(req.params.id);
    if (!result) return next(new AppError(`NOT FOUND ANY ${this.name}`, 404));

    await result.update(body);

    res.send(result);
  };

  remove = async (req, res, next) => {
    let params = req.params;
    let result = await this.Model.destroy({
      where: {
        id: params.id,
      },
    });
    if (!result) return next(new AppError(`NOT FOUND ANY ${this.name}`, 404));
    res.send();
  };

  create = async (req, res, next) => {
    const body = req.body;
    delete body.id;
    let result = await this.Model.create(body);
    // editted
    res.status(201).send(result);
  };

  findByFrk = (frk) => {
    return async (req, res, next) => {
      let params = req.params;
      let result = await this.Model.findAll({
        where: {
          [frk]: params.id,
        },
      });

      res.send(result);
    };
  };

  postRouter = () => {
    this.route.post(`/api/${this.name}/create`, catchAsync(this.create));

    return this;
  };

  findOneRouter = () => {
    this.route.get(`/api/${this.name}/get-one/:id`, catchAsync(this.findOne));

    return this;
  };

  findAllRouter = () => {
    this.route.get(`/api/${this.name}/all`, catchAsync(this.findAll));

    return this;
  };

  findAllFeaturedRouter = () => {
    this.route.get(`/api/${this.name}/all`, catchAsync(this.findAllFeatured));

    return this;
  };

  updateRouter = () => {
    this.route.patch(`/api/${this.name}/update/:id`, catchAsync(this.update));

    return this;
  };

  deleteRouter = () => {
    this.route.delete(`/api/${this.name}/delete/:id`, catchAsync(this.remove));

    return this;
  };

  findByFrkRouter = (frk) => {
    this.route.get(
      `/api/${this.name}/from-frk/:id`,
      catchAsync(this.findByFrk(frk))
    );

    return this;
  };

  readyRouter = () => {
    return this.route;
  };
}
module.exports = Crud;
