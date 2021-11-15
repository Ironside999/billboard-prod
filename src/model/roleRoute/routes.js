const { DataTypes, Model } = require('sequelize');

const sequelize = require('../../db/db');
const JuncRoleRoute = require('./juncRoleRoute');
const Role = require('./role');

class Route extends Model {}

Route.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'path',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Route',
  }
);

Route.belongsToMany(Role, {
  through: JuncRoleRoute,
  foreignKey: {
    name: 'frkRoute',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  otherKey: {
    name: 'frkRole',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

Role.belongsToMany(Route, {
  through: JuncRoleRoute,
  foreignKey: {
    name: 'frkRole',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  otherKey: {
    name: 'frkRoute',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = Route;
