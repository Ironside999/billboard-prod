const { Model, DataTypes } = require('sequelize');
const AppError = require('../../appError/appError');
const sequelize = require('../../db/db');

class AdPackage extends Model {}

AdPackage.init(
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
    iterationTime: {
      type: DataTypes.BIGINT,
      allowNull: false,
      set(val) {
        if (val >= 1 && val <= 24) {
          const iterate = val * 60 * 60 * 1000;
          this.setDataValue('iterationTime', iterate);
        } else {
          throw new AppError('Iteration should be between 1 - 24');
        }
      },
    },
    duration: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 90,
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.TINYINT,
      allowNull: false,
      // 1 vip, 2 super vip
    },
  },
  {
    sequelize,
    modelName: 'AdPackage',
  }
);

module.exports = AdPackage;
