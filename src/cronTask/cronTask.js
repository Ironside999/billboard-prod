const cron = require('node-cron');
const changeOrder = require('../apiFeatures/changeOrder');

// */10 * * * * // every 10 minutes
const cronTask = cron.schedule(
  '*/10 * * * *',
  async () => {
    await changeOrder();
  },
  {
    scheduled: false,
  }
);

module.exports = cronTask;
