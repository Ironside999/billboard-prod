const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class SocialNetwok extends Model {}

SocialNetwok.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    socialNetwok: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'socialNetwok',
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SocialNetwok',
  }
);

module.exports = SocialNetwok;
