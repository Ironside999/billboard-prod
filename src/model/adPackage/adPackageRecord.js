const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class AdPackageRecord extends Model {
  static async createNewAdPackageRecord(frkAdPackage, ip) {
    const newRecord = await this.create({
      frkAdPackage,
      ip,
    });

    return newRecord;
  }
}

AdPackageRecord.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AdPackageRecord",
  }
);

module.exports = AdPackageRecord;
