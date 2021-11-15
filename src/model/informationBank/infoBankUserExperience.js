const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class InfoBankExperience extends Model {}

InfoBankExperience.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    experience: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    score: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
  },
  {
    sequelize,
    modelName: "InfoBankExperience",
  }
);

module.exports = InfoBankExperience;
