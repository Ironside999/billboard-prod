const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../', 'config.env') });

// process.on("uncaughtException", (err) => {
//   console.log("uncaughtException => " + err);
//   process.exit(1);
// });

const { server, sequelize } = require('./app');
const cronTask = require('./cronTask/cronTask');
// const cronTask2 = require('./cronTask/cronTask2');

require('./socket.io/io');

const port = process.env.PORT || 5000;

sequelize
  .sync({
    // logging: console.log,
    // force: true,
    // alter: true,
  })
  .then(() => {
    console.log('connected to database succesfully');

    cronTask.start();
    // cronTask2.start();

    server.listen(port, () => {
      console.log('server is running on ' + port);
    });
  })
  .catch((err) => {
    console.log('errroorrr' + err);
  });

// process.on("unhandledRejection", (err) => {
//   console.log("unhandledRejection => " + err);
//   cronTask.stop()
//   cronTask2.stop();
//   server.close(() => {
//     process.exit(1);
//   });
// });
