const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
const Ad = require("./ad");
const AdDetailValue = require("./adDetailValue");

class JuncDetailValAd extends Model {}

JuncDetailValAd.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "JuncDetailValAd",
  }
);

Ad.belongsToMany(AdDetailValue, {
  through: JuncDetailValAd,
  foreignKey: {
    name: "frkAd",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  otherKey: {
    name: "frkAdDetailVal",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

AdDetailValue.belongsToMany(Ad, {
  through: JuncDetailValAd,
  foreignKey: {
    name: "frkAdDetailVal",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  otherKey: {
    name: "frkAd",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

Ad.hasMany(JuncDetailValAd, {
  foreignKey: {
    name: "frkAd",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

JuncDetailValAd.belongsTo(Ad, {
  foreignKey: {
    name: "frkAd",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

AdDetailValue.hasMany(JuncDetailValAd, {
  foreignKey: {
    name: "frkAdDetailVal",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

JuncDetailValAd.belongsTo(AdDetailValue, {
  foreignKey: {
    name: "frkAdDetailVal",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = JuncDetailValAd;
