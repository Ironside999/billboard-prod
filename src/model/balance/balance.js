const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class Balance extends Model {}

Balance.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tempBalance: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      defaultValue: 0,
    },
    tempBalanceExpire: {
      type: DataTypes.DATE,
      // allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Balance',
  }
);

module.exports = Balance;
