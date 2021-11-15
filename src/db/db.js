const { Sequelize, Op } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PW,
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci',
      },
    },
    dialectOptions: {
      supportBigNumbers: true,
      bigNumberStrings: true,
    },
  }
);

module.exports = sequelize;
