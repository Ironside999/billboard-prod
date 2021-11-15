const Crud = require("./crud");

const catchAsync = require("../appError/catchAsync");

// userAuth
class CrudWithAuth extends Crud {
  postRouterWithAuth = (auth, restrict) => {
    // postRouterWithAuth = () => {
    this.route.post(
      `/api/${this.name}/create`,
      auth,
      // restrict,
      catchAsync(this.create)
    );

    return this;
  };

  //userAuth
  findOneRouterWithAuth = (auth, restrict) => {
    // findOneRouterWithAuth = (restrict) => {
    this.route.get(
      `/api/${this.name}/get-one/:id`,
      auth,
      // restrict,
      catchAsync(this.findOne)
    );

    return this;
  };


  //userAuth
  findAllRouterWithAuth = (auth, restrict) => {
  // findAllRouterWithAuth = (restrict) => {
    this.route.get(
      `/api/${this.name}/all`,
      auth,
      // restrict,
      catchAsync(this.findAll)
    );

    return this;
  };


  //userAuth
  findAllFeaturedRouterWithAuth = (auth, restrict) => {
  // findAllFeaturedRouterWithAuth = (restrict) => {
    this.route.get(
      `/api/${this.name}/all`,
      auth,
      // restrict,
      catchAsync(this.findAllFeatured)
    );

    return this;
  };


  //userAuth
  updateRouterWithAuth = (auth, restrict) => {
  // updateRouterWithAuth = (restrict) => {
    this.route.patch(
      `/api/${this.name}/update/:id`,
      auth,
      // restrict,
      catchAsync(this.update)
    );

    return this;
  };

  //userAuth
  deleteRouterWithAuth = (auth, restrict) => {
  // deleteRouterWithAuth = (restrict) => {
    this.route.delete(
      `/api/${this.name}/delete/:id`,
      auth,
      // restrict,
      catchAsync(this.remove)
    );

    return this;
  };


  //userAuth
  findByFrkRouterWithAuth = (auth, restrict, frk) => {
  // findByFrkRouterWithAuth = (restrict, frk) => {
    this.route.get(
      `/api/${this.name}/from-frk/:id`,
      auth,
      // restrict,
      catchAsync(this.findByFrk(frk))
    );

    return this;
  };
}
module.exports = CrudWithAuth;
