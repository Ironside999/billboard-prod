const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const Ad = require('../ads/ad');
const BillboardFinder = require('../billboardFinder/billboardFinder');
const Area = require('./area');
const InformationBank = require('../informationBank/informationBank');

class City extends Model {}

City.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
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
    modelName: 'City',
  }
);


City.hasMany(Area, {
  foreignKey: {
    name: 'frkCity',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Area.belongsTo(City, {
  foreignKey: {
    name: 'frkCity',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

City.hasMany(Ad, {
  foreignKey: {
    name: 'frkCity',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Ad.belongsTo(City, {
  foreignKey: {
    name: 'frkCity',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

City.hasMany(BillboardFinder, {
  foreignKey: {
    name: 'frkCity',
    type: DataTypes.BIGINT,
  },
});

BillboardFinder.belongsTo(City, {
  foreignKey: {
    name: 'frkCity',
    type: DataTypes.BIGINT,
  },
});

City.hasMany(InformationBank, {
  foreignKey: {
    name: 'frkCity',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

InformationBank.belongsTo(City, {
  foreignKey: {
    name: 'frkCity',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

module.exports = City;
