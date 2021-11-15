const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const Ad = require('../ads/ad');
const BillboardFinder = require('../billboardFinder/billboardFinder');

class Area extends Model {}

Area.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Area',
  }
);

Area.hasMany(Ad, {
  foreignKey: {
    name: 'frkArea',
    type: DataTypes.BIGINT,
  },
});

Ad.belongsTo(Area, {
  foreignKey: {
    name: 'frkArea',
    type: DataTypes.BIGINT,
  },
});

Area.hasMany(BillboardFinder, {
  foreignKey: {
    name: 'frkArea',
    type: DataTypes.BIGINT,
  },
});

BillboardFinder.belongsTo(Area, {
  foreignKey: {
    name: 'frkArea',
    type: DataTypes.BIGINT,
  },
});

module.exports = Area;
