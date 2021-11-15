const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class InfoBankVideo extends Model {}

InfoBankVideo.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "InfoBankVideo",
  }
);

module.exports = InfoBankVideo;
