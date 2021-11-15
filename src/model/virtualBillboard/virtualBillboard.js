const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
const VirtualBbdCalender = require("./virtualBillboardCalendar");
const VirtualBbdDesign = require("./virtualBillboardDesign");

class VirtualBillboard extends Model {}

VirtualBillboard.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    position: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    importance: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    pricePerClick: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pricePerClickDiscount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pricePerVisit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pricePerVisitDiscount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    maxReserveDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "VirtualBillboard",
  }
);

VirtualBillboard.hasMany(VirtualBbdCalender, {
  foreignKey: {
    name: "frkVirtualBbd",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

VirtualBbdCalender.belongsTo(VirtualBillboard, {
  foreignKey: {
    name: "frkVirtualBbd",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

VirtualBillboard.hasMany(VirtualBbdDesign, {
  foreignKey: {
    name: "frkVirtualBbd",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

VirtualBbdDesign.belongsTo(VirtualBillboard, {
  foreignKey: {
    name: "frkVirtualBbd",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = VirtualBillboard;
