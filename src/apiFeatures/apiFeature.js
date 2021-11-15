const APIFeatures = (query) => {
  const where = { ...query };

  const excludeFields = ['offset', 'order', 'limit', 'attributes', 'group'];

  excludeFields.forEach((itm) => delete where[itm]);

  let column = [];

  if (query.attributes && typeof query.attributes == 'string') {
    column = query.attributes.split(',');
  }

  let order = [];

  if (query.order && typeof query.order == 'string') {
    let sort = [];

    if (query.order.includes(';')) {
      sort = query.order.split(';');
      sort = sort.map((itm) => {
        return itm.split(',');
      });

      order = sort;
    } else {
      sort = query.order.split(',');
      order.push(sort);
    }
  }

  let limit;
  let offset;

  if (query.offset && query.limit) {
    offset = +query.offset || 0;
    limit = +query.limit || 6;
  }

  let include = column.length ? column : undefined;

  return { where, include, order, limit, offset };
};

module.exports = APIFeatures;
