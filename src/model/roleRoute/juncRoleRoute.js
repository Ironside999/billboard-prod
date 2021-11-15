const { DataTypes, Model } = require("sequelize");

const sequelize = require("../../db/db");

class JuncRoleRoute extends Model {}

JuncRoleRoute.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "JuncRoleRoute",
  }
);

module.exports = JuncRoleRoute;
