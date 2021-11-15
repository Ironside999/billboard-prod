const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class ClaimInfoBank extends Model {}

ClaimInfoBank.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      // 0 pending, 1 rejected, 2 accepted
    },
    replyMessage: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "ClaimInfoBank",
  }
);

module.exports = ClaimInfoBank;
