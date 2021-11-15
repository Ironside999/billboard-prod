const { DataTypes, Model } = require('sequelize');

const sequelize = require('../../db/db');
const User = require('../user/user');

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'role',
    },
    roleType: {
      type: DataTypes.ENUM('1', '2'),
      allowNull: false,
    },
    // billboardTeam 1, users 2
  },
  {
    sequelize,
    modelName: 'Role',
  }
);

Role.hasMany(User, {
  foreignKey: {
    name: 'frkRole',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

User.belongsTo(Role, {
  foreignKey: {
    name: 'frkRole',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = Role;
