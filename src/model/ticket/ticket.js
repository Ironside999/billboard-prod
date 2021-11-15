const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class Ticket extends Model {}

Ticket.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reply: {
      type: DataTypes.TEXT,
    },
    replyDate: {
      type: DataTypes.DATE,
    },
    supportName: DataTypes.STRING,
    supportMobile: DataTypes.STRING,
    supportPhone: DataTypes.STRING,
    supportEmail: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      // 1 pending, 2 not answered, 3 answered
    },
  },
  {
    sequelize,
    modelName: "Ticket",
    paranoid: true,
  }
);

module.exports = Ticket;
