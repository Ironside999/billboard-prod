const { Op } = require('sequelize');

const AdAPIOptions = (query) => {
  let where = {
    ...query,
    isApproved: 1,
    expireDate: {
      [Op.gte]: Date.now(),
    },
  };

  let exclude = ['subMobile', 'longitude', 'latitude'];

  let order = [
    ['adType', 'DESC'],
    ['order', 'DESC'],
  ];

  const excludeFields = [
    'limit',
    'offset',
    'max',
    'min',
    'group',
    'attributes',
    'image',
    'val',
  ];

  excludeFields.forEach((itm) => delete where[itm]);

  if (query.max && query.min) {
    where = {
      ...where,
      price: { [Op.between]: [query.min, query.max] },
    };
  }

  if (query.image && typeof query.image == 'string') {
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

module.exports = AdAPIOptions;
