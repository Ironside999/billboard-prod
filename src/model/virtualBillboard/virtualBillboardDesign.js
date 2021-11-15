const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class VirtualBbdDesign extends Model {}

VirtualBbdDesign.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "VirtualBbdDesign",
  }
);

module.exports = VirtualBbdDesign;
