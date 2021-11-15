const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
const Violation = require("./violation");

class ViolationCategory extends Model {}

ViolationCategory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ViolationCategory",
  }
);

ViolationCategory.hasMany(Violation, {
  foreignKey: {
    name: "frkViolationCat",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

Violation.belongsTo(ViolationCategory, {
  foreignKey: {
    name: "frkViolationCat",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = ViolationCategory;
