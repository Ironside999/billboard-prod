const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class BbdFinderPackage extends Model {}

BbdFinderPackage.init(
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
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    billboardCount: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BbdFinderPackage",
  }
);

module.exports = BbdFinderPackage;
