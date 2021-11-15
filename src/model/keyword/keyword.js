const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class Keyword extends Model {}

Keyword.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Keyword",
  }
);

module.exports = Keyword;
