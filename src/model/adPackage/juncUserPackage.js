const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
const Ad = require("../ads/ad");
const User = require("../user/user");
const AdPackage = require("./adPackage");
const AdPackageRecord = require("./adPackageRecord");

class JuncUserAdPackage extends Model {}

JuncUserAdPackage.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    active: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      // 1 active 2 tamoom shode
    },
    expireDatePackage: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "JuncUserAdPackage",
  }
);

User.belongsToMany(AdPackage, {
  through: {
    model: JuncUserAdPackage,
    unique: false,
  },
  foreignKey: {
    name: "frkUser",
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: false,
  },
  otherKey: {
    name: "frkAdPackage",
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: false,
  },
});

AdPackage.belongsToMany(User, {
  through: {
    model: JuncUserAdPackage,
    unique: false,
  },
  foreignKey: {
    name: "frkAdPackage",
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: false,
  },
  otherKey: {
    name: "frkUser",
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: false,
  },
});

JuncUserAdPackage.hasOne(Ad, {
  foreignKey: {
    name: "frkAdPackage",
    type: DataTypes.BIGINT,
  },
});

Ad.belongsTo(JuncUserAdPackage, {
  foreignKey: {
    name: "frkAdPackage",
    type: DataTypes.BIGINT,
  },
});

JuncUserAdPackage.hasMany(AdPackageRecord, {
  foreignKey: {
    name: "frkAdPackage",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

AdPackageRecord.belongsTo(JuncUserAdPackage, {
  foreignKey: {
    name: "frkAdPackage",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

User.hasMany(JuncUserAdPackage, {
  foreignKey: {
    name: "frkUser",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

JuncUserAdPackage.belongsTo(User, {
  foreignKey: {
    name: "frkUser",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

AdPackage.hasMany(JuncUserAdPackage, {
  foreignKey: {
    name: "frkAdPackage",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

JuncUserAdPackage.belongsTo(AdPackage, {
  foreignKey: {
    name: "frkAdPackage",
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = JuncUserAdPackage;
