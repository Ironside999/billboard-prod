const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
const Ad = require("./ad");

class AdStatus extends Model {}

AdStatus.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    adStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AdStatus",
  }
);

AdStatus.hasMany(Ad, {
  foreignKey: {
    name: "frkAdStatus",
    type: DataTypes.BIGINT,
  },
});

Ad.belongsTo(AdStatus, {
  foreignKey: {
    name: "frkAdStatus",
    type: DataTypes.BIGINT,
  },
});

module.exports = AdStatus;
