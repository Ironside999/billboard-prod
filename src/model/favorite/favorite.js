const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class Favorite extends Model {}

Favorite.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },
    relation: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      // 0 agahi...
    },
  },
  {
    sequelize,
    modelName: "Favorite",
  }
);

module.exports = Favorite;
