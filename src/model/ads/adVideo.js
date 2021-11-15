const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class AdVideo extends Model {}

AdVideo.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AdVideo",
  }
);

module.exports = AdVideo;
