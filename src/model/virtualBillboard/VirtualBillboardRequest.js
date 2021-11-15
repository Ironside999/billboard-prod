const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class VirtualBillboardReq extends Model {}

VirtualBillboardReq.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    services: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    extraInfo: {
      type: DataTypes.TEXT,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chosenColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'VirtualBillboardReq',
  }
);

module.exports = VirtualBillboardReq;
