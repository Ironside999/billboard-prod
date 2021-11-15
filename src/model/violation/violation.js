const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class Violation extends Model {}

Violation.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    violationRelation: {
      type: DataTypes.TINYINT,
      allowNull: false,
      // marboot be kodom ghesmate 0 agahi/ 1 comment agahi/ 2 bank etelaati/ 3 comment bank etelaati
    },
    frkRelation: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      // pendign , accepted, rejcted
    },
  },
  {
    sequelize,
    modelName: "Violation",
  }
);

module.exports = Violation;
