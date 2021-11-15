const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

const Province = require("./province");

class Country extends Model {}

Country.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Country",
  }
);

Country.hasMany(Province, {
  foreignKey: {
    name: "frkCountry",
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Province.belongsTo(Country, {
  foreignKey: {
    name: "frkCountry",
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

module.exports = Country;
