const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

const AdDetailValue = require("./adDetailValue");

class AdDetail extends Model {}

AdDetail.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AdDetail",
  }
);

AdDetail.hasMany(AdDetailValue, {
  foreignKey: {
    name: "frkAdDetail",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

AdDetailValue.belongsTo(AdDetail, {
  foreignKey: {
    name: "frkAdDetail",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = AdDetail;
