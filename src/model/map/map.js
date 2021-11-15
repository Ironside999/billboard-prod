const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../../db/db');

class Map extends Model {}

Map.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Map',
  }
);

module.exports = Map;
