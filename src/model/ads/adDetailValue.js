const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
const Ad = require("./ad");

class AdDetailValue extends Model {}

AdDetailValue.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    detailValue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AdDetailValue",
  }
);

module.exports = AdDetailValue;
