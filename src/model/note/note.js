const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class Note extends Model {}

Note.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relation: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      // 0 agahi...
    },
  },
  {
    sequelize,
    modelName: 'Note',
  }
);

module.exports = Note;
