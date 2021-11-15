const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const VirtualBbdRecord = require('./virtualBillboardRecord');

class VirtualBbdCalender extends Model {}

VirtualBbdCalender.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    finishDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    brandName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    punish: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      // 0 ok 1 punish
    },
  },
  {
    sequelize,
    modelName: 'VirtualBbdCalender',
  }
);

VirtualBbdCalender.hasMany(VirtualBbdRecord, {
  foreignKey: {
    name: 'frkBbdCalender',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

VirtualBbdRecord.belongsTo(VirtualBbdCalender, {
  foreignKey: {
    name: 'frkBbdCalender',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = VirtualBbdCalender;
