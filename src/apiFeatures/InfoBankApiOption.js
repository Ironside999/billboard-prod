const { Op } = require("sequelize");

const InfoBankApiOptions = (query) => {
  let where = { ...query };

  let exclude = ["mobile", "longitude", "latitude"];

  let order = [
    ["infoType", "DESC"],
    ["order", "DESC"],
  ];

  if (query.order && typeof query.order == "string") {
    if (query.order.includes(";")) {
      let sort = query.order.split(";");
      sort = sort.map((itm) => {
        return itm.split(",");
      });

      order.push(sort);
    } else {
      let sort = query.order.split(",");
      order.push(sort);
    }
  }

  const excludeFields = ["limit", "offset", "group", "attributes", "image"];

  excludeFields.forEach((itm) => delete where[itm]);

  if (query.image && typeof query.image == "string") {
    where = { ...where, image: { [Op.ne]: null } };
  }

  let limit = 12;
  let offset = 0;

  if (query.offset && query.limit) {
    offset = +query.offset || 0;
    limit = +query.limit || 12;
  }

  return { where, exclude, order, limit, offset };
};

module.exports = InfoBankApiOptions;
