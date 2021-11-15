const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const BillboardFinder = require('./billboardFinder');

class BbdFinderSize extends Model {}

BbdFinderSize.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'BbdFinderSize',
  }
);

BbdFinderSize.hasMany(BillboardFinder, {
  foreignKey: {
    name: 'frkBbdFinderSize',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

BillboardFinder.belongsTo(BbdFinderSize, {
  foreignKey: {
    name: 'frkBbdFinderSize',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = BbdFinderSize;
