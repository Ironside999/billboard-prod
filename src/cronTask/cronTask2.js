const cron = require("node-cron");
const InformationBank = require("../model/informationBank/informationBank");
const { Op } = require("sequelize");

const cronTask2 = cron.schedule(
  "* 23 * * *",
  async () => {
    try {
      await InformationBank.update(
        { infoType: 0 },
        {
          where: {
            vipExpDate: {
              [Op.lt]: Date.now(),
            },
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  },
  {
    scheduled: false,
  }
);

module.exports = cronTask2;
