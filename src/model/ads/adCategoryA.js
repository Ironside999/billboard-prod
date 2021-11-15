const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const VirtualBillboard = require('../virtualBillboard/virtualBillboard');
const Ad = require('./ad');
const AdsBlvlCategory = require('./adCategoryB');
const InformationBank = require('../informationBank/informationBank');

class AdsAlvlCategory extends Model {}

AdsAlvlCategory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    adCategoryA: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'adCategoryA',
    },
    catType: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      // 0 moshtarak , 1 agahi , 2 bankEtelaaTio takhfif
    },
    image: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'AdsAlvlCategory',
  }
);

AdsAlvlCategory.hasMany(AdsBlvlCategory, {
  foreignKey: {
    name: 'frkCatA',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

AdsBlvlCategory.belongsTo(AdsAlvlCategory, {
  foreignKey: {
    name: 'frkCatA',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

AdsAlvlCategory.hasMany(Ad, {
  foreignKey: {
    name: 'frkCatA',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Ad.belongsTo(AdsAlvlCategory, {
  foreignKey: {
    name: 'frkCatA',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

AdsAlvlCategory.hasMany(VirtualBillboard, {
  foreignKey: {
    name: 'frkCatA',
    type: DataTypes.BIGINT,
  },
});

VirtualBillboard.belongsTo(AdsAlvlCategory, {
  foreignKey: {
    name: 'frkCatA',
    type: DataTypes.BIGINT,
  },
});

AdsAlvlCategory.hasMany(InformationBank, {
  foreignKey: {
    name: 'frkCatA',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

InformationBank.belongsTo(AdsAlvlCategory, {
  foreignKey: {
    name: 'frkCatA',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

module.exports = AdsAlvlCategory;
