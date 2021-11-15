const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class Avatar extends Model {}

Avatar.init(
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
    modelName: 'Avatar',
  }
);

module.exports = Avatar;
