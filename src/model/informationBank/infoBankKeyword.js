const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class InfoBankKeyword extends Model {}

InfoBankKeyword.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "InfoBankKeyword",
  }
);

module.exports = InfoBankKeyword;
