const simpleFilter = (query) => {
  const where = { ...query };

  const excludeFields = ["offset", "order", "limit", "attributes", "group"];

  excludeFields.forEach((itm) => delete where[itm]);

  return where;
};

module.exports = simpleFilter;
