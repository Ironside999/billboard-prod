const { Op } = require('sequelize');
const Ad = require('../model/ads/ad');

const changeOrder = async () => {
  Ad.findAll({
    where: {
      frkAdPackage: {
        [Op.ne]: null,
      },
    },
  })
    .then((ads) => {
      for (let i = 0; i < ads.length; i += 100) {
        const tasks = ads.slice(i, i + 100).map((ad) => {
          return ad.updateOrder().catch((err) => {
            throw err;
          });
        });

        Promise.all(tasks).catch((e) => console.log(e));
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = changeOrder;
