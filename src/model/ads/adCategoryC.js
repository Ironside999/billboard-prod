const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const VirtualBillboard = require('../virtualBillboard/virtualBillboard');
const Ad = require('./ad');
const AdStatusCategory = require('./adStatusCat');
const SpecificCategory = require('./specificCategory');
const InformationBank = require('../informationBank/informationBank');

class AdsClvlCategory extends Model {}

AdsClvlCategory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    adCategoryC: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.TINYINT,
      // 0 price nadarad 1 darad
    },
    exchange: {
      type: DataTypes.TINYINT,
      // 0 price nadarad 1 darad
    },
  },
  {
    sequelize,
    modelName: 'AdsClvlCategory',
  }
);

AdsClvlCategory.hasMany(Ad, {
  foreignKey: {
    name: 'frkCatC',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Ad.belongsTo(AdsClvlCategory, {
  foreignKey: {
    name: 'frkCatC',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

AdsClvlCategory.hasMany(SpecificCategory, {
  foreignKey: {
    name: 'frkCatC',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

SpecificCategory.belongsTo(AdsClvlCategory, {
  foreignKey: {
    name: 'frkCatC',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

AdsClvlCategory.hasMany(VirtualBillboard, {
  foreignKey: {
    name: 'frkCatC',
    type: DataTypes.BIGINT,
  },
});

VirtualBillboard.belongsTo(AdsClvlCategory, {
  foreignKey: {
    name: 'frkCatC',
    type: DataTypes.BIGINT,
  },
});

AdsClvlCategory.hasOne(AdStatusCategory, {
  foreignKey: {
    name: 'frkCatC',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

AdStatusCategory.belongsTo(AdsClvlCategory, {
  foreignKey: {
    name: 'frkCatC',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

AdsClvlCategory.hasMany(InformationBank, {
  foreignKey: {
    name: 'frkCatC',
    type: DataTypes.BIGINT,
  },
});

InformationBank.belongsTo(AdsClvlCategory, {
  foreignKey: {
    name: 'frkCatC',
    type: DataTypes.BIGINT,
  },
});

module.exports = AdsClvlCategory;
