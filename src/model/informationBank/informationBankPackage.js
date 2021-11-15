const { Model, DataTypes } = require('sequelize');
const AppError = require('../../appError/appError');
const sequelize = require('../../db/db');
const InformationBank = require('./informationBank');

class InfoBankPackage extends Model {}

InfoBankPackage.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'title',
    },
    duration: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },
    iterationTime: {
      type: DataTypes.BIGINT,
      allowNull: false,
      set(val) {
        if (val >= 1 && val <= 24) {
          const iteration = val * 60 * 60 * 1000;
          this.setDataValue('iterationTime', iteration);
        } else {
          throw new AppError('Iteration should be between 1 - 24', 400);
        }
      },
    },
    packageType: {
      type: DataTypes.TINYINT,
      allowNull: false,
      // 0 vip, 1 super vip
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
    },
    pricePerUpdate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'InfoBankPackage',
  }
);

InfoBankPackage.hasMany(InformationBank, {
  foreignKey: {
    name: 'frkInfoPack',
    type: DataTypes.BIGINT,
  },
});

InformationBank.belongsTo(InfoBankPackage, {
  foreignKey: {
    name: 'frkInfoPack',
    type: DataTypes.BIGINT,
  },
});

module.exports = InfoBankPackage;
