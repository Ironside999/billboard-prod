const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const AdStatus = require('./adStatus');

class AdStatusCategory extends Model {}

AdStatusCategory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'status',
    },
  },
  {
    sequelize,
    modelName: 'AdStatusCategory',
  }
);

AdStatusCategory.hasMany(AdStatus, {
  foreignKey: {
    name: 'frkAdStsCat',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

AdStatus.belongsTo(AdStatusCategory, {
  foreignKey: {
    name: 'frkAdStsCat',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = AdStatusCategory;
