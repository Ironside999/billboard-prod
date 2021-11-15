const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const VirtualBillboard = require('../virtualBillboard/virtualBillboard');
const Ad = require('./ad');
const AdsClvlCategory = require('./adCategoryC');
const InformationBank = require('../informationBank/informationBank');
const Keyword = require('../keyword/keyword');

class AdsBlvlCategory extends Model {}

AdsBlvlCategory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    adCategoryB: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'AdsBlvlCategory',
  }
);

AdsBlvlCategory.hasMany(AdsClvlCategory, {
  foreignKey: {
    name: 'frkCatB',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

AdsClvlCategory.belongsTo(AdsBlvlCategory, {
  foreignKey: {
    name: 'frkCatB',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

AdsBlvlCategory.hasMany(Ad, {
  foreignKey: {
    name: 'frkCatB',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Ad.belongsTo(AdsBlvlCategory, {
  foreignKey: {
    name: 'frkCatB',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

AdsBlvlCategory.hasMany(VirtualBillboard, {
  foreignKey: {
    name: 'frkCatB',
    type: DataTypes.BIGINT,
  },
});

VirtualBillboard.belongsTo(AdsBlvlCategory, {
  foreignKey: {
    name: 'frkCatB',
    type: DataTypes.BIGINT,
  },
});

AdsBlvlCategory.hasMany(InformationBank, {
  foreignKey: {
    name: 'frkCatB',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

InformationBank.belongsTo(AdsBlvlCategory, {
  foreignKey: {
    name: 'frkCatB',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

AdsBlvlCategory.hasMany(Keyword, {
  foreignKey: {
    name: 'frkCatB',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

Keyword.belongsTo(AdsBlvlCategory, {
  foreignKey: {
    name: 'frkCatB',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = AdsBlvlCategory;
