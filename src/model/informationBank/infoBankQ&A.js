const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class QAInfoBank extends Model {}

QAInfoBank.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    Q: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    A: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "QAInfoBank",
  }
);

module.exports = QAInfoBank;
