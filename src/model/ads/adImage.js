const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class AdImage extends Model {}

AdImage.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'AdImage',
  }
);

module.exports = AdImage;
