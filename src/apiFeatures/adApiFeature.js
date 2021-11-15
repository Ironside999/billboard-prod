const AdAPIFeatures = (query) => {
  let limit = 12;
  let offset = 0;

  if (query.offset && query.limit) {
    offset = +query.offset || 0;
    limit = +query.limit || 12;
  }

  //   console.log(field);

  return { limit, offset };
};

module.exports = AdAPIFeatures;
