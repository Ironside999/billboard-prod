const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const BillboardFinder = require('./billboardFinder');

class BbdFinderDimension extends Model {}

BbdFinderDimension.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'BbdFinderDimension',
  }
);

BbdFinderDimension.hasMany(BillboardFinder, {
  foreignKey: {
    name: 'frkBbdFinderDimension',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

BillboardFinder.belongsTo(BbdFinderDimension, {
  foreignKey: {
    name: 'frkBbdFinderDimension',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = BbdFinderDimension;
