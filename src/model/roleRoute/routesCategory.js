const { DataTypes, Model } = require("sequelize");

const sequelize = require("../../db/db");
const Route = require("./routes");

class RouteCategory extends Model {}

RouteCategory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "title",
    },
  },
  {
    sequelize,
    modelName: "RouteCategory",
  }
);

RouteCategory.hasMany(Route, {
  foreignKey: {
    name: "frkRouteCategory",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

Route.belongsTo(RouteCategory, {
  foreignKey: {
    name: "frkRouteCategory",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = RouteCategory;
