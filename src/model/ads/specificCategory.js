const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const VirtualBillboard = require('../virtualBillboard/virtualBillboard');
const Ad = require('./ad');
const AdDetail = require('./adDetail');

class SpecificCategory extends Model {}

SpecificCategory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    specificCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SpecificCategory',
  }
);

SpecificCategory.hasMany(Ad, {
  foreignKey: {
    name: 'frkSpecificCat',
    type: DataTypes.BIGINT,
  },
});

Ad.belongsTo(SpecificCategory, {
  foreignKey: {
    name: 'frkSpecificCat',
    type: DataTypes.BIGINT,
  },
});

SpecificCategory.hasMany(AdDetail, {
  foreignKey: {
    name: 'frkSpecificCat',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

AdDetail.belongsTo(SpecificCategory, {
  foreignKey: {
    name: 'frkSpecificCat',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = SpecificCategory;
