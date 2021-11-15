const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
var City = require("./city");
class Province extends Model {}
Province.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Province",
  }
);

Province.hasMany(City, {
  foreignKey: {
    name: "frkProvince",
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

City.belongsTo(Province, {
  foreignKey: {
    name: "frkProvince",
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

module.exports = Province;
