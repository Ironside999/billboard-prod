const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
const InformationBank = require("./informationBank");
const SocialNetwok = require("./socialNetwok");

class JuncBankSocialNtwrk extends Model {}

JuncBankSocialNtwrk.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    info: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "JuncBankSocialNtwrk",
  }
);

InformationBank.belongsToMany(SocialNetwok, {
  through: {
    model: JuncBankSocialNtwrk,
    unique: false,
  },
  foreignKey: {
    name: "frkInfoBank",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  otherKey: {
    name: "frkSocialNtwrk",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

SocialNetwok.belongsToMany(InformationBank, {
  through: {
    model: JuncBankSocialNtwrk,
    unique: false,
  },
  foreignKey: {
    name: "frkSocialNtwrk",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  otherKey: {
    name: "frkInfoBank",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = JuncBankSocialNtwrk;
