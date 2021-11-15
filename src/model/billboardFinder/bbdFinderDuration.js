const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const BillboardFinder = require('./billboardFinder');

class BbdFinderDuration extends Model {}

BbdFinderDuration.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    duration: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 48,
      },
    },
  },
  {
    sequelize,
    modelName: 'BbdFinderDuration',
  }
);

BbdFinderDuration.hasMany(BillboardFinder, {
  foreignKey: {
    name: 'frkBbdFinderDuration',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

BillboardFinder.belongsTo(BbdFinderDuration, {
  foreignKey: {
    name: 'frkBbdFinderDuration',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = BbdFinderDuration;
