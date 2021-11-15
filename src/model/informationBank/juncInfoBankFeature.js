const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
const InfoBankFeature = require('./infoBankFeature');
const InfoBank = require('./informationBank');

class JuncInfoBankFeature extends Model {}

JuncInfoBankFeature.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "JuncInfoBankFeature",
  }
);


InfoBank.belongsToMany(InfoBankFeature, {
    through: JuncInfoBankFeature,
    unique: false,
    foreignKey: {
      name: "frkInfoBank",
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    otherKey: {
      name: "frkInfoFeature",
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  
  InfoBankFeature.belongsToMany(InfoBank, {
    through: JuncInfoBankFeature,
    unique: false,
    foreignKey: {
      name: "frkInfoFeature",
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    otherKey: {
      name: "frkInfoBank",
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  



module.exports = JuncInfoBankFeature;
