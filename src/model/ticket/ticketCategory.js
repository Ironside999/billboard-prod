const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
const Ticket = require("./ticket");

class TicketCategory extends Model {}

TicketCategory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TicketCategory",
  }
);

TicketCategory.hasMany(Ticket, {
  foreignKey: {
    name: "frkTicketCategory",
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Ticket.belongsTo(TicketCategory, {
  foreignKey: {
    name: "frkTicketCategory",
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

module.exports = TicketCategory;
