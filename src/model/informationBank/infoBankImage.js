const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class InfoBankImage extends Model {}

InfoBankImage.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "InfoBankImage",
  }
);

module.exports = InfoBankImage;
