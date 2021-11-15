const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../../db/db');
const Map = require('./map');

class MapCategury extends Model {}

MapCategury.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'MapCategury',
  }
);

MapCategury.hasMany(Map, {
  foreignKey: {
    name: 'frkMapCategury',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});
Map.belongsTo(MapCategury, {
  foreignKey: {
    name: 'frkMapCategury',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = MapCategury;
