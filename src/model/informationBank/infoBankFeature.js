const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");


class InfoBankFeature extends Model {}

InfoBankFeature.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    feature: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "InfoBankFeature",
  }
);



module.exports = InfoBankFeature;
