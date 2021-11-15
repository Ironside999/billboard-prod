const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const BillboardFinder = require('./billboardFinder');

class BbdFinderType extends Model {}

BbdFinderType.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    billboardType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'BbdFinderType',
  }
);

BbdFinderType.hasMany(BillboardFinder, {
  foreignKey: {
    name: 'frkBbdType',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

BillboardFinder.belongsTo(BbdFinderType, {
  foreignKey: {
    name: 'frkBbdType',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = BbdFinderType;
