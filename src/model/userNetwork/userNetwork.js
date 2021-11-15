const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const generateRandomCode = require('../../util/randomCode');
const Invite = require('./../Invite/Invite');

class UserNetwork extends Model {
  static async createUserNetworkCode(frkUser, username) {
    const randomCode = await generateRandomCode(4);

    const code = username + randomCode;

    const link = process.env.CLIENT_URL + 'SignUp?code=' + code;

    const userNetwork = await UserNetwork.create({
      code,
      link,
      frkUser,
    });

    return userNetwork;
  }
}

UserNetwork.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserNetwork',
  }
);

UserNetwork.hasMany(Invite, {
  foreignKey: {
    type: DataTypes.BIGINT,
    name: 'frkUserNetwork',
    allowNull: false,
  },
});

Invite.belongsTo(UserNetwork, {
  foreignKey: {
    type: DataTypes.BIGINT,
    name: 'frkUserNetwork',
    allowNull: false,
  },
});

module.exports = UserNetwork;
