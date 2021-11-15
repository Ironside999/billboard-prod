const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class BbdFinderImage extends Model {}

BbdFinderImage.init(
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
    modelName: "BbdFinderImage",
  }
);

module.exports = BbdFinderImage;
