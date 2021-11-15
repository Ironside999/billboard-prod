const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class VirtualBbdRecord extends Model {}

VirtualBbdRecord.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    recordType: {
      type: DataTypes.TINYINT,
      allowNull: false,
      // 0 baraye visit 1 baraye click
    },
    ip: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "VirtualBbdRecord",
  }
);

module.exports = VirtualBbdRecord;
